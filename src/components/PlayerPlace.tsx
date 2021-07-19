import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { GameStatus } from '../app/game'
import { PlayerHand } from '../app/PlayerHand'
import GameButtons from './Buttons/GameButtons'
import HandResult from './HandResult'
import Score from './Score'

const Styled = styled.div`
position: absolute;
top: ${(props: { top: number, left: number }) => props.top + "%"};
left: ${(props: { top: number, left: number }) => props.left + "%"};
z-index: 3;
`

type PlayerProps = {
    playerHand: PlayerHand
    dealerHand: PlayerHand
    gameStatus: GameStatus
}

const StyledScore = styled.div`
position: absolute;
top: -3em;
left: 3em;
`
const StyledResult = styled.div`
position: absolute;
top: -5em;
left: 1.4em;
`

export default observer(({ playerHand, dealerHand, gameStatus }: PlayerProps) => {
    const top = 80 + (playerHand.placeId % 2 === 0 ? 0 : 6)
    const left = 22 + (playerHand.placeId * 20)
    return (
        <Styled top={top} left={left}>
            <StyledScore>
                <Score value={playerHand.score} />
            </StyledScore>
            {gameStatus === GameStatus.CALC_FINAL_RESULT
            &&<StyledResult>
                <HandResult style={{ position: "relative", top: 0 }} result={playerHand.result(dealerHand)} />
            </StyledResult>
            }
            <GameButtons placeId={playerHand.placeId} handIdx={playerHand.idx} />
        </Styled>
    )
})
