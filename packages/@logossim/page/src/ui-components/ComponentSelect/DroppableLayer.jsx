import styled from 'styled-components';

/**
 * TODO:
 * - this component shouldn't receive the whole `engine` as props
 */
const DroppableLayer = styled.div.attrs(({ ...props }) => ({
  ...props,
  onDragOver: event => event.preventDefault(),
  onDrop: event => {
    const component = JSON.parse(
      event.dataTransfer.getData('component'),
    );

    const { Model } = props.components.find(
      c => c.type === component.type,
    );

    const node = new Model(component.type);
    const point = props.engine.getRelativeMousePoint(event);

    node.setPosition(point);
    props.engine.getModel().addNode(node);
    props.engine.repaintCanvas();
  },
}))`
  flex-grow: 1;
`;

export default DroppableLayer;
