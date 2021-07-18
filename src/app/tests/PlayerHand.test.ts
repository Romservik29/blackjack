import { AnyRank, AnySuit } from './../Card';
import { Card } from '../Card';
import { PlayerHand } from '../PlayerHand';
describe('PlayerHand tests', () => {
    it('take card', () => {
        const hand = new PlayerHand(0, 0)
        hand.takeCard(new Card("Club", "10"))
        expect(hand.cards[0].rank).toBe("10")
        expect(hand.cards[0].suit).toBe("Club")
        expect(hand.cards[0].value).toBe(10)
    })
    it('hit', () => {
        const hand = new PlayerHand(0, 0)
        hand.hit(new Card("Club", "10"))
        expect(hand.cards[0].rank).toBe("10")
        expect(hand.cards[0].suit).toBe("Club")
        expect(hand.cards[0].value).toBe(10)
    })
    it('double', () => {
        const hand = new PlayerHand(0, 0)
        hand.double(new Card("Club", "10"))
        expect(hand.cards[0].rank).toBe("10")
        expect(hand.cards[0].suit).toBe("Club")
        expect(hand.cards[0].value).toBe(10)
    })
    it('stand', () => {
        const hand = new PlayerHand(0, 0)
        hand.stand()
        expect(hand.isStand).toBe(true)
    })
    describe.each([
        ["A", "A", 20],
        ["A", "10", 20],
        ["A", "K", 20],
        ["5", "5", 10]
    ])('get score', (a, b, expected) => {
        it('test', () => {
            const hand = new PlayerHand(0, 0)
            hand.takeCard(new Card("Club", a as AnyRank))
            hand.takeCard(new Card("Diamond", b as AnyRank))
            expect(hand.score).toBe(expected)
        })
    })
    describe('split', () => {
        it('error split when hand empty', () => {
            const hand = new PlayerHand(0, 0)
            expect(() => hand.split(0)).toThrowError()
        })
        it('isSplitable when 2 cards with 2 equal rank', () => {
            const hand = new PlayerHand(0, 0)
            hand.takeCard(new Card("Club", "7"))
            hand.takeCard(new Card("Diamond", "7"))
            expect(hand.isSplitable()).toBe(true)
        })
        it('1 card when splited', () => {
            const hand = new PlayerHand(0, 0)
            hand.takeCard(new Card("Club", "7"))
            hand.takeCard(new Card("Diamond", "7"))
            expect(hand.split(0).cards.length).toBe(1)
        })
        it('return hand when splited', () => {
            const hand = new PlayerHand(0, 0)
            hand.takeCard(new Card("Club", "7"))
            hand.takeCard(new Card("Diamond", "7"))
            const splitedHand = new PlayerHand(0, 0)
            splitedHand.takeCard(new Card("Club", "7"))
            splitedHand.idx = 1
            expect(hand.split(0)).toEqual(splitedHand)
        })
        it('has card 7 Diamond when splited', () => {
            const hand = new PlayerHand(0, 0)
            hand.takeCard(new Card("Club", "7"))
            hand.takeCard(new Card("Diamond", "7"))
            hand.split(0)
            expect(hand.cards[0]).toEqual(new Card("Diamond", "7"))
        })
    })
})