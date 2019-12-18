import styled from 'styled-components';

/**
 * TODO:
 * - show the icon and name of the component
 * - use `setDragImage` to show component's shape when dragging
 */
const DraggableComponent = styled.div.attrs(({ ...props }) => ({
  ...props,
  draggable: true,
  onDragStart: event =>
    event.dataTransfer.setData(
      'component',
      JSON.stringify({
        type: props.component.type,
      }),
    ),
}))`
  margin: 5px;
  width: 50px;
  height: 50px;
  background: #12ee99;
  border-radius: 15px;
`;

export default DraggableComponent;
