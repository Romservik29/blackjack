import { PlayerHand } from './PlayerHand';
import { makeAutoObservable } from 'mobx';
import { Player } from './Player';
export class TablePlace {
    id: number
    playerID: string | null
    hands: Array<PlayerHand>
    bet: number
    constructor(placeId: number) {
        this.id = placeId
        this.playerID = null
        this.hands = []
        this.bet = 0
        makeAutoObservable(this)
    }
    setPlayer(playerId: string) {
        this.playerID = playerId
    }
    betChips(chips: number) {
        this.bet += chips
    }
    clearBet() {
        this.bet = 0
    }
    clearPlayer() {
        this.playerID = null
        this.bet = 0
        this.hands = []
    }
}