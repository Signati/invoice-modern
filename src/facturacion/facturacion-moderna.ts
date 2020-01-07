import {createClientAsync} from 'soap';
import * as fs from 'fs';
import * as path from 'path';
// import * as moment from 'moment';
import * as moment from 'moment-timezone';
import {WriteStream} from 'fs';
import * as os from 'os';
import {js2xml, xml2json} from 'xml-js';
import {
    OptionsFactMod,
    OptionsSoapFactMod,
    ParamTimbrado,
    ResTimbrado,
    SaldoFactMod,
    SaldoXml, StadoCancelationCfdi
} from '../interfaces/FactMod'; // using this syntax, it does work





interface ObjecErroreCacelar {
    faultcode: string;
    faultstring: string;
}


const uuid_format = /[a-f0-9A-F]{8}-[a-f0-9A-F]{4}-[a-f0-9A-F]{4}-[a-f0-9A-F]{4}-[a-f0-9A-F]{12}/g;

export class FacturacionModerna {
    private url: string;
    private options: OptionsSoapFactMod = {} as OptionsSoapFactMod;
    private debug: number = 0;

    constructor(options: OptionsFactMod) {
        this.url = options.develoment ? 'https://t1demo.facturacionmoderna.com/timbrado/wsdl' : 'https://t2.facturacionmoderna.com/timbrado/wsdl';
        this.options.UserID = options.UserID;
        this.options.UserPass = options.UserPass
        this.debug = options.debug;
    }

