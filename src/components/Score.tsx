import styled from "styled-components"

type ScoreProps = {
    value: number
    top: string
    left: string
}

type ScoreConProps = {
    top: string
    left: string
}

export const ScoreContainer = styled.span`
position: absolute;
top: ${({ top }: ScoreConProps) => top};
left: ${({ left }: ScoreConProps) => left};
border: 1px solid blue;
border-radius: 5px;
padding: 2px;
color: white;
background-color: #0025ff99;
z-index: 3;
`

export default function Score({ value, top, left }: ScoreProps) {
    return (
        <ScoreContainer top={top} left={left}>
            {value}
        </ScoreContainer>
    )
}
