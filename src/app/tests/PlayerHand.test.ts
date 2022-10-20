import {AnyRank} from './../Card';
import {Card} from '../Card';
import {PlayerHand} from '../PlayerHand';
describe('PlayerHand tests', () => {
  it('take card', () => {
    const hand = new PlayerHand(0, 0);
    const card = new Card('Club', '10');
    hand.takeCard(card);
    expect(hand.cards[0]).toEqual(card);
  });
  it('hit', () => {
    const hand = new PlayerHand(0, 0);
    hand.hit(new Card('Club', '10'));
    expect(hand.cards[0].rank).toBe('10');
    expect(hand.cards[0].suit).toBe('Club');
    expect(hand.cards[0].value).toBe(10);
  });
  it('double', () => {
    const hand = new PlayerHand(0, 0);
    hand.double(new Card('Club', '10'));
    expect(hand.cards[0].rank).toBe('10');
    expect(hand.cards[0].suit).toBe('Club');
    expect(hand.cards[0].value).toBe(10);
  });
  it('stand', () => {
    const hand = new PlayerHand(0, 0);
    hand.stand();
    expect(hand.isStand).toBe(true);
  });
  describe.each([
    ['A', 'A', 12],
    ['A', '10', 21],
    ['A', 'K', 21],
    ['5', '5', 10],
  ])('get score', (a, b, expected) => {
    it('test', () => {
      const hand = new PlayerHand(0, 0);
      hand.takeCard(new Card('Club', a as AnyRank));
      hand.takeCard(new Card('Diamond', b as AnyRank));
      expect(hand.score).toBe(expected);
    });
  });
  describe('isSplitable', () => {
    it('splitable', () => {
      const hand = new PlayerHand(0, 0);
      const card = new Card('Club', '10');
      const card2 = new Card('Diamond', '10');
      hand.takeCard(card);
      hand.takeCard(card2);
      expect(hand.isSplitable()).toBe(true);
    });
    it('not splitable', () => {
      const hand = new PlayerHand(0, 0);
      const card = new Card('Club', '10');
      const card2 = new Card('Diamond', '9');
      hand.takeCard(card);
      hand.takeCard(card2);
      expect(hand.isSplitable()).toBe(false);
    });
    it('splitable error', () => {
      const hand = new PlayerHand(0, 0);
      const card = new Card('Club', '10');
      hand.takeCard(card);
      expect(() => hand.isSplitable()).toThrowError();
    });
  });
  it('split', () => {
    const hand = new PlayerHand(0, 0);
    const card = new Card('Club', '2');
    const card2 = new Card('Diamond', '2');
    hand.takeCard(card);
    hand.takeCard(card2);
    const hand2 = new PlayerHand(0, 1);
    hand2.takeCard(card);
    expect(hand.split(0)).toEqual(hand2);
  });
});
