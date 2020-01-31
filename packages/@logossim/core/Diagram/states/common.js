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

const distance = (A, B) => Math.hypot(A.x - B.x, A.y - B.y);

export const closestPointOnSegment = (P, segment) => {
  const { A, B } = segment;

  const v = new Point(B.x - A.x, B.y - A.y);
  const u = new Point(A.x - P.x, A.y - P.y);

  const vu = v.x * u.x + v.y * u.y;
  const vv = v.x ** 2 + v.y ** 2;

  const t = -vu / vv;

  // Closest point lies between A and B
  if (t >= 0 && t <= 1) {
    const closest = new Point(
      (1 - t) * A.x + t * B.x,
      (1 - t) * A.y + t * B.y,
    );
    return {
      point: closest,
      distance: distance(P, closest),
    };
  }

  // Closest point is either A or B
  const distanceToA = distance(P, A);
  const distanceToB = distance(P, B);

  return distanceToA <= distanceToB
    ? { point: A, distance: distanceToA }
    : { point: B, distance: distanceToB };
};

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

  if (!this.hasStartedMoving && samePosition(first, last)) {
    /**
     * For some reason, inputs are only valid after the first and last
     * position are equals once. Before that, the last position is
     * (0, 0).
     */
    this.hasStartedMoving = true;
  }

  if (this.hasStartedMoving) {
    if (points.length === 2) {
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
    if (samePosition(first, last)) {
      link.addPoint(link.generatePoint(nextPosition.x, first.y), 1);
    } else {
      link.addPoint(link.generatePoint(last.x, last.y), 1);
    }
  }

  link.getLastPoint().setPosition(nextPosition.x, nextPosition.y);

  this.engine.repaintCanvas();
}

const isLinkStraight = link => {
  const points = link.getPoints();

  if (points.length === 2) return true;

  const first = points[0].getPosition();
  const middle = points[1].getPosition();
  const last = points[2].getPosition();

  if (first.x === middle.x && middle.x === last.x) return true;
  if (first.y === middle.y && middle.y === last.y) return true;

  return false;
};

export const mergeWithBifurcation = link => {
  const source = {
    first: link.getFirstPoint().getPosition(),
    middle:
      link.getPoints().length === 3
        ? link.getPoints()[1].getPosition()
        : null,
    last: link.getLastPoint().getPosition(),
    secondLast: link
      .getPoints()
      [link.getPoints().length - 2].getPosition(),
  };

  const elegibleBifurcations = link.getBifurcations().filter(b => {
    const bifurcation = {
      first: b.getFirstPoint().getPosition(),
      second: b.getPoints()[1].getPosition(),
      middle:
        b.getPoints().length === 3
          ? b.getPoints()[1].getPosition()
          : null,
      last: b.getLastPoint().getPosition(),
    };

    if (!samePosition(bifurcation.first, source.last)) return false;

    if (!source.middle && !bifurcation.middle) return true;

    if (source.middle && bifurcation.middle) {
      if (samePosition(source.middle, bifurcation.middle))
        return true;
      return false;
    }

    if (
      source.last.x === source.secondLast.x &&
      source.secondLast.x === bifurcation.second.x
    )
      return true;

    if (
      source.last.y === source.secondLast.y &&
      source.secondLast.y === bifurcation.second.y
    )
      return true;

    return false;
  });

  const bifurcationToMerge = elegibleBifurcations[0];

  if (!bifurcationToMerge) return;

  const newMiddle = bifurcationToMerge
    .getPoints()
    [bifurcationToMerge.getPoints().length - 2].getPosition();
  const newLast = bifurcationToMerge.getLastPoint().getPosition();

  if (link.getPoints().length === 2) {
    link.addPoint(link.generatePoint(newMiddle.x, newMiddle.y), 1);
  }

  link.getLastPoint().setPosition(newLast.x, newLast.y);

  if (link.getPoints().length === 3 && isLinkStraight(link)) {
    link.removePoint(link.getPoints()[1]);
  }

  link.removeBifurcation(bifurcationToMerge);
  bifurcationToMerge.remove();

  if (
    samePosition(
      link.getFirstPoint().getPosition(),
      link.getLastPoint().getPosition(),
    )
  ) {
    link.remove();
  } else {
    link.setSelected(true);
  }
};
