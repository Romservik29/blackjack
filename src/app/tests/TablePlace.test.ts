import {PlayerHand} from '../PlayerHand';
import {TablePlace} from './../TablePlace';
describe('table place', () => {
  it('playerId equal andrey', () => {
    const place = new TablePlace(0);
    place.setPlayer('andrey');
    expect(place.playerID).toBe('andrey');
  });
  it('bet equal 0', () => {
    const place = new TablePlace(0);
    place.addChipsToBet(100);
    place.clearBet();
    expect(place.bet).toBe(0);
  });
  it('place is origin', () => {
    const place = new TablePlace(0);
    place.addChipsToBet(100);
    place.setPlayer('andrey');
    place.hands.push(new PlayerHand(0, 0));
    place.clearPlayer();
    expect(place.bet).toBe(0);
    expect(place.playerID).toBeNull();
    expect(place.hands).toEqual([]);
  });
});
