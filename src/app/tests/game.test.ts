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
})