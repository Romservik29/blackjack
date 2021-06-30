import { PlayerHand } from './../PlayerHand';
import { Card } from '../Card';
import { Game } from './../game';
describe("game cycle", () => {
    describe("dealing with bet and sit player", () => {
        const game = new Game("andry", "Nikolay")
        game.addPlace(0)
        game.setPlace(game.player.id, 0)
        const setedPlace = game.places.find((place) => place.playerID === game.player.id)
        setedPlace?.betChips(100)
        game.deal()
        it('dealler have 2 cards', () => {
            expect(game.dealer.hand.cards.length).toBe(2)
        })
        it('player sit on place', () => {
            expect(setedPlace).toBeDefined()
        })
        it('deck have 48 cards', () => {
            expect(game.deck.deck.length).toBe(48)
        })
        it('playing player have 2 cards', () => {
            expect(setedPlace?.hands[0].cards.length).toBe(2)
        })
    })
    describe("final result with bet and sit player", () => {
        const game = new Game("andry", "Nikolay")
        game.addPlace(0)
        game.setPlace(game.player.id, 0)
        const setedPlace = game.places.find((place) => place.playerID === game.player.id)
        game.addChipsToBet(game.player.id, 0, 100)
        const playerHand = new PlayerHand(setedPlace?.id!)
        setedPlace?.hands.push(playerHand)
        playerHand.cards = [new Card("Club", "10"), new Card("Diamond", "10")]
        game.dealer.hand.cards = [new Card("Club", "10"), new Card("Diamond", "5")]
        game.culcFinalResult()
        it('bet on place 1 === 100', () => {
            expect(game.places[0].bet).toBe(100)
        })
        it('place playerId equal Nikolay', () => {
            expect(game.places[0].playerID).toBe("Nikolay")
        })
        it('hands has 1 bet', () => {
            expect(game.handsHasBet().length).toEqual(1)
        })
        it('player have 5100 chips', () => {
            expect(game.player.chips).toBe(5100)
        })
    })
    describe('test functions', () => {
        it('result equal win', () => {
            const game = new Game("1", "2", 5)
            expect(game.getPlayerResult(10, 5)).toBe("win")
        })
        it('result equal lose', () => {
            const game = new Game("1", "2", 5)
            expect(game.getPlayerResult(5,10)).toBe("lose")
        })
        it('result equal tie', () => {
            const game = new Game("1", "2", 5)
            expect(game.getPlayerResult(10,10)).toBe("tie")
        })
    })
})