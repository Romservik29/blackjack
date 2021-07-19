import styled from "styled-components"

type ScoreProps = {
    value: number
}

export const ScoreContainer = styled.span`
border: 1px solid blue;
border-radius: 5px;
padding: 2px;
height: min-content;
color: white;
background-color: #0025ff99;
`

export default function Score({ value }: ScoreProps) {
    return (
        <ScoreContainer>
            {value}
        </ScoreContainer>
    )
}
