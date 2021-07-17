import { observer } from 'mobx-react-lite'
import React from 'react'
import styled from 'styled-components'
import { useStore } from '../store'

const BalanceContainer = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
border: 2px solid yellow;
border-radius: 17px;
background-color: #000000b3;
color: white;
width: min-content;
padding: 0.25em 1.5em 0.25em 1.5em;
font-size: 1.2em;
height: min-content;
`

export default observer(() => {
    const gameStore = useStore("Game")
    return (
        <BalanceContainer>
            <span>BALANCE</span>
            <span style={{ color: "yellow" }}>{gameStore.player.chips}</span>
        </BalanceContainer>
    )
})
