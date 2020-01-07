export interface OptionsSoapFactMod {
    UserPass: string;
    UserID: string;
    emisorRFC?: string;
    receptorRFC?: string;
    UUID?: string;
    RFC?: string;
    uuid?: string;
    generarCBB?: boolean;
    generarPDF?: boolean;
    generarTXT?: boolean;
    text2CFDI?: string;
    total?: string;

}

export interface OptionsFactMod {
    develoment: boolean;
    UserPass: string;
    UserID: string;
    debug: number;
}

export interface ResTimbrado {
    xml: string,
    txt?: string,
    png?: string,
    pdf?: string,
    uuid?: string,
    total: string,
}

export interface ParamTimbrado {
    emisorRFC: string;
    generarCBB?: boolean;
    generarPDF?: boolean;
    generarTXT?: boolean;
    text2CFDI: string;
}

export interface SaldoXml {
    key: {
        '$value': 'status';
    };
    value: {
        '$value': '1';
    };
}

export interface SaldoFactMod {
    status: number;
    timbres_asignados: number;
    fecha_alta: string;
    consumidos: number;
    restante: number;
}

export interface StadoCancelationCfdi {
    http_code: string;
    estado: string;
    esCancelable: string;
    estatusCancelacion: string;
    EstatusFM: string;
}