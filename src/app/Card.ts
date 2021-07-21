export type AnySuit = "Heart" | "Diamond" | "Club" | "Spade"
export type AnyRank = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A"
export class Card {
    suit: AnySuit
    rank: AnyRank
    value: number
    isFaceUp: boolean = true
    constructor(suit: AnySuit, rank: AnyRank) {
        this.suit = suit
        this.rank = rank
        this.value = this.getValue(rank)
    }
    private getValue(rank: AnyRank): number {
        if (rank === "A") {
            return 11;
        } else if (rank === "J" || rank === "Q" || rank === "K") {
            return 10;
        } else {
            return +rank;
        }
    }
}