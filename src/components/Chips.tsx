import styled from 'styled-components'
import Chip from './Chip'

const ChipsContainer = styled.div`
display: flex;
justify-content: space-evenly;
width: 60%;
height: 80%;
`

export default function Chips() {
    return (
        <ChipsContainer>
            {[100, 250, 500, 1000].map((value) => <Chip value={value} />)}
        </ChipsContainer>
    )
}
