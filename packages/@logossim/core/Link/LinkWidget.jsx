import React, { Component } from 'react';
import { DefaultLinkSegmentWidget } from '@projectstorm/react-diagrams-defaults';

export default class LinkWidget extends Component {
  constructor(props) {
    super(props);

    this.refPaths = [];
  }

  componentDidUpdate() {
    this.updateRenderedPaths();
  }

  componentDidMount() {
    this.updateRenderedPaths();
  }

  componentWillUnmount() {
    this.clearRenderedPaths();
  }

  updateRenderedPaths() {
    const { link } = this.props;

    link.setRenderedPaths(
      this.refPaths.map(ref => {
        return ref.current;
      }),
    );
  }

  clearRenderedPaths() {
    const { link } = this.props;

    link.setRenderedPaths([]);
  }

  generatePointTuples() {
    const { link } = this.props;

    const points = link.getPoints();

    return points
      .map((point, i) => ({ from: points[i], to: points[i + 1] }))
      .filter(tuple => tuple.to);
  }

  generateLinePath({ from, to }) {
    return `M${from.getX()},${from.getY()} L ${to.getX()},${to.getY()}`;
  }

  renderSegment(path, index) {
    const { diagramEngine, link, factory, options = {} } = this.props;

    const { selected } = options;

    const ref = React.createRef();
    this.refPaths.push(ref);

    return (
      <DefaultLinkSegmentWidget
        key={`link-${index}`}
        path={path}
        selected={selected}
        diagramEngine={diagramEngine}
        factory={factory}
        link={link}
        forwardRef={ref}
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

    this.refPaths = [];

    return (
      <>
        {this.generateBifurcationSourcePoint(link)}
        <g data-default-link-test={link.getOptions().testName}>
          {this.generatePointTuples().map((tuple, index) =>
            this.renderSegment(this.generateLinePath(tuple), index),
          )}
        </g>
      </>
    );
  }
}
