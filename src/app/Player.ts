import { makeAutoObservable } from 'mobx';

export class Player {
    chips: number;
    id: string;
    constructor(id: string, chips: number) {
        this.id = id
        this.chips= chips
        makeAutoObservable(this)
    }
    addChips(chips: number): void {
        this.chips += chips
    }
    minusChips(chips: number): void {
        this.chips -= chips
    }
}