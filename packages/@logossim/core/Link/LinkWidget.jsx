import React, { Component, MouseEvent } from 'react';
import {
  LinkWidget as RDLinkWidget,
  PointModel,
} from '@projectstorm/react-diagrams-core';
import { DefaultLinkSegmentWidget } from '@projectstorm/react-diagrams-defaults';
import { Point } from '@projectstorm/geometry';

export default class LinkWidget extends Component {
  constructor(props) {
    super(props);

    this.refPaths = [];
    this.state = {
      selected: false,
      canDrag: false,
    };

    this.draggingIndex = 0;
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
    const { diagramEngine, link } = this.props;

    const { selected } = this.state;

    const ref = React.createRef();
    this.refPaths.push(ref);

    return (
      <DefaultLinkSegmentWidget
        key={`link-${id}`}
        path={path}
        selected={selected}
        diagramEngine={diagramEngine}
        factory={diagramEngine.getFactoryForLink(link)}
        link={link}
        forwardRef={ref}
        onSelection={s => this.setState({ selected: s })}
        extras={extraProps}
      />
    );
  }

  calculatePositions(points, event, index, coordinate) {
    const { link, diagramEngine } = this.props;

    // If path is first or last add another point to keep node port on its position
    if (index === 0) {
      const point = new PointModel({
        link,
        position: new Point(
          points[index].getX(),
          points[index].getY(),
        ),
      });
      link.addPoint(point, index);
      this.draggingIndex += 1;
      return;
    }

    if (index === points.length - 2) {
      const point = new PointModel({
        link,
        position: new Point(
          points[index + 1].getX(),
          points[index + 1].getY(),
        ),
      });
      link.addPoint(point, index + 1);
      return;
    }

    // Merge two points if it is not close to node port and close to each other
    if (index - 2 > 0) {
      const auxPoints = {
        [index - 2]: points[index - 2].getPosition(),
        [index + 1]: points[index + 1].getPosition(),
        [index - 1]: points[index - 1].getPosition(),
      };
      if (
        Math.abs(
          auxPoints[index - 1][coordinate] -
            auxPoints[index + 1][coordinate],
        ) < 5
      ) {
        auxPoints[index - 2][
          coordinate
        ] = diagramEngine.getRelativeMousePoint(event)[coordinate];
        auxPoints[index + 1][
          coordinate
        ] = diagramEngine.getRelativeMousePoint(event)[coordinate];
        points[index - 2].setPosition(auxPoints[index - 2]);
        points[index + 1].setPosition(auxPoints[index + 1]);
        points[index - 1].remove();
        points[index - 1].remove();
        this.draggingIndex -= 2;
        return;
      }
    }

    // Merge two points if it is not close to node port
    if (index + 2 < points.length - 2) {
      const auxPoints = {
        [index + 3]: points[index + 3].getPosition(),
        [index + 2]: points[index + 2].getPosition(),
        [index + 1]: points[index + 1].getPosition(),
        [index]: points[index].getPosition(),
      };
      if (
        Math.abs(
          auxPoints[index + 1][coordinate] -
            auxPoints[index + 2][coordinate],
        ) < 5
      ) {
        auxPoints[index][
          coordinate
        ] = diagramEngine.getRelativeMousePoint(event)[coordinate];
        auxPoints[index + 3][
          coordinate
        ] = diagramEngine.getRelativeMousePoint(event)[coordinate];
        points[index].setPosition(auxPoints[index]);
        points[index + 3].setPosition(auxPoints[index + 3]);
        points[index + 1].remove();
        points[index + 1].remove();
        return;
      }
    }

    // If no condition above handled then just update path points position
    const auxPoints = {
      [index]: points[index].getPosition(),
      [index + 1]: points[index + 1].getPosition(),
    };
    auxPoints[index][
      coordinate
    ] = diagramEngine.getRelativeMousePoint(event)[coordinate];
    auxPoints[index + 1][
      coordinate
    ] = diagramEngine.getRelativeMousePoint(event)[coordinate];
    points[index].setPosition(auxPoints[index]);
    points[index + 1].setPosition(auxPoints[index + 1]);
  }

  draggingEvent(event, index) {
    const { link } = this.props;

    const points = link.getPoints();

    /**
     * Get moving difference.
     *
     * `index + 1` will work because links indexes has `length = points.length - 1`
     */
    const dx = Math.abs(
      points[index].getX() - points[index + 1].getX(),
    );
    const dy = Math.abs(
      points[index].getY() - points[index + 1].getY(),
    );

    // Moving with y direction
    if (dx === 0) {
      this.calculatePositions(points, event, index, 'x');
    } else if (dy === 0) {
      this.calculatePositions(points, event, index, 'y');
    }
    link.setFirstAndLastPathsDirection();
  }

  handleMove = event => {
    this.draggingEvent(event, this.draggingIndex);
  };

  handleUp = () => {
    // Unregister handlers to avoid multiple event handlers for other links
    this.setState({ canDrag: false, selected: false });
    window.removeEventListener('mousemove', this.handleMove);
    window.removeEventListener('mouseup', this.handleUp);
  };

  render() {
    const { link } = this.props;
    const { canDrag } = this.state;

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
          new PointModel({
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
    else if (!canDrag && points.length > 2) {
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
    if (points.length === 2 && dy !== 0 && !canDrag) {
      link.addPoint(
        new PointModel({
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
            onMouseDown: (event: MouseEvent) => {
              if (event.button === 0) {
                this.setState({ canDrag: true });
                this.draggingIndex = j;
                // Register mouse move event to track mouse position
                // On mouse up these events are unregistered check "this.handleUp"
                window.addEventListener('mousemove', this.handleMove);
                window.addEventListener('mouseup', this.handleUp);
              }
            },
            onMouseEnter: () => {
              this.setState({ selected: true });
              link.lastHoverIndexOfPath = j;
            },
          },
          j,
        ),
      );
    }

    this.refPaths = [];
    return (
      <g data-default-link-test={link.getOptions().testName}>
        {paths}
      </g>
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
