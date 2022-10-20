import { Suit } from './../enums';
import {TablePlace} from './../TablePlace';

import {PlayerHand} from './../PlayerHand';
import {Card} from '../Card';
import {Game} from './../game';
describe('game cycle', () => {
  describe('dealing with bet and sit player', () => {
    const game = new Game('andry', 'Nikolay');
    game.addPlace(0);
    game.setPlace(0);
    const setedPlace = game.places.find((place) => place.playerID === game.player.id);
    game.player.chipInHand = 100;
    setedPlace?.addChipsToBet(100);
    game.deal();
    it('dealler have 2 cards', () => {
      expect(game.dealer.hand.cards.length).toBe(2);
    });
    it('player sit on place', () => {
      expect(setedPlace).toBeDefined();
    });
    it('deck have 48 cards', () => {
      expect(game.deck.deck.length).toBe(48);
    });
    it('playing player have 2 cards', () => {
      expect(setedPlace?.hands[0].cards.length).toBe(2);
    });
  });
  describe('final result with bet and sit player', () => {
    describe('chips equal 5100', () => {
      const game = new Game('andry', 'Nikolay');
      game.addPlace(0);
      game.setPlace(0);
      // @ts-ignore
      const setedPlace = game.getPlace(0);
      game.addChipsToBet(0);
      const playerHand = new PlayerHand(setedPlace?.id, 0);
      setedPlace?.hands.push(playerHand);
      playerHand.cards = [new Card(Suit.Club, '10'), new Card(Suit.Diamond, '10')];
      game.dealer.hand.cards.push(...[new Card(Suit.Club, '10'), new Card(Suit.Diamond, '5')]);
      game.calcFinalResult();
      it('player have 5100 chips', () => {
        expect(game.player.chips).toBe(5100);
      });
    });
    describe('lose', () => {
      const game = new Game('andry', 'Nikolay');
      game.addPlace(0);
      game.setPlace(0);
      const setedPlace = game.getPlace(0);
      game.addChipsToBet(0);
      const playerHand = new PlayerHand(setedPlace?.id, 0);
      setedPlace?.hands.push(playerHand);
      playerHand.cards = [new Card(Suit.Club, '10'), new Card(Suit.Diamond, '5')];
      game.dealer.hand.cards.push(...[new Card(Suit.Spade, '10'), new Card(Suit.Heart, '10')]);
      game.calcFinalResult();
      it('player have 4900 chips', () => {
        expect(game.player.chips).toBe(4900);
      });
    });
    describe('tie', () => {
      const game = new Game('andry', 'Nikolay');
      game.addPlace(0);
      game.setPlace(0);
      const setedPlace = game.getPlace(0);
      game.addChipsToBet(0);
      const playerHand = new PlayerHand(setedPlace?.id, 0);
      setedPlace?.hands.push(playerHand);
      playerHand.cards = [new Card(Suit.Club, '10'), new Card(Suit.Diamond, '10')];
      game.dealer.hand.cards.push(...[new Card(Suit.Heart, '10'), new Card(Suit.Spade, '10')]);
      game.calcFinalResult();
      it('player have 5000 chips', () => {
        expect(game.player.chips).toBe(5000);
      });
    });
    describe('BlackJack', () => {
      const game = new Game('andry', 'Nikolay');
      game.addPlace(0);
      game.setPlace(0);
      const setedPlace = game.getPlace(0);
      game.addChipsToBet(0);
      const playerHand = new PlayerHand(setedPlace.id, 0);
      setedPlace.hands.push(playerHand);
      playerHand.cards.push(...[new Card(Suit.Club, 'A'), new Card(Suit.Diamond, '10')]);
      game.dealer.hand.cards.push(...[new Card(Suit.Heart, '10'), new Card(Suit.Spade, '10')]);
      game.calcFinalResult();
      it('player have 5000 chips', () => {
        expect(game.player.chips).toBe(5150);
      });
    });
  });
  it('place be equal', () => {
    const game = new Game('1', '2', 5000);
    game.addPlace(0);
    expect(game.getPlace(0)).toBe(game.places[0]);
  });
  it('get place throw error', () => {
    const game = new Game('1', '2', 5000);
    expect(() => game.getPlace(0)).toThrowError();
  });
  it('empty array', () => {
    const game = new Game('1', '2', 5000);
    expect(game.allHandScors).toEqual([]);
  });
  it('add place return place', () => {
    const game = new Game('1', '2', 5000);
    expect(game.addPlace(0)).toEqual(new TablePlace(0));
  });
  it('player find not error', () => {
    const game = new Game('1', '2', 5000);
    expect(() => game.getPlayer('2')).not.toThrowError();
  });
  it('player not find get error', () => {
    const game = new Game('1', '2', 5000);
    expect(() => game.getPlayer('5')).toThrowError();
  });
  describe('clear table', () => {
    it('lose', () => {
      const game = new Game('1', '1', 5000);
      game.addPlace(0);
      game.addChipsToBet(0);
      game.clearTable();
      expect(game.places[0].bet).toBe(0);
    });
  });
});
