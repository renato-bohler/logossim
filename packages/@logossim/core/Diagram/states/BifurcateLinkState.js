import { Point } from '@projectstorm/geometry';
import {
  AbstractDisplacementState,
  Action,
  InputType,
} from '@projectstorm/react-canvas-core';
import { PortModel } from '@projectstorm/react-diagrams-core';

import {
  snap,
  nearby,
  handleMouseMoved,
  getRelativePoint,
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

          if (
            !this.config.allowLinksFromLockedPorts &&
            this.source.isLocked()
          ) {
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

          this.bifurcation.setSourcePort(this.source.getSourcePort());
          this.bifurcation.setSelected(true);

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
          if (this.isNearbySourcePosition(event.event)) {
            this.cleanUp();
            this.source.setSelected(true);
            this.engine.repaintCanvas();
            return;
          }

          const model = this.engine.getMouseElement(event.event);

          if (
            model instanceof PortModel &&
            this.bifurcation.getSourcePort().canLinkToPort(model)
          ) {
            this.bifurcation.setTargetPort(model);
            model.reportPosition();
            this.engine.repaintCanvas();
            return;
          }

          if (!this.config.allowLooseLinks) {
            this.cleanUp();
            this.engine.repaintCanvas();
          }
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

  isNearbySourcePosition({ clientX, clientY }) {
    const model = this.engine.getModel();

    const point = getRelativePoint(
      new Point(clientX, clientY),
      model,
    );

    return nearby(
      point,
      this.bifurcation.getFirstPoint().getPosition(),
      model.getOptions().gridSize / 2,
    );
  }

  fireMouseMoved(event) {
    handleMouseMoved.call(this, event, this.bifurcation);
  }
}
