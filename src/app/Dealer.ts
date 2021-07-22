import {PlayerHand} from './PlayerHand';

export class Dealer {
    hand: PlayerHand;
    id: string = 'dealer';
    name: string;
    constructor(name: string) {
      this.hand = new PlayerHand(-1, -1);// all parameters always -1
      this.name = name;
    }
}
