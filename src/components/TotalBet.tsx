import {observer} from 'mobx-react-lite';
import styled from 'styled-components';
import {Color} from '../color';
import {useStore} from '../store';

const StyledCurrenBet = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
border: 2px solid yellow;
border-radius: 17px;
background-color: #000000b3;
color: white;
width: min-content;
padding: 0.25em 1.5em 0.25em 1.5em;
font-size: 1.2em;
height: min-content;
margin-left: 10px;
`;

export default observer(() => {
  const gameStore = useStore('Game');

  if (gameStore.totalBet === 0) {
    return null;
  }

  return (
    <>
      {
        <StyledCurrenBet>
          <span>Total</span>
          <span style={{color: Color.yellow}}>{gameStore.totalBet}</span>
        </StyledCurrenBet>
      }
    </>
  );
});
