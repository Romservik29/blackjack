import {Deck} from './../Deck';
describe('take card from deck', () => {
  it('deck lenght 51', () => {
    const deck = new Deck();
    deck.takeCard();
    expect(deck.deck.length).toBe(51);
  });
  it('deck lenght 52', () => {

  });
});
