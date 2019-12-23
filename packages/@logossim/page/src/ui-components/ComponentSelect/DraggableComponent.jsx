import React from 'react';
import Tooltip from 'react-tooltip';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-grow: 0;
  flex-direction: column;
  align-items: center;

  background: #00000014;
  border: 1px solid #4141412e;
  border-radius: 15px;

  padding: 8px;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Name = styled.span`
  text-transform: uppercase;
  font-size: 10px;
  font-weight: bold;

  padding: 8px 0 0 0;
`;

const DraggableComponent = ({
  component: { type, name, description, Icon },
}) => (
  <Container
    data-tip={description}
    draggable
    onDragStart={event => {
      event.dataTransfer.setDragImage(
        event.currentTarget.children[0],
        0,
        0,
      );

      event.dataTransfer.setData(
        'component',
        JSON.stringify({
          type,
        }),
      );
    }}
  >
    <IconContainer>
      <Icon />
    </IconContainer>
    <Name>{name}</Name>
    <Tooltip />
  </Container>
);

export default DraggableComponent;
