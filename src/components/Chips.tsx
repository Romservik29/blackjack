import styled from 'styled-components';
import Chip from './Chip';

const CHIPS = [25, 50, 100, 250, 500, 1000];

const ChipsContainer = styled.div`
display: flex;
justify-content: space-evenly;
width: 30%;
height: 60%;
`;

export default function Chips() {
  return (
    <ChipsContainer>
      {
        CHIPS.map((value, idx) => <Chip key={idx} value={value} />)
      }
    </ChipsContainer>
  );
}
