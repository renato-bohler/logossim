import React from 'react';
import styled from 'styled-components';
import { PortWidget } from '@projectstorm/react-diagrams';

const Circle = styled.div`
  width: 10px;
  height: 10px;
  border: var(--port-width) solid
    ${props =>
      props.connected
        ? 'var(--port-connected-border)'
        : 'var(--port-unconnected-border)'};
  border-radius: 100%;
  background: ${props =>
    props.connected
      ? 'var(--link-unselected)'
      : 'var(--port-unconnected)'};

  &:hover {
    background: var(--port-hover);
  }
`;

export default class Port extends PortWidget {
  render() {
    const {
      name,
      node,
      port: { links },
      className = '',
    } = this.props;

    return (
      <Circle
        className={`port ${className}`}
        data-name={name}
        data-nodeid={node.getID()}
        connected={Object.keys(links).length > 0}
      />
    );
  }
}
