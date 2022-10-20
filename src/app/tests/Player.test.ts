import {Player} from './../Player';
describe('Player methods', () => {
  it('plus chips', ()=>{
    const player = new Player('asd', 5000);
    player.addChips(5000);
    expect(player.chips).toBe(10000);
  });
  it('minus chips', ()=>{
    const player = new Player('asd', 5000);
    player.minusChips(5000);
    expect(player.chips).toBe(0);
  });
});
