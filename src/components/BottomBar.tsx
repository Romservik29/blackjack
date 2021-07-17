import styled from "styled-components"
import { GameStatus } from "../app/game"
import { useStore } from "../store"
import Chips from './Chips'
import PlayerChips from './PlayerBalance'

const BottomBarContainer = styled.div`
display: flex;
position: absolute;
z-index: 2;
bottom: 0;
width: 100%;
height: 25%;
background-color: #0000ff2d;
`

const LeftBar = styled.div`
width: 25%;
padding: 10px;
display: flex;
align-items: flex-end;
`

const CenterBar = styled.div`
width: 50%;
display: flex;
align-items: center;
justify-content: center;
`

const RightBar = styled.div`
width: 25%;
`

export default function BottomBar() {
    const { status } = useStore("Game")
    return (
        <BottomBarContainer>
            <LeftBar>
                <div>
                    <PlayerChips />
                </div>
            </LeftBar>
            {status === GameStatus.WAITING_BETS
                && <CenterBar>
                    <Chips />
                </CenterBar>
            }
            <RightBar>

            </RightBar>
        </BottomBarContainer>
    )
}
