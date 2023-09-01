import {AnyRank, Card} from './Card';
import {Suit} from './enums';

const suits = [Suit.Heart, Suit.Diamond, Suit.Club, Suit.Spade];
const rank = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as const;

export class Deck {
    readonly deck: Array<Card> = [];

    constructor() {
      suits.forEach((suit: Suit) => {
        this.createDeck();
      });
    }
    createDeck(): void {
      this.deck.length = 0;
      suits.forEach((suit: Suit) => {
        rank.forEach((card: AnyRank) => {
          this.deck.push(new Card(suit, card));
        });
      });
      this.shuffle();
    }
    shuffle(): void {
      const max = Math.floor(Math.random() * 100);
      let count = 0;
      while (count < max) {
        count++;
        for (let i = this.deck.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * this.deck.length - 1);
          const temp = this.deck[i];
          this.deck[i] = this.deck[j];
          this.deck[j] = temp;
        }
      }
    }
    takeCard(): Card {
      if (this.deck.length > 0) {
        return this.deck.shift()!;
      } else {
        this.createDeck();
        return this.deck.shift()!;
      }
    }
}
