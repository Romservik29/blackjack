import { Card } from './Card';
import { PlayerHand } from './PlayerHand';
describe('PlayerHand tests', () => {
    it('take card', () => {
        const hand = new PlayerHand(0)
        hand.takeCard(new Card("Club", "10"))
        expect(hand.cards[0].rank).toBe("10")
        expect(hand.cards[0].suit).toBe("Club")
        expect(hand.cards[0].value).toBe(10)
    })
    it('hit', () => {
        const hand = new PlayerHand(0)
        hand.hit(new Card("Club", "10"))
        expect(hand.cards[0].rank).toBe("10")
        expect(hand.cards[0].suit).toBe("Club")
        expect(hand.cards[0].value).toBe(10)
    })
    it('double', () => {
        const hand = new PlayerHand(0)
        hand.double(new Card("Club", "10"))
        expect(hand.cards[0].rank).toBe("10")
        expect(hand.cards[0].suit).toBe("Club")
        expect(hand.cards[0].value).toBe(10)
    })
    describe('split', () => {
        it('error split when hand empty', () => {
            const hand = new PlayerHand(0)
            expect(() => hand.split()).toThrowError()
        })
        it('isSplitable when 2 cards with 2 equal rank', () => {
            const hand = new PlayerHand(0)
            hand.cards = [new Card("Club", "7"), new Card("Diamond", "7")]
            expect(hand.isSplitable()).toBe(true)
        })
        it('1 card when splited', () => {
            const hand = new PlayerHand(0)
            hand.cards = [new Card("Club", "7"), new Card("Diamond", "7")]
            expect(hand.split().cards.length).toBe(1)
        })
        it('return hand when splited', () => {
            const hand = new PlayerHand(0)
            hand.cards = [new Card("Club", "7"), new Card("Diamond", "7")]
            const splitedHand = new PlayerHand(0)
            splitedHand.cards = [new Card("Club", "7")]
            expect(hand.split()).toEqual(splitedHand)
        })
        it('has card 7 Diamond when splited', () => {
            const hand = new PlayerHand(0)
            hand.cards = [new Card("Club", "7"), new Card("Diamond", "7")]
            hand.split()
            expect(hand.cards[0]).toEqual(new Card("Diamond", "7"))
        })
    })
})