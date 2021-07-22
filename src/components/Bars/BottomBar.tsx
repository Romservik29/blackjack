import styled from 'styled-components';
import PlayerBalance from '../PlayerBalance';
import TotalBet from '../TotalBet';

const StyledBottomBar = styled.div`
position: absolute;
display: flex;
justify-content: space-around;
align-items: center;
z-index: 3;
bottom: 10px;
left: 10px;
width: max-content;
margin-right: 10px;
`;
export default function BottomBar() {
  return (
    <StyledBottomBar>
      <PlayerBalance />
      <TotalBet />
    </StyledBottomBar>
  );
}
