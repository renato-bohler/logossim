import styled from 'styled-components';

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: space-between;
`;

export const Content = styled.div`
  padding-top: 32px;
`;

export const IconButton = styled.button`
  flex-shrink: 0;

  border: 1px solid gray;
  border-radius: 25px;
  width: 50px;
  height: 50px;

  background: none;
  margin-right: ${props => (props.first ? '12px' : '0')};
  margin-left: ${props => (props.last ? '12px' : '0')};

  :hover {
    background: rgba(0, 0, 0, 0.05);
    cursor: pointer;
  }
`;
