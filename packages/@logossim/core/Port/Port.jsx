import React from 'react';
import styled from 'styled-components';
import { PortWidget } from '@projectstorm/react-diagrams';

const Circle = styled.div`
  width: 10px;
  height: 10px;
  border: 1px solid ${props => (props.connected ? 'gray' : '#333')};
  border-radius: 100%;
  background: ${props => (props.connected ? '#333' : 'gray')};

  &:hover {
    background: #0c5870;
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
