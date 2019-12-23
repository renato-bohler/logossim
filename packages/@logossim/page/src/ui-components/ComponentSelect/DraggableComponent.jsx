import React from 'react';
import styled from 'styled-components';

const Container = styled.div.attrs(({ ...props }) => ({
  ...props,
  draggable: true,
}))`
  margin: 5px;
  width: 50px;
  height: 50px;

  background: #00000014;
  border: 1px solid #4141412e;
  border-radius: 15px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const DraggableComponent = ({ component: { type, Icon } }) => (
  <Container
    draggable
    onDragStart={event =>
      event.dataTransfer.setData(
        'component',
        JSON.stringify({
          type,
        }),
      )
    }
  >
    <Icon />
  </Container>
);

export default DraggableComponent;
