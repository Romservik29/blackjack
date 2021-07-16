import { PlayerHand } from './PlayerHand';
import { TablePlace } from './TablePlace';
import { makeAutoObservable } from 'mobx';
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
interface Score {
    value: number,
    placeIdx: number,
    handIdx: number
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
    get allHandScors(): Score[] {
        const scores: Score[] = []
        this.handsHasBet.forEach((hand) => {
            scores.push({ value: hand.score, placeIdx: hand.placeId, handIdx: hand.idx })
        })
        return scores
    }
    get isAllStand(): boolean {
        return !this.places.some((place) => place.hands.some((hand) => hand.isStand === false))
    }
    get handsHasBet(): Array<PlayerHand> {
        let hands: Array<PlayerHand> = []
        this.places.forEach((place) => {
            if (place.bet > 0) {
                hands.push(...place.hands)
            }
        })
        return hands
    }
    get gameStageInfo(): string {
        switch (this.status) {
            case GameStatus.WAITING_BETS: {
                return "Waiting to players bets"
            }
            case GameStatus.DEALING: {
                return "Deaing cards"
            }
            case GameStatus.PLAYING_PLAYERS: {
                return "Players playing"
            }
            case GameStatus.PLAYING_DEALER: {
                return "Dealer playing"
            }
            case GameStatus.CALC_FINAL_RESULT: {
                return "Getting payments"
            }
            default: return ""
        }
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
            const hand = place.hands[handIdx]
            hand.hit(this.deck.takeCard())
            hand.stand()
            this.player.minusChips(place.bet)
            place.bet *= 2
        }
    }
    split(placeId: number, handIdx: number) {
        const place = this.places.find((place) => place.id === placeId)
        place?.hands.push(place?.hands[handIdx].split(handIdx))
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
    hasBet(): boolean {
        return this.places.some((place) => place.bet > 0)
    }
    deal(): void {
        this.places.forEach(place => {
            if (place.playerID !== null && place.bet > 0) {
                const hand = new PlayerHand(place.id, place.hands.length)
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
        const hands = this.handsHasBet
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
            place.hands.length = 0
        })
        this.dealer.hand.cards.length = 0
        console.log(this.places)
    }
}