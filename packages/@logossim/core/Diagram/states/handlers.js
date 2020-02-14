import { Point } from '@projectstorm/geometry';

import { snap, samePosition } from './common';

const getRelativePoint = (point, model) => {
  const zoomLevelPercentage = model.getZoomLevel() / 100;
  const engineOffsetX = model.getOffsetX() / zoomLevelPercentage;
  const engineOffsetY = model.getOffsetY() / zoomLevelPercentage;

  return new Point(point.x - engineOffsetX, point.y - engineOffsetY);
};

const nextLinkPosition = (
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

/**
 * Handles mouse move on link or bifurcation creation, creating and
 * moving link points according to user input.
 *
 * This implementation mimics logisim link creation behavior.
 */
export function handleMouseMoved(event, link) {
  const first = link.getFirstPosition();
  const last = link.getLastPosition();

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
    if (!link.hasMiddlePoint()) {
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
    } else if (link.hasMiddlePoint()) {
      const middle = link.getMiddlePosition();

      if (samePosition(middle, last)) {
        link.removePoint(link.getMiddlePoint());
      } else if (samePosition(first, middle)) {
        link.removePoint(link.getMiddlePoint());
        this.moveDirection =
          this.moveDirection === 'horizontal'
            ? 'vertical'
            : 'horizontal';
      } else if (this.moveDirection === 'horizontal') {
        if (last.x !== nextPosition.x) {
          link.getMiddlePoint().setPosition(nextPosition.x, first.y);
        }
      } else if (this.moveDirection === 'vertical') {
        if (last.y !== nextPosition.y) {
          link.getMiddlePoint().setPosition(first.x, nextPosition.y);
        }
      }
    }
  }

  /**
   * Sometimes, user input may be fast enough to skip the creation of
   * a middle point. If this happens, we add it here.
   */
  if (
    !link.hasMiddlePoint() &&
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

/**
 * Handles bifurcations which have a link as a target.
 */
export function handleLinkToLinkBifurcation(link, landingLink) {
  link.setBifurcationTarget(landingLink);
  landingLink.addBifurcation(link);
  landingLink.setSelected(true);
}

/**
 * Handles new links created targeting existing links.
 */
export function handleReverseBifurcation(link, landingLink) {
  const reverseLink = this.engine
    .getFactoryForLink(landingLink)
    .generateModel();
  reverseLink.setPoints(link.getPoints().reverse());
  reverseLink.setTargetPort(link.getSourcePort());
  reverseLink.setBifurcationSource(landingLink);

  landingLink.addBifurcation(reverseLink);
  landingLink.setSelected(true);

  link.remove();
  this.engine.getModel().addLink(reverseLink);
}
