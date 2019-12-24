/**
 *
 */
import styled from 'styled-components';

const DroppableLayer = styled.div.attrs(({ ...props }) => ({
  ...props,
  onDragOver: event => event.preventDefault(),
  onDrop: event => {
    const component = JSON.parse(
      event.dataTransfer.getData('component'),
    );

    props.handleComponentDrop(event, component);
  },
}))`
  width: 100vw;
  height: 100vh;
`;

export default DroppableLayer;
