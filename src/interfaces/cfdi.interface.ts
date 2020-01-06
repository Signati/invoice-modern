import {RelacionadoCfdi} from './relacionado.interface';
import {EmisorCfdi} from './emisor.interface';
import {ReceptorCfdi} from './receptor.interface';
import {ImpuestoCfdi} from './impuesto.interface';
import {ConceptoCfdi} from './concepto.interface';

export interface CfdiXml {
    datos: DatosCfdi;
    relacionado: RelacionadoCfdi;
    emisor: EmisorCfdi;
    receptor: ReceptorCfdi;
    conceptos: ConceptoCfdi[];
    impuestos: ImpuestoCfdi;
    complemento: any;
}

export interface DatosCfdi {
    // Version?: string;
    Serie: string;
    Folio: string;
    // Fecha: string;
    // Sello: string;
    FormaPago: string;
    // NoCertificado: string;
    // Certificado: string;
    condicionesDePago ?: string;
    SubTotal: string;
    Descuento: string;
    Moneda: string;
    Total: string;
    TipoDeComprobante: string;
    MetodoPago: string;
    LugarExpedicion: string;
}