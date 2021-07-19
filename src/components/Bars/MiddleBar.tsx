import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import { GameStatus } from '../../app/game'
import { useStore } from '../../store'
import Button from '../Buttons/Button'
import Chips from '../Chips'

const StyledMiddleBar = styled.div`
position: absolute;
display: flex;
justify-content: center;
align-items: center;
z-index: 3;
top: 30%;
width: 100%;
`
const Timer = styled.span`
font-size: 2em;
color: white;
font-weight: bolder;
`
const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
width: 100%;
height: 100%;
padding: 10px;
background-color: #00000088;
`
export default observer(() => {
    const gameStore = useStore("Game")
    function deal() {
        gameStore.deal()
    }
    return (
        gameStore.status === GameStatus.WAITING_BETS
            ? <StyledMiddleBar>
                <Container>
                    <div style={{ fontSize: "3em", color: "white", padding: 5 }}>Place your bets</div>
                    < Chips />
                    <Timer>{gameStore.timer}</Timer>
                    {gameStore.hasBet &&
                        <Button onClick={deal}>
                            Deal
                        </Button>
                    }
                </Container>
            </StyledMiddleBar>
            : null
    )
})
