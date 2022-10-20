import {makeObservable, observable} from 'mobx';
import {Suit} from './enums';

export type AnyRank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export class Card {
  readonly suit: Suit
  readonly rank: AnyRank
  readonly value: number
  isFaceUp: boolean = true;
  constructor(suit: Suit, rank: AnyRank) {
    this.suit = suit;
    this.rank = rank;
    this.value = this.getValue(rank);
    makeObservable(this, {
      isFaceUp: observable,
    });
  }
  private getValue(rank: AnyRank): number {
    if (rank === 'A') {
      return 11;
    } else if (rank === 'J' || rank === 'Q' || rank === 'K') {
      return 10;
    } else {
      return +rank;
    }
  }
}
