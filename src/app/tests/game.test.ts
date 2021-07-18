
import { PlayerHand } from './../PlayerHand';
import { Card } from '../Card';
import { Game, GameResult } from './../game';
describe("game cycle", () => {
    describe("dealing with bet and sit player", () => {
        const game = new Game("andry", "Nikolay")
        game.addPlace(0)
        game.setPlace(0)
        const setedPlace = game.places.find((place) => place.playerID === game.player.id)
        game.player.chipInHand = 100;
        setedPlace?.addChipsToBet(100)
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
        describe('win', () => {
            const game = new Game("andry", "Nikolay")
            game.addPlace(0)
            game.setPlace(0)
            // @ts-ignore
            const setedPlace = game.getPlace(0)
            game.player.chipInHand = 100;
            game.addChipsToBet(0)
            const playerHand = new PlayerHand(setedPlace?.id, 0)
            setedPlace?.hands.push(playerHand)
            playerHand.cards = [new Card("Club", "10"), new Card("Diamond", "10")]
            game.dealer.hand.cards = [new Card("Club", "10"), new Card("Diamond", "5")]
            game.calcFinalResult()
            it('player have 5100 chips', () => {
                expect(game.player.chips).toBe(5100)
            })
        })
        describe('lose', () => {
            const game = new Game("andry", "Nikolay")
            game.addPlace(0)
            game.setPlace(0)
            // @ts-ignore
            const setedPlace = game.getPlace(0)
            game.player.chipInHand = 100;
            game.addChipsToBet(0)
            const playerHand = new PlayerHand(setedPlace?.id, 0)
            setedPlace?.hands.push(playerHand)
            playerHand.cards = [new Card("Club", "10"), new Card("Diamond", "5")]
            game.dealer.hand.cards = [new Card("Spade", "10"), new Card("Heart", "10")]
            game.calcFinalResult()
            it('player have 4900 chips', () => {
                expect(game.player.chips).toBe(4900)
            })
        })
        describe('tie', () => {
            const game = new Game("andry", "Nikolay")
            game.addPlace(0)
            game.setPlace(0)
            // @ts-ignore
            const setedPlace = game.getPlace(0)
            game.player.chipInHand = 100;
            game.addChipsToBet(0)
            const playerHand = new PlayerHand(setedPlace?.id, 0)
            setedPlace?.hands.push(playerHand)
            playerHand.cards = [new Card("Club", "10"), new Card("Diamond", "10")]
            game.dealer.hand.cards = [new Card("Heart", "10"), new Card("Spade", "10")]
            game.calcFinalResult()
            it('player have 5000 chips', () => {
                expect(game.player.chips).toBe(5000)
            })
        })

    })
    describe('test functions', () => {
        describe('getPlayersResult', () => {
            it('result equal win', () => {
                const game = new Game("1", "2", 5)
                const hand = new PlayerHand(-1, -1)
                hand.cards = [new Card("Diamond", "5"), new Card("Heart", "5")]
                game.dealer.hand = hand
                const playerHand = new PlayerHand(0, 0)
                playerHand.cards = [new Card("Diamond", "5"), new Card("Heart", "10")]
                expect(game.getHandResult(playerHand)).toBe(GameResult.WIN)
            })
            it('result equal lose', () => {
                const game = new Game("1", "2", 5)
                const hand = new PlayerHand(-1, -1)
                hand.cards = [new Card("Diamond", "10"), new Card("Heart", "5")]
                game.dealer.hand = hand
                const playerHand = new PlayerHand(0, 0)
                playerHand.cards = [new Card("Diamond", "5"), new Card("Heart", "5")]
                expect(game.getHandResult(playerHand)).toBe(GameResult.LOSE)
            })
            it('result equal tie', () => {
                const game = new Game("1", "2", 5)
                const hand = new PlayerHand(-1, -1)
                hand.cards = [new Card("Diamond", "5"), new Card("Heart", "5")]
                game.dealer.hand = hand
                const playerHand = new PlayerHand(0, 0)
                playerHand.cards = [new Card("Diamond", "5"), new Card("Heart", "5")]
                expect(game.getHandResult(playerHand)).toBe(GameResult.TIE)
            })
        })
    })
})