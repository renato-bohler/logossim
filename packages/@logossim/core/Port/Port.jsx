import React from 'react';

import { PortWidget } from '@projectstorm/react-diagrams';

import styled from 'styled-components';

const Circle = styled.div`
  width: 10px;
  height: 10px;
  border: var(--port-width) solid
    ${props =>
      props.link
        ? 'var(--port-connected-border)'
        : 'var(--port-unconnected-border)'};
  border-radius: 100%;
  background: ${props => props.port.getColor()};

  &:hover {
    background: var(--port-hover);
  }
`;

class Port extends PortWidget {
  report() {
    if (this.props.port) super.report();
  }

  componentDidUpdate() {
    if (this.props.port) super.componentDidUpdate();
  }

  render() {
    const { name, port, model, className = '' } = this.props;

    if (!port) return null;

    return (
      <Circle
        className={`port ${className}`}
        data-name={name}
        data-nodeid={model.getID()}
        port={port}
        link={port.getMainLink()}
      />
    );
  }
}

/**
 * React Diagrams PortWidget implementation needs us to forward some
 * props in order to function properly.
 */
const withProps = WrappedComponent => ({ ...props }) => (
  <WrappedComponent
    {...props}
    port={props.model.getPort(props.name)}
  />
);

export default withProps(Port);
