import {ImpuestoCfdi, ImpuestoCfdiAttributes, TrasladosRetencion} from '../interfaces/impuesto.interface';

export class Impuesto {
    private impuesto: ImpuestoCfdi = {} as ImpuestoCfdi;


    constructor(impuesto: ImpuestoCfdiAttributes = {} as ImpuestoCfdiAttributes) {
        if (impuesto.totalImpuestosRetenidos)
            this.impuesto.totalImpuestosRetenidos = impuesto.totalImpuestosRetenidos;
        if (impuesto.totalImpuestosTrasladados)
            this.impuesto.totalImpuestosTrasladados = impuesto.totalImpuestosTrasladados;
    }

    public async addTraslados(translados: TrasladosRetencion[]) {
        this.impuesto.traslados = translados;
        return this;
    }

    public async addRetenciones(retenciones: TrasladosRetencion[]) {
        this.impuesto.retenciones = retenciones;
        return this;
    }

    public getImpuestos(): ImpuestoCfdi {
        return this.impuesto;
    }

}