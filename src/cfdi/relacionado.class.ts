import {RelacionadoCfdi} from '../interfaces/relacionado.interface';

export class Relacionado {
    private relacion: RelacionadoCfdi = {} as RelacionadoCfdi;

    constructor(tipoRelacion: string) {
        this.relacion.TipoRelacion = tipoRelacion
    }

    public addRelationUuid(uuid: string[]) {
        this.relacion.UUID = uuid;
    }

    public getRelation(): RelacionadoCfdi {
        return this.relacion;
    }
}