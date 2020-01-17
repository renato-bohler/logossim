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
  p1.x >= p2.x &&
  p1.x <= p2.x + tolerance &&
  p1.y >= p2.y &&
  p1.y <= p2.y + tolerance;
