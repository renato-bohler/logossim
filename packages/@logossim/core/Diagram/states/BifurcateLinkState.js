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
  getBifurcationLandingLink,
  handleReverseBifurcation,
  isPointOverLink,
  sameX,
  sameAxis,
  closestPointToLink,
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
            this.adjustBifurcationOverlayingSource(this.bifurcation);
            this.engine.repaintCanvas();
            return;
          }

          if (model instanceof NodeModel) {
            this.cleanUp();
            this.engine.repaintCanvas();
            return;
          }

          if (this.bifurcation.getSourcePort()) {
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
          }

          this.mergeWithBifurcation(
            this.bifurcation.getBifurcationSource(),
          );
          this.adjustBifurcationOverlayingSource(this.bifurcation);
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
      sameX(pathPosition.from.position, pathPosition.to.position)
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

  adjustBifurcationOverlayingSource() {
    const source = this.bifurcation.getBifurcationSource();

    if (
      samePosition(
        this.bifurcation.getFirstPosition(),
        source.getLastPosition(),
      )
    ) {
      if (
        isPointOverLink(this.bifurcation.getSecondPosition(), source)
      ) {
        this.bifurcation.removePoint(
          this.bifurcation.getFirstPoint(),
        );
      }
      return;
    }

    if (
      isPointOverLink(this.bifurcation.getFirstPosition(), source) &&
      isPointOverLink(this.bifurcation.getSecondPosition(), source)
    ) {
      if (!this.bifurcation.hasMiddlePoint()) {
        this.bifurcation.remove();
        source.removeBifurcation(this.bifurcation);
        return;
      }

      this.bifurcation.removePoint(this.bifurcation.getFirstPoint());

      if (
        samePosition(
          this.bifurcation.getFirstPosition(),
          source.getMiddlePosition(),
        )
      ) {
        if (
          isPointOverLink(this.bifurcation.getLastPosition(), source)
        ) {
          this.bifurcation.remove();
          source.removeBifurcation(this.bifurcation);
          return;
        }

        this.bifurcation
          .getFirstPoint()
          .setPosition(source.getLastPosition());
        this.mergeWithBifurcation(source);
        return;
      }
    }

    if (source.hasMiddlePoint()) {
      if (
        sameAxis(
          this.bifurcation.getFirstPosition(),
          source.getMiddlePosition(),
          this.bifurcation.getSecondPosition(),
        )
      ) {
        this.bifurcation
          .getFirstPoint()
          .setPosition(source.getMiddlePosition());
      }
    }
  }

  mergeWithBifurcation(link) {
    const source = {
      first: link.getFirstPosition(),
      middle: link.getMiddlePosition(),
      last: link.getLastPosition(),
      secondLast: link.getSecondLastPosition(),
    };

    const elegibleBifurcations = link.getBifurcations().filter(b => {
      if (!samePosition(b.getFirstPosition(), source.last))
        return false;

      if (!link.hasMiddlePoint() && !b.hasMiddlePoint()) return true;

      if (link.hasMiddlePoint() && b.hasMiddlePoint()) {
        if (samePosition(source.middle, b.getMiddlePosition())) {
          return true;
        }
        return false;
      }

      if (
        sameAxis(
          source.last,
          source.secondLast,
          b.getSecondPosition(),
        )
      )
        return true;

      return false;
    });

    const bifurcationToMerge = elegibleBifurcations[0];

    if (!bifurcationToMerge) return;

    const newMiddle = bifurcationToMerge.getSecondLastPosition();
    const newLast = bifurcationToMerge.getLastPosition();

    if (!link.hasMiddlePoint()) {
      link.addPoint(link.generatePoint(newMiddle.x, newMiddle.y), 1);
    }

    link.getLastPoint().setPosition(newLast.x, newLast.y);

    if (link.isStraight() && link.hasMiddlePoint()) {
      link.removePoint(link.getMiddlePoint());
    }

    link.removeBifurcation(bifurcationToMerge);
    bifurcationToMerge.remove();

    if (
      samePosition(link.getFirstPosition(), link.getLastPosition())
    ) {
      link.remove();
    } else {
      link.setSelected(true);
    }

    this.adjustBifurcationSources(link);
  }

  adjustBifurcationSources(link) {
    const { gridSize } = this.engine.getModel().getOptions();

    link
      .getBifurcations()
      .filter(b => !isPointOverLink(b.getFirstPosition(), link))
      .forEach(b => {
        const newSource = snap(
          closestPointToLink(b.getFirstPosition(), link),
          gridSize,
        );

        b.getFirstPoint().setPosition(newSource.x, newSource.y);

        if (sameAxis(b.getFirstPosition(), b.getLastPosition()))
          return;

        // Adjust middle point aswell
        if (b.hasMiddlePoint()) {
          b.removePoint(b.getMiddlePoint());
        }

        if (
          sameX(link.getFirstPosition(), link.getSecondPosition())
        ) {
          b.addPoint(
            b.generatePoint(
              b.getLastPosition().x,
              b.getFirstPosition().y,
            ),
            1,
          );
        } else {
          b.addPoint(
            b.generatePoint(
              b.getFirstPosition().x,
              b.getLastPosition().y,
            ),
            1,
          );
        }
      });
  }

  fireMouseMoved(event) {
    handleMouseMoved.call(this, event, this.bifurcation);
  }
}
