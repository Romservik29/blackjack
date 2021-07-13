import { makeAutoObservable } from 'mobx';

export class Player {
    chips: number;
    chipInHand: number | null;
    id: string;
    constructor(id: string, chips: number) {
        this.id = id
        this.chips = chips
        this.chipInHand = null
        makeAutoObservable(this)
    }
    setChipInHand = (value: number): void => {
        this.chipInHand = value
    }
    addChips(chips: number): void {
        this.chips += chips
    }
    minusChips(chips: number): void {
        this.chips -= chips
    }
}