    /**
     * @param {String} emisorRFC
     *  Establece el valor de quien emite la factura
     * @param {String} generarCBB
     * Establecer el valor a true, si desea que el Web services genere el CBB en
     * formato PNG correspondiente.
     * Nota: Utilizar está opción deshabilita 'generarPDF'
     *
     * @param {String} generarPDF Nota: Utilizar está opción deshabilita 'generarPDF'
     * Establecer el valor a true, si desea que el Web services genere la
     * representación impresa del XML en formato PDF.
     * Nota: Utilizar está opción deshabilita 'generarCBB'
     * @param {String} generarTXT
     *  Establecer el valor a true, si desea que el servicio genere un archivo de
     * texto simple con los datos del Nodo: TimbreFiscalDigital
     *  @param {String} text2CFDI
     *  Establece el layout o xml a timbrar ya sellado

     */
    public timbrar(options: ParamTimbrado): Promise<ResTimbrado> {
        return new Promise(async (resolve, reject) => {
            try {
                this.options.emisorRFC = options.emisorRFC;
                this.options.generarCBB = options.generarCBB ? true : false;
                this.options.generarPDF = options.generarPDF ? true : false;
                this.options.generarTXT = options.generarTXT ? true : false;
                if (options.text2CFDI) {
                    this.options.text2CFDI = Buffer.from(options.text2CFDI).toString('base64');
                } else {
                    reject({
                        error: 'layout o xml indefinido'
                    });
                }

                const cliente = await createClientAsync(this.url, {wsdl_options: {trace: 1}});
                const timbre = await cliente.requestTimbrarCFDIAsync({parameter: this.options});
                const data = timbre[0].return;
                const result: ResTimbrado = {} as ResTimbrado;
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        result[key] = data[key].$value;
                    }
                }
                const res = await this.getUuid(result.xml);
                result.uuid = res.uuid;
                result.total = res.total;
                resolve(result);
            } catch (e) {
                reject({
                    error: e
                });
            }
        });
    }

    public async consultarSaldo(rfc: string): Promise<SaldoFactMod> {
        return new Promise(async (resolve, reject) => {
            const cliente = await createClientAsync(this.url);
            try {
                this.options.RFC = rfc;
                const le = await cliente.consultarSaldoAsync({parameter: this.options});
                const saldo: SaldoXml[] = le[0].return.item;
                const obj: SaldoFactMod | any = {} as SaldoFactMod;
                for (const dato of saldo) {
                    obj[dato.key.$value] = dato.value.$value;
                }
                obj.restante = obj.timbres_asignados - obj.consumidos;
                resolve(obj);
            } catch (e) {
                if (this.debug === 1) {
                    this.log('SOAP request:\t' + cliente.lastRequest.toString('utf8'));
                    this.log('SOAP response:\t' + cliente.lastResponse.toString('utf8'));
                }
                reject({
                    error: e
                });
            }
        });
    }

    /**
     * Cancelar comprobante
     * @param {String} rfcEmisor
     * @param {String} uuid
     */

    /*
       *
       * GT05: Cancelacion directa
       * GT11: Cancelacion con aceptacion de recepto
       *
       */
    cancelar(emisorRFC: string, uuid: string): Promise<{ Code: string, Message: string }> {
        return new Promise(async (resolve, reject) => {
            const cliente = await createClientAsync(this.url);
            try {
                this.options.emisorRFC = emisorRFC;
                this.options.uuid = uuid;
                const resultado = await cliente.requestCancelarCFDIAsync({parameter: this.options});
                const data = resultado[0].return;
                const result: any = {};
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        result[key] = data[key].$value;
                    }
                }
                resolve(result);
            } catch (e) {
                if (this.debug === 1) {
                    this.log('SOAP request:\t' + cliente.lastRequest.toString('utf8'));
                    this.log('SOAP response:\t' + cliente.lastResponse.toString('utf8'));
                }
                let error: any;

                if (e.root) {
                    error = e.root;
                    error = error.Envelope;
                    error = error.Body;
                    error = error.Fault;
                } else {
                    error = 'desconocido';
                }
                reject({message: error});
            }
        });
    }

    async estadoCancelacion(emisorRFC: string, receptorRFC: string, UUID: string, total: string): Promise<StadoCancelationCfdi> {
        return new Promise(async (resolve, reject) => {
            const cliente = await createClientAsync(this.url);
            try {
                this.options.emisorRFC = emisorRFC;
                this.options.receptorRFC = receptorRFC;
                this.options.UUID = UUID;
                this.options.total = total;
                const resultado: any[] = await cliente.consultarEstatusCFDIAsync({parameter: this.options});
                const data = resultado[0].return;
                const result: StadoCancelationCfdi = {} as StadoCancelationCfdi;
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        result[key] = data[key].$value ? data[key].$value : 'No disponible';
                    }
                }
                resolve(result);
            } catch (error) {
                if (this.debug === 1) {
                    this.log('SOAP request:\t' + cliente.lastRequest.toString('utf8'));
                    this.log('SOAP response:\t' + cliente.lastResponse.toString('utf8'));
                }
                reject({message: error});
            }
        });
    }

    async log(text: string) {
        const log = path.join(__dirname, '..', '..', '..', 'src', 'common', 'FacturacionModerna', 'log.log');
        if (!fs.existsSync(log)) {
            const fullPath = path.join(os.tmpdir(), `amir.xml`);
            fs.writeFileSync(log, '', 'utf8');
        }
        const fecha = moment().tz('America/Mexico_City').format('YYYY-MM-DDThh:mm:ss') + '\t' + text + '\n\n';
        fs.appendFileSync(log, fecha);
    }

    private async getUuid(file: string): Promise<{ uuid: string, total: string }> {
        const fileNameTemp = Date.now();
        const fullPath = path.join(os.tmpdir(), `${fileNameTemp.toString()}.xml`);
        fs.writeFileSync(fullPath, new Buffer(file, 'base64'), 'utf8');
        const route = fs.readFileSync(fullPath).toString('utf8');
        const xml: any = await xml2json(route, {
            sanitize: true,
            addParent: true,
            compact: true,
            ignoreComment: true,
        });
        fs.unlinkSync(fullPath);
        const a: any = {data: JSON.parse(xml)}; // JSON.stringify(xml);
        return {
            uuid: await a.data['cfdi:Comprobante']['cfdi:Complemento']['tfd:TimbreFiscalDigital']._attributes.UUID.toString(),
            total: await a.data['cfdi:Comprobante']._attributes.Total.toString(),
        };
    }

    async getTotalXml(pathXml: string) {
        if (fs.existsSync(pathXml)) {
            const route = fs.readFileSync(pathXml).toString('utf8');
            const xml: any = await xml2json(route, {
                sanitize: true,
                addParent: true,
                compact: true,
                ignoreComment: true,
            });
            const a: any = {data: JSON.parse(xml)}; // JSON.stringify(xml);
            return await a.data['cfdi:Comprobante']._attributes.Total.toString();
        } else {
            return '0';
        }
    }
}
