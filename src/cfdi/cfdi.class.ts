import {CfdiXml, DatosCfdi} from '../interfaces/cfdi.interface';
import {Emisor} from './emisor.class';
import {Receptor} from './receptor.class';
import {Relacionado} from './relacionado.class';
import {EmisorCfdi} from '../interfaces/emisor.interface';
import {ReceptorCfdi} from '../interfaces/receptor.interface';
import {RelacionadoCfdi} from '../interfaces/relacionado.interface';
import {Impuesto} from './impuesto.class';
import {Concepto} from './concepto.class';

export class CfdiClass {
    private cfdi: CfdiXml = {} as CfdiXml;

    constructor(data: DatosCfdi) {
        this.cfdi.datos = data;
    }

    public relacion(relation: RelacionadoCfdi) {
        const rel = new Relacionado(relation.TipoRelacion);
        rel.addRelationUuid(relation.UUID);
        this.cfdi.relacionado = rel.getRelation();
    }

    public emisor(emisor: EmisorCfdi) {
        this.cfdi.emisor = new Emisor(emisor).getEmisor();
        return this;
    }

    public receptor(receptor: ReceptorCfdi) {
        this.cfdi.receptor = new Receptor(receptor).getReceptor();
        return this;
    }

    public concepto(concept: Concepto) {
        if (!this.cfdi.conceptos) {
            this.cfdi.conceptos = []
        }
        this.cfdi.conceptos.push(concept.getConcept());
        return this
    }

    public impuesto(impuesto: Impuesto) {
        this.cfdi.impuestos = impuesto.getImpuestos();
        return this;
    }

    public getCfdi(): CfdiXml {
        return this.cfdi;
    }
}