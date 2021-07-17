import styled from "styled-components"
import GameStageInfo from "./GameStageInfo"

const TopBarContainer = styled.div`
display: flex;
justify-content: center;
align-items: center;
position: absolute;
z-index: 2;
top: 0;
width: 100%;
height: 25%;
background-color: #00800022;
`

export default function TopBar() {
    return (
        <TopBarContainer>
            <GameStageInfo />
        </TopBarContainer>
    )
}
