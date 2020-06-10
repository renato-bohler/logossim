import React, { Component } from 'react';

import { samePosition } from '../Diagram/states/common';

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

  generatePathPoints() {
    const { link } = this.props;

    const points = link.getPoints();

    return points
      .map((point, i) => ({ from: points[i], to: points[i + 1] }))
      .filter(tuple => tuple.to);
  }

  generateLinePath({ from, to }) {
    return `M${from.getX()},${from.getY()} L${to.getX()},${to.getY()}`;
  }

  renderSegment(path, key) {
    const { link, factory, options = {} } = this.props;

    const { selected } = options;

    const ref = React.createRef();
    this.refPaths.push(ref);

    return React.cloneElement(
      factory.generateLinkSegment(link, selected, path),
      { key, ref },
    );
  }

  renderPoint(position, loose = false) {
    const { link } = this.props;
    const color = link.getColor();

    return (
      <circle
        r={loose ? 6 : link.getPointRadius()}
        fill={loose ? 'var(--background)' : color}
        stroke={loose ? color : 'none'}
        strokeWidth={3}
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

    if (samePosition(bifurcationOrigin, lastSourcePoint)) {
      return null;
    }

    return this.renderPoint(bifurcationOrigin);
  }

  renderBifurcationTargetPoint() {
    const { link } = this.props;

    const bifurcationTarget = link.getBifurcationTarget();
    if (!bifurcationTarget) return null;

    const bifurcationTargetPosition = link
      .getLastPoint()
      .getPosition();
    const lastSourcePoint = bifurcationTarget
      .getLastPoint()
      .getPosition();

    if (samePosition(bifurcationTargetPosition, lastSourcePoint)) {
      return null;
    }

    return this.renderPoint(bifurcationTargetPosition);
  }

  renderLooseLinkPoint() {
    const { link } = this.props;

    if (link.getTargetPort()) return null;
    if (link.getBifurcationTarget()) return null;

    const bifurcations = link.getBifurcations();
    const lastSourcePoint = link.getLastPoint().getPosition();

    const isContinued = bifurcations.some(
      bifurcation =>
        samePosition(
          bifurcation.getFirstPosition(),
          lastSourcePoint,
        ) ||
        samePosition(bifurcation.getLastPosition(), lastSourcePoint),
    );

    if (isContinued) return null;

    return this.renderPoint(lastSourcePoint, true);
  }

  render() {
    const { link } = this.props;

    this.refPaths = [];

    return (
      <>
        <g data-default-link-test={link.getOptions().testName}>
          {this.generatePathPoints().map((tuple, index) =>
            this.renderSegment(this.generateLinePath(tuple), index),
          )}
        </g>
        {this.renderBifurcationSourcePoint()}
        {this.renderBifurcationTargetPoint()}
        {this.renderLooseLinkPoint()}
      </>
    );
  }
}
