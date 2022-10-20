import styled from 'styled-components';
import {GameResult, GameStatus} from '../app/enums';


interface HandResultPros {
    result: GameResult
    gameStatus: GameStatus
    style?: React.CSSProperties
}

const RESULTS = ['BJ', 'W', 'TIE', '❌'];

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
export default function HandResult({result, gameStatus, ...props}: HandResultPros) {
  return (gameStatus === GameStatus.CALC_FINAL_RESULT ?
        <Result {...props}>
          {RESULTS[result]}
        </Result> :
        null
  );
}
