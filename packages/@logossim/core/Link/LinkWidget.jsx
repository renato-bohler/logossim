import React, { Component } from 'react';
import { LinkWidget as RDLinkWidget } from '@projectstorm/react-diagrams-core';
import { DefaultLinkSegmentWidget } from '@projectstorm/react-diagrams-defaults';

export default class LinkWidget extends Component {
  constructor(props) {
    super(props);

    this.refPaths = [];
  }

  componentDidUpdate() {
    const { link } = this.props;

    link.setRenderedPaths(
      this.refPaths.map(ref => {
        return ref.current;
      }),
    );
  }

  componentDidMount() {
    const { link } = this.props;

    link.setRenderedPaths(
      this.refPaths.map(ref => {
        return ref.current;
      }),
    );
  }

  componentWillUnmount() {
    const { link } = this.props;

    link.setRenderedPaths([]);
  }

  generateLink(path, extraProps, id) {
    const { diagramEngine, link, factory, options = {} } = this.props;

    const { selected } = options;

    const ref = React.createRef();
    this.refPaths.push(ref);

    return (
      <DefaultLinkSegmentWidget
        key={`link-${id}`}
        path={path}
        selected={selected}
        diagramEngine={diagramEngine}
        factory={factory}
        link={link}
        forwardRef={ref}
        extras={extraProps}
        onSelection={() => {}}
      />
    );
  }

  generateBifurcationSourcePoint() {
    const { link } = this.props;

    if (!link.isBifurcation) return null;

    const position = link.getFirstPoint().getPosition();

    return (
      <circle r={5} fill="gray" cx={position.x} cy={position.y} />
    );
  }

  render() {
    const { link } = this.props;

    const points = link.getPoints();
    const paths = [];

    for (let j = 0; j < points.length - 1; j += 1) {
      paths.push(
        this.generateLink(
          RDLinkWidget.generateLinePath(points[j], points[j + 1]),
          {
            'data-linkid': link.getID(),
            'data-point': j,
          },
          j,
        ),
      );
    }

    this.refPaths = [];

    return (
      <>
        {this.generateBifurcationSourcePoint(link)}
        <g data-default-link-test={link.getOptions().testName}>
          {paths}
        </g>
      </>
    );
  }
}
