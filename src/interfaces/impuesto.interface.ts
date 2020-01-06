export interface ImpuestoCfdiAttributes {
    totalImpuestosRetenidos?: string;
    totalImpuestosTrasladados?: string;
}

export interface ImpuestoCfdi {
    totalImpuestosRetenidos: string;
    totalImpuestosTrasladados: string;
    traslados: TrasladosRetencion[]
    retenciones: TrasladosRetencion[]
}

export interface TrasladosRetencion {
    Base?: string;
    Impuesto: string;
    TipoFactor: string;
    TasaOCuota: string;
    Importe: string;
}