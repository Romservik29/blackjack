import { PlayerHand } from './PlayerHand';

export class Dealer{
    hand: PlayerHand; //maybe need own class for dealer hand
    id: string = "dealer";
    name: string;
    constructor(name: string){
        this.hand = new PlayerHand(-1)//place dealer always -1
        this.name = name 
    }
}