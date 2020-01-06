import {EmisorCfdi} from '../interfaces/emisor.interface';

export class Emisor {
    private emisor: EmisorCfdi = {} as EmisorCfdi;

    constructor(emisor: EmisorCfdi) {
        this.emisor = emisor;
    }

    public getEmisor(): EmisorCfdi {
        return this.emisor;
    }
}