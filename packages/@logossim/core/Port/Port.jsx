import React from 'react';
import styled from 'styled-components';
import { PortWidget } from '@projectstorm/react-diagrams';

const Circle = styled.div`
  width: 10px;
  height: 10px;
  border: var(--port-width) solid
    ${props =>
      props.link
        ? 'var(--port-connected-border)'
        : 'var(--port-unconnected-border)'};
  border-radius: 100%;
  background: ${props =>
    props.link ? props.link.getColor() : 'var(--port-unconnected)'};

  &:hover {
    background: var(--port-hover);
  }
`;

export default class Port extends PortWidget {
  render() {
    const {
      name,
      model,
      port: { links },
      className = '',
    } = this.props;

    const link =
      Object.keys(links).length > 0 ? Object.values(links)[0] : null;

    return (
      <Circle
        className={`port ${className}`}
        data-name={name}
        data-nodeid={model.getID()}
        link={link}
      />
    );
  }
}
