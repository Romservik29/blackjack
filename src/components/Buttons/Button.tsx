import React from 'react';
import styled from 'styled-components';
import {Color} from '../../color';
type ButtonProps = {
    children?: React.ReactNode
    onClick: () => void;
}

const StyledButton = styled.div`
border: 1px solid ${Color.yellow};
border-radius: 7px;
color: white;
background-color: #00000096;
padding: 5px 10px 5px 10px;
cursor: pointer;
`;

export default function Button(props: ButtonProps): JSX.Element {
  return (
    <StyledButton onClick={props.onClick}>
      {props.children}
    </StyledButton>
  );
}
