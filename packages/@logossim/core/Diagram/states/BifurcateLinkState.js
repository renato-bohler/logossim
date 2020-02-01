import { Point } from '@projectstorm/geometry';
import {
  AbstractDisplacementState,
  Action,
  InputType,
} from '@projectstorm/react-canvas-core';
import {
  NodeModel,
  PortModel,
} from '@projectstorm/react-diagrams-core';

import {
  snap,
  samePosition,
  handleMouseMoved,
  mergeWithBifurcation,
  getBifurcationLandingLink,
  handleReverseBifurcation,
} from './common';

export default class BifurcateLinkState extends AbstractDisplacementState {
  constructor(options) {
    super({ name: 'bifurcate-link' });

    this.config = {
      ...options,
    };

    this.registerAction(
      new Action({
        type: InputType.MOUSE_DOWN,
        fire: event => {
          this.moveDirection = undefined;
          this.hasStartedMoving = false;

          this.source = this.engine.getMouseElement(event.event);

          const position = this.snapPointToSourceLink(
            this.engine.getRelativeMousePoint(event.event),
            this.source,
          );

          if (this.source.isLocked()) {
            this.eject();
            return;
          }

          this.bifurcation = this.engine
            .getLinkFactories()
            .getFactory(this.source.getType())
            .generateModel();

          if (!this.bifurcation) {
            this.eject();
            return;
          }

          this.bifurcation.setBifurcationSource(this.source);
          this.bifurcation.getFirstPoint().setPosition(position);
          this.bifurcation.getLastPoint().setPosition(position);

          this.bifurcation.setSelected(true);
          this.engine.getModel().clearSelection();

          this.source.setSelected(false);
          this.source.addBifurcation(this.bifurcation);
          this.engine.getModel().addLink(this.bifurcation);
        },
      }),
    );

    this.registerAction(
      new Action({
        type: InputType.MOUSE_UP,
        fire: event => {
          // Link selection
          if (this.isNearbySourcePosition()) {
            this.cleanUp();
            this.engine.getModel().clearSelection();
            this.source.setSelected(true);
            this.engine.repaintCanvas();
            return;
          }

          const model = this.engine.getMouseElement(event.event);

          if (
            model instanceof PortModel &&
            model.isNewLinkAllowed()
          ) {
            this.bifurcation.setTargetPort(model);
            model.reportPosition();
            this.engine.repaintCanvas();
            return;
          }

          if (model instanceof NodeModel) {
            this.cleanUp();
            this.engine.repaintCanvas();
            return;
          }

          const landingLink = getBifurcationLandingLink(
            this.bifurcation,
            this.engine,
          );
          if (landingLink) {
            handleReverseBifurcation.call(
              this,
              this.bifurcation,
              landingLink,
            );
          }

          mergeWithBifurcation(
            this.bifurcation.getBifurcationSource(),
          );
        },
      }),
    );
  }

  cleanUp() {
    this.source.removeBifurcation(this.bifurcation);
    this.bifurcation.remove();
  }

  snapPointToSourceLink(position, source) {
    const { gridSize } = this.engine.getModel().getOptions();
    const sourcePoints = source.getPoints();

    const closestCorner = this.getClosestCornerToPosition(
      sourcePoints,
      position,
    );

    if (closestCorner.distance < gridSize - 1) {
      return new Point(
        closestCorner.position.x,
        closestCorner.position.y,
      );
    }

    const closestPath = this.getClosestPathToPosition(
      sourcePoints,
      position,
    );

    const snappedPosition = snap(position, gridSize);

    return new Point(
      closestPath.axis === 'x'
        ? closestPath.position
        : snappedPosition.x,
      closestPath.axis === 'y'
        ? closestPath.position
        : snappedPosition.y,
    );
  }

  getClosestCornerToPosition(points, position) {
    return points
      .map(sourcePoint => ({
        distance: Math.hypot(
          position.x - sourcePoint.position.x,
          position.y - sourcePoint.position.y,
        ),
        ...sourcePoint,
      }))
      .reduce((closest, point) =>
        point.distance < closest.distance ? point : closest,
      );
  }

  getPathPoints(points) {
    return points
      .map((point, i) => ({ from: points[i], to: points[i + 1] }))
      .filter(tuple => tuple.to);
  }

  getPathDirections(points) {
    return this.getPathPoints(points).map(pathPosition =>
      pathPosition.from.position.x === pathPosition.to.position.x
        ? {
            axis: 'x',
            position: pathPosition.from.position.x,
          }
        : {
            axis: 'y',
            position: pathPosition.from.position.y,
          },
    );
  }

  getClosestPathToPosition(points, position) {
    return this.getPathDirections(points)
      .map(path => ({
        distance: Math.abs(position[path.axis] - path.position),
        ...path,
      }))
      .reduce((closest, path) =>
        path.distance < closest.distance ? path : closest,
      );
  }

  isNearbySourcePosition() {
    return samePosition(
      this.bifurcation.getFirstPoint().getPosition(),
      this.bifurcation.getLastPoint().getPosition(),
    );
  }

  fireMouseMoved(event) {
    handleMouseMoved.call(this, event, this.bifurcation);
  }
}
