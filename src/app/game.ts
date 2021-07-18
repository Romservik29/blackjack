import { PlayerHand } from './PlayerHand';
import { TablePlace } from './TablePlace';
import { computed, makeAutoObservable, makeObservable, observable, when, reaction } from 'mobx';
import { Dealer } from './Dealer';
import { Deck } from './Deck';
import { Player } from './Player';
import HandScore from '../components/HandScore';
export enum GameStatus {
    WAITING_BETS, //waiting while player bet
    DEALING, // dealing cards all players and dealer
    PLAYING_PLAYERS, //each player do hit|double|split|stand
    PLAYING_DEALER, // dealer do hits before hand score < some number
    CALC_FINAL_RESULT, // before all player stand culculate final result
    CLEAR_CARDS,
}
export enum GameResult {
    BLACKJACK,
    WIN,
    TIE,
    LOSE,
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
    interval: number | null;
    timer: number;
    constructor(dealerName: string, playerID: string, chips = 5000, deck = new Deck()) {
        this.player = new Player(playerID, chips)
        this.players.push(this.player)
        this.dealer = new Dealer(dealerName)
        this.deck = deck
        this.interval = null
        this.timer = 0
        this.status = GameStatus.WAITING_BETS
        this.setTimer(10)
        makeAutoObservable(this)
        reaction(
            () => this.timer,
            timer => {
                if (this.timer < 0 && this.status === GameStatus.WAITING_BETS)
                    if (this.hasBet) {
                        this.deal()
                    } else {
                        this.setTimer(10)
                    }
            }
        )
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
                return "Place your bets"
            }
            case GameStatus.DEALING: {
                return "Dealing cards"
            }
            case GameStatus.CALC_FINAL_RESULT: {
                return "Getting payments"
            }
            default: return ""
        }
    }
    setTimer(time: number): void {
        if (this.interval) {
            clearInterval(this.interval)
        }
        this.timer = time
        this.interval = window.setInterval(() => {
            this.timer -= 1
            if (this.timer < 0) {
                clearInterval(this.interval!)
            }
        }, 1000)

    }
    private getPlace(placeId: number): TablePlace {
        const place = this.places.find((place) => place.id === placeId)
        if (place) {
            return place
        }
        throw new Error("can't find place")
    }
    setPlace(placeId: number): void {
        const place = this.getPlace(placeId)
        place.setPlayer(this.player.id)
    }
    addChipsToBet(placeId: number): void {
        const place = this.getPlace(placeId)
        this.player.minusChips(this.player.chipInHand)
        place.addChipsToBet(this.player.chipInHand)
    }
    clearBet(placeId: number): void {
        const place = this.getPlace(placeId)
        this.player.addChips(place.bet)
        place.bet = 0
    }
    hit(placeId: number, handIdx: number): void {
        const place = this.getPlace(placeId)
        const hand = place.hands[handIdx]
        if (hand.isStandOrOver) {
            return
        } else {
            hand.hit(this.deck.takeCard())
        }
    }
    double(placeId: number, handIdx: number): void {
        const place = this.getPlace(placeId)
        const hand = place.hands[handIdx]
        if (hand.isStandOrOver) {
            return
        }
        hand.hit(this.deck.takeCard())
        hand.stand()
        this.player.minusChips(place.bet)
        place.bet *= 2
    }
    split(placeId: number, handIdx: number): void {
        const place = this.getPlace(placeId)
        const hand = place.hands[handIdx]
        if (hand.isStandOrOver) {
            return
        }
        place.hands.push(hand.split(handIdx))
    }
    stand(placeId: number, handIdx: number): void {
        const place = this.getPlace(placeId)
        place.hands[handIdx].stand()
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
    get hasBet(): boolean {
        return this.places.some((place) => place.bet > 0)
    }
    deal(): void {
        this.status = GameStatus.DEALING
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
        const dealerScore = this.dealer.hand.score
        let maxScore = 0
        this.handsHasBet.forEach(hand => {
            if (maxScore < hand.score) {
                maxScore = hand.score
            }
        })
        while (dealerScore < maxValue && dealerScore < maxScore) {
            this.dealer.hand.takeCard(this.deck.takeCard())
        }
    }

    private getPlayer(playerId: string): Player {
        const player = this.players.find((player) => playerId === player.id)
        if (player) {
            return player
        }
        throw new Error("player not found")
    }

    getHandResult(playerHand: PlayerHand): GameResult {
        const dealerHand = this.dealer.hand
        if (playerHand.score === 21 && dealerHand.score === 21) {
            if (playerHand.cards.length === 2 && dealerHand.cards.length === 2) {
                return GameResult.BLACKJACK
            } else {
                return GameResult.TIE
            }
        } else if (playerHand.score === this.dealer.hand.score) {
            return GameResult.TIE
        } else if (playerHand.score > this.dealer.hand.score && playerHand.score < 22) {
            return GameResult.WIN
        }
        return GameResult.LOSE
    }
    calcFinalResult(): void {
        const hands = this.handsHasBet
        hands.forEach((hand) => {
            const result = this.getHandResult(hand)
            const place = this.getPlace(hand.placeId)
            switch (result) {
                case GameResult.BLACKJACK: {
                    this.player.addChips(place.bet * 2.5)
                    break;
                }
                case GameResult.WIN: {
                    this.player.addChips(place.bet * 2)
                    break;
                }
                case GameResult.TIE: {
                    this.player.addChips(place.bet)
                    break;
                }
                case GameResult.LOSE: {
                    break;
                }
                default: return
            }
        })
    }
    clearTable(): void {
        this.places.forEach((place) => {
            place.bet = 0
            place.hands.length = 0
        })
        this.dealer.hand.cards.length = 0
    }
}