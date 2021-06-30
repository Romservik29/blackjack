import { Card } from '../Card';
describe("get value card", () => {
    it("rank 4 === 4", () => {
        const card = new Card("Club", "4")
        // @ts-ignore
        const cardVal = card.getValue(card.rank)
        expect(cardVal).toBe(4)
    })
    it("rank K === 10", () => {
        const card = new Card("Club", "K")
        // @ts-ignore
        const cardVal = card.getValue(card.rank)
        expect(cardVal).toBe(10)
    })
    it("rank A === 11", () => {
        const card = new Card("Club", "A")
        // @ts-ignore
        const cardVal = card.getValue(card.rank)
        expect(cardVal).toBe(11)
    })
    
})

describe("create card", ()=>{
    it("suit === suit", ()=>{
        const card = new Card("Club", "A")
        expect(card.suit).toBe("Club")
    })
    it("rank === rank", ()=>{
        const card = new Card("Club", "A")
        expect(card.rank).toBe("A")
    })
})
