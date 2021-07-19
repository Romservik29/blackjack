import styled from 'styled-components';
import { GameResult } from '../app/game'

interface HandResultPros {
    result: GameResult
    style?: React.CSSProperties
}
const Result = styled.div`
  border: 2px solid yellow;
  border-radius: 50%;
  font-weight: 700;
  font-size: 2.5em;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px;
  width: 4rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export default function HandResult({ result, ...props }: HandResultPros) {
    const results = ["BJ", "W", "TIE", "❌"]
    return (
        <Result {...props}>
            {results[result]}
        </Result>
    )
}
