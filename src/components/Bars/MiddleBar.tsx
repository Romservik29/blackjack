import {observer} from 'mobx-react-lite';
import styled from 'styled-components';
import {useStore} from '../../store';
import Button from '../Buttons/Button';
import Chips from '../Chips';

const StyledMiddleBar = styled.div`
position: absolute;
display: flex;
justify-content: center;
align-items: center;
z-index: 3;
top: 30%;
width: 100%;
`;
const Timer = styled.span`
font-size: 2em;
color: white;
font-weight: bolder;
`;
const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
width: 100%;
height: 100%;
padding: 10px;
background-color: #00000088;
`;
const PlaceYourBets = styled.div`
  font-size: '3em';
  color: 'white';
  padding: 5;
`;

export default observer(() => {
  const gameStore = useStore('Game');

  if (!gameStore.isBetsOpen) {
    return null;
  }

  return (
    <StyledMiddleBar>
      <Container>
        <PlaceYourBets>
          Place your bets
        </PlaceYourBets>
        <Chips />
        <Timer>{gameStore.timer}</Timer>
        {
          gameStore.hasBet && <Button onClick={gameStore.deal}>Deal</Button>
        }
      </Container>
    </StyledMiddleBar>
  );
});
