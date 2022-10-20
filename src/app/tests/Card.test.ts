import {Card} from '../Card';
describe.each([
  [new Card('Club', '4'), 4],
])('get value card', (card, expected) => {
  it(`return ${expected}`, () => {
    expect(card.value).toBe(4);
  });
});
