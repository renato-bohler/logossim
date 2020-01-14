import React from 'react';
import { PortWidget } from '@projectstorm/react-diagrams';

export default class LinkPort extends PortWidget {
  render() {
    const {
      name,
      node,
      className = '',
      port: {
        position: { x, y },
        options: { fill },
      },
    } = this.props;

    return (
      <circle
        className={`port ${className}`}
        data-name={name}
        data-nodeid={node.getID()}
        r="5"
        cx={x}
        cy={y}
        fill={fill}
      />
    );
  }
}
