import styled from "styled-components"
import Chips from './Chips'
import PlayerChips from './PlayerChips'

const BottomBarContainer = styled.div`
position: absolute;
z-index: 2;
bottom: 0;
width: 100%;
height: 25%;
background-color: #0000ff2d;
`

export default function BottomBar() {
    return (
        <BottomBarContainer>
            <Chips />
            <PlayerChips />
        </BottomBarContainer>
    )
}
