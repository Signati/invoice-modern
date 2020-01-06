import {ConceptoCfdi, ConceptProperty} from '../interfaces/concepto.interface';
import {ImpuestoCfdi, TrasladosRetencion} from '../interfaces/impuesto.interface';

export class Concepto {
    private concept: ConceptoCfdi = {} as ConceptoCfdi;

    /**
     * @param {Object} concepto
     * @param {String} concepto.ClaveProdServ
     * @param {String} concepto.ClaveUnidad
     * @param {String} concepto.NoIdentificacion
     * @param {String} concepto.Cantidad
     * @param {String} concepto.Unidad
     * @param {String} concepto.Descripcion
     * @param {String} concepto.ValorUnitario
     * @param {String} concepto.Importe
     * @param {String} concepto.Descuento
     * @param {Object} concepto.Impuestos
     * @param {Object[]} concepto.Impuestos.Traslados
     * @param {Object[]} concepto.Impuestos.Retenciones
     * @param {String} concepto.Impuestos.Traslados.Base
     * @param {String} concepto.Impuestos.Traslados.Impuesto
     * @param {String} concepto.Impuestos.Traslados.TipoFactor
     * @param {String} concepto.Impuestos.Traslados.TasaOCuota
     * @param {String} concepto.Impuestos.Traslados.Importe
     * @param {String} concepto.Impuestos.Retenciones.Base
     * @param {String} concepto.Impuestos.Retenciones.Impuesto
     * @param {String} concepto.Impuestos.Retenciones.TipoFactor
     * @param {String} concepto.Impuestos.Retenciones.TasaOCuota
     * @param {String} concepto.Impuestos.Retenciones.Importe
     */
    constructor(concept: ConceptProperty) {
        this.concept = concept
    }

    /**
     * @param {Object} traslado
     * @param {String} traslado.Base
     * @param {String} traslado.Impuesto
     * @param {String} traslado.TipoFactor
     * @param {String} traslado.TasaOCuota
     * @param {String} traslado.Importe
     */
    public traslado(transfer: TrasladosRetencion) {

        if (!this.concept.Impuestos) {
            this.concept.Impuestos = {} as ImpuestoCfdi;
        }
        if (!this.concept.Impuestos.traslados) {
            this.concept.Impuestos.traslados = [];
        }
        this.concept.Impuestos.traslados.push(transfer)
        return this;
    }

    /**
     * @param {Object} retencion
     * @param {String} retencion.Base
     * @param {String} retencion.Impuesto
     * @param {String} retencion.TipoFactor
     * @param {String} retencion.TasaOCuota
     * @param {String} retencion.Importe
     */
    public retencion(retention: TrasladosRetencion) {
        if (!this.concept.Impuestos) {
            this.concept.Impuestos = {} as ImpuestoCfdi
        }
        if (!this.concept.Impuestos.retenciones) {
            this.concept.Impuestos.retenciones = [];
        }

        this.concept.Impuestos.retenciones.push(retention)
        return this;
    }

    getConcept(): ConceptoCfdi {
        return this.concept;
        // pushConcepto(cfdi.jxml, this.concepto);
    }
}