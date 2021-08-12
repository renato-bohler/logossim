import styled from 'styled-components';

export const Header = styled.div`
  position: relative;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: space-between;

  height: 50px;
`;

export const Title = styled.h1`
  flex-grow: 1;
  font-size: 1.5em;

  margin: 0;

  align-self: center;
  text-align: center;
`;

export const Subtitle = styled.h2`
  flex-grow: 1;
  font-size: 1.2em;

  margin: 0;

  align-self: center;
  text-align: center;
`;

export const Content = styled.div`
  margin-top: 32px;
  flex: 1;
`;

export const IconButton = styled.button`
  position: absolute;

  flex-shrink: 0;

  border: 1px solid gray;
  border-radius: 25px;
  width: 50px;
  height: 50px;

  ${props => {
    if (props.left) return 'left: 0;';
    return 'right: 0;';
  }}

  background: none;

  :hover {
    background: rgba(0, 0, 0, 0.05);
    cursor: pointer;
  }
`;
