import { makeAutoObservable } from 'mobx';
import { Card } from './Card';

export class PlayerHand {
    placeId: number
    cards: Array<Card> = []
    isStand = false
    constructor(placeId: number) {
        this.placeId = placeId
        makeAutoObservable(this)
    }
    takeCard(card: Card): void {
        this.cards.push(card)
    }
    hit(card: Card): void {
        this.cards.push(card)
    }
    double(card: Card) {
        this.cards.push(card)
    }
    isSplitable(): boolean{
        if (this.cards.length === 2) {
            return this.cards[0].rank === this.cards[1].rank
        }
        throw new Error('have not first or second cards')
    }
    split(): PlayerHand {
        let newHand = new PlayerHand(this.placeId)
        if (this.isSplitable()) {
            newHand.cards.push(this.cards.shift()!)
            return newHand
        }
        throw new Error("Haven't card")
    }
    stand() {
        this.isStand = true
    }
    get score(): number {
        let value = 0
        let aces = 0
        this.cards.forEach(
            card => {
                if (card.rank === "A") aces += 1
                value += card.value
            }
        )
        for (let i = 0; i < aces; i++) {
            if (value > 21) {
                value -= 10
            }
        }
        return value
    }
}
