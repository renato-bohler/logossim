import { Point } from '@projectstorm/geometry';

/**
 * Returns a position, but snapped to the grid.
 */
export const snap = (position, gridSize = 15) => {
  if (position instanceof Point) {
    return new Point(
      Math.round(position.x / gridSize) * gridSize,
      Math.round(position.y / gridSize) * gridSize,
    );
  }

  return Math.round(position / gridSize) * gridSize;
};

/**
 * Checks if two points are on the same position.
 */
export const samePosition = (p1, p2) =>
  p1 &&
  p2 &&
  Math.round(p1.x) === Math.round(p2.x) &&
  Math.round(p1.y) === Math.round(p2.y);

/**
 * Checks if all given points share the same X position.
 */
export const sameX = (...points) =>
  points.map(p => Math.round(p.x)).every((p, i, arr) => p === arr[0]);

/**
 * Checks if all given points share the same Y position.
 */
export const sameY = (...points) =>
  points.map(p => Math.round(p.y)).every((p, i, arr) => p === arr[0]);

/**
 * Checks if all given points share positions on any axis.
 */
export const sameAxis = (...points) =>
  sameX(...points) || sameY(...points);

/**
 * Checks if two points are nearby each other, given a tolerance.
 */
export const nearby = (p1, p2, tolerance) =>
  Math.abs(p1.x - p2.x) <= tolerance &&
  Math.abs(p1.y - p2.y) <= tolerance;

/**
 * Finds the closest position to a link from a given point.
 */
export const closestPointToLink = (P, link) => {
  const distance = (A, B) => Math.hypot(A.x - B.x, A.y - B.y);

  const closestPointOnSegment = (Q, segment) => {
    const { A, B } = segment;

    const v = new Point(B.x - A.x, B.y - A.y);
    const u = new Point(A.x - Q.x, A.y - Q.y);

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
        distance: distance(Q, closest),
      };
    }

    // Closest point is either A or B
    const distanceToA = distance(Q, A);
    const distanceToB = distance(Q, B);

    return distanceToA <= distanceToB
      ? { point: A, distance: distanceToA }
      : { point: B, distance: distanceToB };
  };

  if (!link.hasMiddlePoint()) {
    return closestPointOnSegment(P, {
      A: link.getFirstPosition(),
      B: link.getLastPosition(),
    }).point;
  }

  const firstSegment = closestPointOnSegment(P, {
    A: link.getFirstPosition(),
    B: link.getMiddlePosition(),
  });

  const lastSegment = closestPointOnSegment(P, {
    A: link.getMiddlePosition(),
    B: link.getLastPosition(),
  });

  if (firstSegment.distance <= lastSegment.distance) {
    return firstSegment.point;
  }
  return lastSegment.point;
};

/**
 * Determines is a point is over a given segment.
 */
const isPointOverSegment = (point, segment) => {
  const { A, B } = segment;

  if (sameX(A, point, B)) {
    const max = Math.max(A.y, B.y);
    const min = Math.min(A.y, B.y);

    return min <= point.y && point.y <= max;
  }

  if (sameY(A, point, B)) {
    const max = Math.max(A.x, B.x);
    const min = Math.min(A.x, B.x);

    return min <= point.x && point.x <= max;
  }

  return false;
};

/**
 * Determines if a point is over a given link's first segment.
 */
export const isPointOverFirstLinkSegment = (point, link) =>
  isPointOverSegment(point, {
    A: link.getFirstPosition(),
    B: link.getSecondPosition(),
  });

/**
 * Determines if a point is over a given link's second segment.
 */
export const isPointOverSecondLinkSegment = (point, link) => {
  if (!link.hasMiddlePoint()) return false;

  return isPointOverSegment(point, {
    A: link.getSecondPosition(),
    B: link.getLastPosition(),
  });
};

/**
 * Determines if a point is over a given link.
 */
export const isPointOverLink = (point, link) =>
  isPointOverFirstLinkSegment(point, link) ||
  isPointOverSecondLinkSegment(point, link);

/**
 * Searches for any link that the given link might be landing on.
 */
export const getLandingLink = (link, engine) => {
  const point = link.getLastPoint().getPosition();

  return Object.values(
    engine
      .getModel()
      .getLinkLayers()[0]
      .getLinks(),
  ).find(target => {
    if (target.getID() === link.getID()) return false;
    return isPointOverLink(point, target);
  });
};

/**
 * Generates the error message displayed to the user for incompatible
 * display widths.
 */
export const getIncompatibleWidthsErrorMessage = (
  source,
  target,
) => `Incompatible bit widths!
\nSource: ${source.getBits()} bit${source.getBits() > 1 ? 's' : ''}
\nTarget: ${target.getBits()} bit${target.getBits() > 1 ? 's' : ''}`;
