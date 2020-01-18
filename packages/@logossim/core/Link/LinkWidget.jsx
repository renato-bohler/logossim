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

  renderPoint(position) {
    const { link } = this.props;

    return (
      <circle
        r={5}
        fill={link.isSelected() ? '#00c0ff' : 'gray'}
        cx={position.x}
        cy={position.y}
      />
    );
  }

  renderBifurcationSourcePoint() {
    const { link } = this.props;

    const bifurcationSource = link.getBifurcationSource();
    if (!bifurcationSource) return null;

    const bifurcationOrigin = link.getFirstPoint().getPosition();
    const lastSourcePoint = bifurcationSource
      .getLastPoint()
      .getPosition();

    if (
      bifurcationOrigin.x === lastSourcePoint.x &&
      bifurcationOrigin.y === lastSourcePoint.y
    ) {
      return null;
    }

    return this.renderPoint(bifurcationOrigin);
  }

  renderLooseLinkPoint() {
    const { link } = this.props;

    if (link.getTargetPort()) return null;

    const bifurcations = link.getBifurcations();
    const lastSourcePoint = link.getLastPoint().getPosition();

    const isContinued = bifurcations.some(bifurcation => {
      const bifurcationOrigin = bifurcation
        .getFirstPoint()
        .getPosition();

      return (
        bifurcationOrigin.x === lastSourcePoint.x &&
        bifurcationOrigin.y === lastSourcePoint.y
      );
    });

    if (isContinued) {
      return null;
    }

    return this.renderPoint(lastSourcePoint);
  }

  render() {
    const { link } = this.props;

    this.refPaths = [];

    return (
      <>
        {this.renderBifurcationSourcePoint()}
        {this.renderLooseLinkPoint()}
        <g data-default-link-test={link.getOptions().testName}>
          {this.generatePointTuples().map((tuple, index) =>
            this.renderSegment(this.generateLinePath(tuple), index),
          )}
        </g>
      </>
    );
  }
}
