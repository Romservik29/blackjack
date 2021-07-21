import { PlayerHand } from './PlayerHand';
import { TablePlace } from './TablePlace';
import { makeAutoObservable, reaction } from 'mobx';
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
    timer: number = 0;
    totalBet: number = 0;
    private interval: number | null = null;
    constructor(dealerName: string, playerID: string, chips = 5000, deck = new Deck()) {
        this.player = new Player(playerID, chips)
        this.players.push(this.player)
        this.dealer = new Dealer(dealerName)
        this.deck = deck
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
        this.placeHasBet.forEach((place) => {
            hands.push(...place.hands)
        })
        return hands
    }
    get placeHasBet(): Array<TablePlace> {
        return this.places.filter((place) => place.bet > 0)
    }
    setTimer(time: number): void {
        if (this.interval) {
            clearInterval(this.interval)
        }
        this.timer = time
        this.interval = window.setInterval(() => {
            this.setTimer(this.timer - 1)
            if (this.timer < 0) {
                clearInterval(this.interval!)
            }
        }, 1000)
    }
    setStatus(status: GameStatus) {
        this.status = status
    }
    getPlace(placeId: number): TablePlace {
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
        const { chipInHand } = this.player
        const place = this.getPlace(placeId)
        this.player.minusChips(chipInHand)
        place.addChipsToBet(chipInHand)
        this.totalBet += chipInHand
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
        if (hand.isStandOrOver || place.bet > this.player.chips) {
            return
        } else {
            hand.hit(this.deck.takeCard())
            hand.stand()
            this.player.minusChips(place.bet)
            place.bet *= 2
        }
    }
    split(placeId: number, handIdx: number): void {
        const place = this.getPlace(placeId)
        const hand = place.hands[handIdx]
        if (hand.isStandOrOver) {
            return
        }
        if (hand.isSplitable()) {
            place.hands.push(hand.split(handIdx))
        }
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
        const card2 = this.deck.takeCard();
        card2.isFaceUp = false
        this.dealer.hand.cards = [this.deck.takeCard(), card2]
    }
    playDealer(maxValue: number): void {
        while (this.dealerCanTakeCard(maxValue)) {
            this.dealer.hand.takeCard(this.deck.takeCard())
        }
    }
    dealerCanTakeCard(maxValue: number): boolean {
        let maxScore = 0
        this.handsHasBet.forEach(hand => {
            if (maxScore < hand.score && hand.score < 22) {
                maxScore = hand.score
            }
        })
        return (
            this.dealer.hand.score < maxValue
            && this.dealer.hand.score <= maxScore)
    }
    getPlayer(playerId: string): Player {
        const player = this.players.find((player) => playerId === player.id)
        if (player) {
            return player
        }
        throw new Error("player not found")
    }
    calcFinalResult(): void {
        const hands = this.handsHasBet
        hands.forEach((hand) => {
            const result = hand.result(this.dealer.hand)
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
        this.totalBet = 0
        this.dealer.hand.cards.length = 0
    }
}