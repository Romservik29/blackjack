import { makeObservable, observable } from 'mobx';

export class Player {
    readonly id: string;
    chips: number;
    chipInHand: number;
    constructor(id: string, chips: number) {
        this.id = id
        this.chips = chips
        this.chipInHand = 100
        makeObservable(this, {
            chips: observable,
            chipInHand: observable
        })
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