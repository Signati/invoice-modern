import {ReceptorCfdi} from '../interfaces/receptor.interface';

export class Receptor {
    private receptor: ReceptorCfdi = {} as ReceptorCfdi;

    constructor(receptor: ReceptorCfdi) {
        this.receptor = receptor;
    }

    public getReceptor(): ReceptorCfdi {
        return this.receptor;
    }
}