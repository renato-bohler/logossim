import React, { Component, MouseEvent } from 'react';
import { LinkWidget as RDLinkWidget } from '@projectstorm/react-diagrams-core';
import { DefaultLinkSegmentWidget } from '@projectstorm/react-diagrams-defaults';
import { Point } from '@projectstorm/geometry';

import LinkPort from '../LinkPort/LinkPort';
import LinkPortModel from '../LinkPort/LinkPortModel';
import LinkPointModel from '../LinkPoint/LinkPointModel';

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
    const { link, factory, diagramEngine } = this.props;

    // Ensure id is present for all points on the path
    const points = link.getPoints();

    const paths = [];

    // Get points based on link orientation
    let pointLeft = points[0];
    let pointRight = points[points.length - 1];

    let hadToSwitch = false;
    if (pointLeft.getX() > pointRight.getX()) {
      pointLeft = points[points.length - 1];
      pointRight = points[0];
      hadToSwitch = true;
    }
    const dy = Math.abs(
      points[0].getY() - points[points.length - 1].getY(),
    );

    // When new link add one middle point to get everywhere 90° angle
    if (link.getTargetPort() === null && points.length === 2) {
      [...Array(2)].forEach(() => {
        link.addPoint(
          new LinkPointModel({
            link,
            position: new Point(pointLeft.getX(), pointRight.getY()),
          }),
          1,
        );
      });
      link.setManuallyFirstAndLastPathsDirection(true, true);
    }
    // When new link is moving and not connected to target port move with middle point
    /**
     * TODO: this will be better to update in `DragNewLinkState` in function `fireMouseMoved`
     * to avoid calling this unexpectedly e.g. after deserialize
     */
    else if (
      link.getTargetPort() === null &&
      link.getSourcePort() !== null
    ) {
      points[1].setPosition(
        pointRight.getX() +
          (pointLeft.getX() - pointRight.getX()) / 2,
        !hadToSwitch ? pointLeft.getY() : pointRight.getY(),
      );
      points[2].setPosition(
        pointRight.getX() +
          (pointLeft.getX() - pointRight.getX()) / 2,
        !hadToSwitch ? pointRight.getY() : pointLeft.getY(),
      );
    }
    // Render was called but link is not moved but user.
    // Node is moved and in this case fix coordinates to get 90° angle.
    // For loop just for first and last path
    else if (points.length > 2) {
      // Those points and its position only will be moved
      for (let i = 1; i < points.length; i += points.length - 2) {
        if (i - 1 === 0) {
          if (link.getFirstPathXdirection()) {
            points[i].setPosition(
              points[i].getX(),
              points[i - 1].getY(),
            );
          } else {
            points[i].setPosition(
              points[i - 1].getX(),
              points[i].getY(),
            );
          }
        } else if (link.getLastPathXdirection()) {
          points[i - 1].setPosition(
            points[i - 1].getX(),
            points[i].getY(),
          );
        } else {
          points[i - 1].setPosition(
            points[i].getX(),
            points[i - 1].getY(),
          );
        }
      }
    }

    // If there is existing link which has two points add one
    // NOTE: It doesn't matter if check is for dy or dx
    if (points.length === 2 && dy !== 0) {
      link.addPoint(
        new LinkPointModel({
          link,
          position: new Point(pointLeft.getX(), pointRight.getY()),
        }),
      );
    }

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

LinkWidget.defaultProps = {
  color: 'red',
  width: 3,
  link: null,
  smooth: false,
  diagramEngine: null,
  factory: null,
};
