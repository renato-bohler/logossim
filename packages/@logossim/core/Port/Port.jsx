import React, { useContext } from 'react';

import { PortWidget } from '@projectstorm/react-diagrams';

import styled from 'styled-components';

import ComponentContext from '../ComponentContext';
import DiagramContext from '../Diagram/DiagramContext';

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
        title={name}
      />
    );
  }
}

/**
 * React Diagrams PortWidget implementation needs us to forward some
 * props in order to function properly. We have this HOC so that
 * component widgets don't need to pass them every time.
 */
const withProps = WrappedComponent => ({ ...props }) => {
  const diagram = useContext(DiagramContext);
  const model = useContext(ComponentContext);

  return (
    <WrappedComponent
      {...props}
      port={model.getPort(props.name)}
      engine={diagram.getEngine()}
      model={model}
    />
  );
};

export default withProps(Port);
