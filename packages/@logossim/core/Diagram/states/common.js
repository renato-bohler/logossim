import { Point } from '@projectstorm/geometry';

export const snap = (position, gridSize = 15) => {
  if (position instanceof Point) {
    return new Point(
      Math.round(position.x / gridSize) * gridSize,
      Math.round(position.y / gridSize) * gridSize,
    );
  }

  return Math.round(position / gridSize) * gridSize;
};

export const samePosition = (p1, p2) =>
  p1.x === p2.x && p1.y === p2.y;

export const nearby = (p1, p2, tolerance) =>
  Math.abs(p1.x - p2.x) <= tolerance &&
  Math.abs(p1.y - p2.y) <= tolerance;

export const getRelativePoint = (point, model) => {
  const zoomLevelPercentage = model.getZoomLevel() / 100;
  const engineOffsetX = model.getOffsetX() / zoomLevelPercentage;
  const engineOffsetY = model.getOffsetY() / zoomLevelPercentage;

  return new Point(point.x - engineOffsetX, point.y - engineOffsetY);
};

export const nextLinkPosition = (
  event,
  model,
  initialRelative,
  sourcePosition,
) => {
  const point = getRelativePoint(sourcePosition, model);

  const zoomLevelPercentage = model.getZoomLevel() / 100;
  const initialXRelative = initialRelative.x / zoomLevelPercentage;
  const initialYRelative = initialRelative.y / zoomLevelPercentage;

  const linkNextX =
    point.x +
    (initialXRelative - sourcePosition.x) +
    event.virtualDisplacementX;
  const linkNextY =
    point.y +
    (initialYRelative - sourcePosition.y) +
    event.virtualDisplacementY;

  return snap(
    new Point(linkNextX, linkNextY),
    model.options.gridSize,
  );
};

export function handleMouseMoved(event, link) {
  const points = link.getPoints();
  const first = link.getFirstPoint().getPosition();
  const last = link.getLastPoint().getPosition();

  const nextPosition = nextLinkPosition(
    event,
    this.engine.getModel(),
    { x: this.initialXRelative, y: this.initialYRelative },
    first,
  );

  if (samePosition(first, last)) {
    /**
     * For some reason, inputs are only valid after the first and last
     * position are equals once. Before that, the last position is
     * (0, 0).
     */
    this.hasStartedMoving = true;
  } else if (this.hasStartedMoving) {
    if (points.length === 2) {
      if (samePosition(first, last)) {
        this.moveDirection = undefined;
      }

      if (last.x !== nextPosition.x) {
        if (!this.moveDirection) {
          this.moveDirection = 'horizontal';
        }

        if (this.moveDirection === 'vertical') {
          link.addPoint(link.generatePoint(last.x, last.y), 1);
        }
      } else if (last.y !== nextPosition.y) {
        if (!this.moveDirection) {
          this.moveDirection = 'vertical';
        }

        if (this.moveDirection === 'horizontal') {
          link.addPoint(link.generatePoint(last.x, last.y), 1);
        }
      }
    } else if (points.length === 3) {
      const middlePoint = points[1];
      const middle = middlePoint.getPosition();

      if (samePosition(middle, last)) {
        link.removePoint(middlePoint);
      } else if (samePosition(first, middle)) {
        link.removePoint(middlePoint);
        this.moveDirection =
          this.moveDirection === 'horizontal'
            ? 'vertical'
            : 'horizontal';
      } else if (this.moveDirection === 'horizontal') {
        if (last.x !== nextPosition.x) {
          middlePoint.setPosition(nextPosition.x, first.y);
        }
      } else if (this.moveDirection === 'vertical') {
        if (last.y !== nextPosition.y) {
          middlePoint.setPosition(first.x, nextPosition.y);
        }
      }
    }
  }

  /**
   * Sometimes, user input may be fast enough to skip the creation of
   * a middle point. If this happens, we add it here.
   */
  if (
    points.length === 2 &&
    first.x !== nextPosition.x &&
    first.y !== nextPosition.y
  ) {
    if (this.moveDirection === 'horizontal') {
      link.addPoint(link.generatePoint(last.x, nextPosition.y), 1);
    } else if (this.moveDirection === 'vertical') {
      link.addPoint(link.generatePoint(nextPosition.x, last.y), 1);
    }
  }

  link.getLastPoint().setPosition(nextPosition.x, nextPosition.y);
  this.engine.repaintCanvas();
}
