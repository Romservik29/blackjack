import { GameResult } from './game';
import { makeAutoObservable, when } from 'mobx';
import { Card } from './Card';

export class PlayerHand {
    placeId: number
    idx: number
    cards: Array<Card> = []
    isStand = false
    constructor(placeId: number, idx: number) {
        this.placeId = placeId
        this.idx = idx
        makeAutoObservable(this)
        when(
            () => this.isStandOrOver,
            () => this.stand()
        )
    }
    result(hand: PlayerHand): GameResult {
        if (this.score < 22 && this.score === hand.score) {
            return GameResult.TIE
        } else if (this.score < hand.score && hand.score < 22) {
            return GameResult.LOSE
        } else if (this.isBlackJack()) {
            return GameResult.BLACKJACK
        } else if (this.score > 21) {
            return GameResult.LOSE
        } else {
            return GameResult.WIN
        }

    }
    get isStandOrOver(): boolean {
        if (this.score > 21) {
            return true
        }
        return this.isStand
    }
    isBlackJack(): boolean {
        return this.cards.length === 2 && this.score === 21
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
    isSplitable(): boolean {
        if (this.cards.length === 2) {
            return this.cards[0].rank === this.cards[1].rank
        }
        throw new Error('have not first or second cards')
    }
    split(handIdx: number): PlayerHand {
        let newHand = new PlayerHand(this.placeId, handIdx + 1)
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
                if (card.rank === "A") {
                    aces += 1
                }
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
