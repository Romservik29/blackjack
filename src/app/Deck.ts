import { AnyRank, AnySuit, Card } from './Card';
const suits = ["Heart","Diamond","Club","Spade"] as const
const rank = ["2","3", "4", "5", "6", "7" , "8", "9", "10" , "J", "Q", "K","A"] as const

export class Deck {
    deck: Array<Card> = [];
    constructor(){
        suits.forEach((suit: AnySuit)=>{
            rank.forEach( (card: AnyRank) =>{
                this.deck.push(new Card(suit, card))
            })
        })
    }
    shuffle():void {
        for (let i = this.deck.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * i);
            let temp = this.deck[i];
            this.deck[i] = this.deck[j];
            this.deck[j] = temp;
        }
    }
    takeCard():Card{
        return this.deck.shift()!
    }
}