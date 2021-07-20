import styled from "styled-components"
import { TablePlace } from "../app/TablePlace"

type StyleProps = {
    left: number
    bot: number
}

const StyledBet = styled.span`
position: absolute;
z-index: 4;
left: ${({ left }: StyleProps) => left + "%"};
bottom: ${({ bot }: StyleProps) => bot + "%"};
color: white;
background-color: rgba(0,0,0,0.5);
padding: 1px 3px 1px 3px;
border: 1px solid yellow;
border-radius: 4px;
`

export const PlaceBet = ({ place }: { place: TablePlace }) => {
    const bot = 10 - (place.id % 2 === 0 ? 0 : 7)
    const left = 28.5 + (place.id * 20)
    return <StyledBet bot={bot} left={left} children={place.bet} />
}
