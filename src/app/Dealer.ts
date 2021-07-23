import {PlayerHand} from './PlayerHand';

export class Dealer {
    readonly hand: PlayerHand;
    readonly id: string = 'dealer';
    readonly name: string;
    constructor(name: string) {
      this.hand = new PlayerHand(-1, -1);// all parameters always -1
      this.name = name;
    }
}
