import { PlayerHand } from './PlayerHand';
import { TablePlace } from './TablePlace';
import { action, makeAutoObservable, observable, observe, toJS } from 'mobx';
import { Dealer } from './Dealer';
import { Deck } from './Deck';
import { Player } from './Player';
export enum GameStatus {
    WAITING_BETS, //waiting while player bet
    DEALING, // dealing cards all players and dealer
    PLAYING_PLAYERS, //each player do hit|double|split|stand
    PLAYING_DEALER, // dealer do hits before hand score < some number
    CALC_FINAL_RESULT, // before all player stand culculate final result
    CLEAR_CARDS,
}

export class Game {
    player: Player;
    dealer: Dealer;
    deck: Deck;
    status: GameStatus;
    players: Array<Player> = [];
    places: Array<TablePlace> = [];
    constructor(dealerName: string, playerID: string, chips = 5000, deck = new Deck()) {
        this.player = new Player(playerID, chips)
        this.players.push(this.player)
        this.dealer = new Dealer(dealerName)
        this.deck = deck
        this.status = GameStatus.WAITING_BETS
        makeAutoObservable(this)
    }
    getStatus = (): GameStatus => {
        return this.status
    }
    get isAllStand(): boolean {
        return !this.places.some((place) => place.hands.some((hand) => hand.isStand === false))
    }
    setStatus = (status: GameStatus): void => {
        this.status = status
    }
    getPlace(placeId: number): TablePlace {
        const place = this.places.find((place) => place.id === placeId)
        if (place) {
            return place
        }
        throw new Error("place not find")
    }
    setPlace(playerId: string, placeId: number) {
        const place = this.getPlace(placeId)
        place.setPlayer(playerId)
    }
    addChipsToBet(playerId: string, placeId: number) {
        const player = this.players.find((player) => player.id === playerId)!
        const place = this.places.find((place) => place.id === placeId)!
        player.minusChips(this.player.chipInHand)
        place.addChipsToBet(this.player.chipInHand)
    }
    clearBet(placeId: number) {
        const place = this.places.find((place) => place.id === placeId)
        const player = this.players.find((player) => player.id === place?.playerID)
        if (place) {
            player?.addChips(place?.bet)
            place.bet = 0
        }
    }
    hit(placeId: number, handIdx: number) {
        const place = this.places.find((place) => place.id === placeId)
        place?.hands[handIdx].hit(this.deck.takeCard())
    }
    double(placeId: number, handIdx: number) {
        const place = this.places.find((place) => place.id === placeId)
        if (place) {
            place.hands[handIdx].hit(this.deck.takeCard())
            this.player.minusChips(place.bet)
            place.bet *= 2
            // addChipsToBet(playerId, placeId, place.bet)
        }
    }
    split(placeId: number, handIdx: number) {
        const place = this.places.find((place) => place.id === placeId)
        place?.hands.push(place?.hands[handIdx].split())
    }
    stand(placeId: number, handIdx: number) {
        const place = this.places.find((place) => place.id === placeId)
        if (place) {
            place?.hands[handIdx].stand()
        } else {
            throw new Error("place not found")
        }
    }
    addPlace(id: number): TablePlace {
        const place = new TablePlace(id)
        this.places.push(place)
        return place
    }
    addPlayer(id: string, chips: number): void {
        this.players.push(new Player(id, chips))
    }
    newShuffleDeck(): void {
        let newDeck = new Deck()
        newDeck.shuffle()
        this.deck = newDeck
    }
    getHandsHasBet(): Array<PlayerHand> {
        let hands: Array<PlayerHand> = []
        this.places.forEach((place) => {
            if (place.bet > 0) {
                hands.push(...place.hands)
            }
        })
        return hands
    }
    hasBet(): boolean {
        return this.places.some((place) => place.bet > 0)
    }
    deal(): void {
        this.places.forEach(place => {
            if (place.playerID !== null && place.bet > 0) {
                const hand = new PlayerHand(place.id)
                hand.cards = [this.deck.takeCard(), this.deck.takeCard()]
                place.hands.push(hand);
            }
        })
        this.dealer.hand.cards = [this.deck.takeCard(), this.deck.takeCard()]
    }
    playDealer(maxValue: number): void {
        while (this.dealer.hand.score < maxValue) {
            this.dealer.hand.takeCard(this.deck.takeCard())
        }
    }

    getPlayer(playerId: string): Player {
        const player = this.players.find((player) => playerId === player.id)
        if (player) {
            return player
        }
        throw new Error("player not found")
    }

    getPlayerResult(playerHandVal: number, dealerHandVal: number): "win" | "tie" | "lose" {
        if (playerHandVal === dealerHandVal) {
            return "tie"
        } else if (playerHandVal > dealerHandVal && playerHandVal < 22) {
            return "win"
        }
        return "lose"
    }
    calcFinalResult(): void {
        const hands = this.getHandsHasBet()
        hands.forEach((hand) => {
            const result = this.getPlayerResult(hand.score, this.dealer.hand.score)
            if (result === "win") {
                const place = this.getPlace(hand.placeId)
                const player = this.getPlayer(place.playerID!)
                player.addChips(place.bet * 2)
            } else if (result === "tie") {
                const place = this.places.find((place) => place.id === hand.placeId)!
                this.player.addChips(place.bet)
            }
        })
    }
    clearTable(): void {
        this.places.forEach((place) => {
            place.bet = 0
            // if (place.hands[0] !== undefined) {
            //     place.hands.length = 1
            //     place.hands[0].cards.length = 0
            //     place.hands[0].isStand = false
            // }

            place.hands.length = 0
        })
        this.dealer.hand.cards.length = 0
        console.log(this.places)
    }
}