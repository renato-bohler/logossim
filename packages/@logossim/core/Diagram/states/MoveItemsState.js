import { Point } from '@projectstorm/geometry';
import {
  Action,
  InputType,
  AbstractDisplacementState,
} from '@projectstorm/react-canvas-core';

import BaseModel from '../../BaseModel';
import {
  snap,
  samePosition,
  sameX,
  sameY,
  closestPointToLink,
} from './common';

/**
 * This State handles node moving.
 *
 * When nodes are moved, all of its links (and all bifurcations from
 * or to this link) need to be rearranged.
 */
export default class MoveItemsState extends AbstractDisplacementState {
  constructor() {
    super({
      name: 'move-items',
    });

    this.registerAction(
      new Action({
        type: InputType.MOUSE_DOWN,
        fire: event => {
          if (this.engine.getModel().isLocked()) {
            this.eject();
            return;
          }

          this.lastDisplacement = new Point(0, 0);

          this.element = this.engine
            .getActionEventBus()
            .getModelForEvent(event);

          if (!this.element) {
            this.eject();
            return;
          }

          if (!this.element.isSelected()) {
            this.engine.getModel().clearSelection();
          }

          this.linkDirections = this.getLinkDirections(this.element);

          this.element.setSelected(true);
          this.engine.repaintCanvas();

          this.nodesBefore = this.getNodesPositions();
          this.linksBefore = this.getLinksPoints();
        },
      }),
    );

    this.registerAction(
      new Action({
        type: InputType.MOUSE_UP,
        fire: () => {
          if (
            this.lastDisplacement.x === 0 &&
            this.lastDisplacement.y === 0
          ) {
            return;
          }

          this.fireEvent();
        },
      }),
    );
  }

  getNodesPositions = () =>
    this.engine
      .getModel()
      .getSelectedEntities()
      .filter(
        model => Object.getPrototypeOf(model) instanceof BaseModel,
      )
      .map(node => ({
        id: node.getID(),
        position: node.getPosition(),
      }));

  getLinksPoints = () =>
    this.engine
      .getModel()
      .getSelectedEntities()
      .filter(
        model => Object.getPrototypeOf(model) instanceof BaseModel,
      )
      .map(node => node.getAllLinks())
      .flat()
      .map(link => ({
        id: link.getID(),
        points: link.getPoints().map(point => point.getPosition()),
      }));

  /**
   * Event is fired to be on the command manager, so the user can undo
   * and redo it.
   */
  fireEvent() {
    this.engine.fireEvent(
      {
        nodes: {
          before: this.nodesBefore,
          after: this.getNodesPositions(),
        },
        links: {
          before: this.linksBefore,
          after: this.getLinksPoints(),
        },
      },
      'entitiesMoved',
    );
  }

  activated(previous) {
    super.activated(previous);
    this.initialPositions = {};
  }

  /**
   * Gets all links from a given node, including all its bifurcations.
   */
  getLinksFromNode(node) {
    if (!(Object.getPrototypeOf(node) instanceof BaseModel))
      return [];

    return Object.values(node.getPorts())
      .map(p => Object.entries(p.getLinks()))
      .filter(entry => entry.length > 0)
      .flat()
      .map(([id, link]) => [
        [id, link],
        ...this.getBifurcatedLinks(link),
      ])
      .flat();
  }

  getBifurcatedLinks(link) {
    return link
      .getBifurcations()
      .map(b => [[b.getID(), b], ...this.getBifurcatedLinks(b)])
      .flat();
  }

  getLinkDirections(node) {
    return this.getLinksFromNode(node).reduce(
      (acc, [id, link]) => ({
        ...acc,
        [id]: this.getLinkDirection(link),
      }),
      {},
    );
  }

  getLinkDirection(link) {
    if (!link.hasMiddlePoint()) {
      return null;
    }

    const first = link.getFirstPosition();
    const middle = link.getMiddlePosition();

    if (sameX(first, middle)) return 'vertical';
    if (sameY(first, middle)) return 'horizontal';

    return null;
  }

  fireMouseMoved(event) {
    // Allow moving only with left clicks
    if (event.event.nativeEvent.which !== 1) return;

    const currentDisplacement = snap(
      new Point(
        event.virtualDisplacementX,
        event.virtualDisplacementY,
      ),
      this.engine.getModel().getOptions().gridSize,
    );

    // Avoids rearranging everything before moving at least one grid
    if (samePosition(currentDisplacement, this.lastDisplacement)) {
      return;
    }
    this.lastDisplacement = currentDisplacement;

    this.engine
      .getModel()
      .getSelectedEntities()
      .filter(
        entity => Object.getPrototypeOf(entity) instanceof BaseModel,
      )
      .forEach(entity => {
        this.moveEntity(entity, event);
        this.adjustNodeLinks(entity);
      });

    this.engine.repaintCanvas();
  }

  moveEntity(entity, event) {
    if (entity.isLocked()) {
      return;
    }

    if (!this.initialPositions[entity.getID()]) {
      this.initialPositions[entity.getID()] = {
        point: entity.getPosition(),
        item: entity,
      };
    }

    const initial = this.initialPositions[entity.getID()].point;
    const model = this.engine.getModel();

    entity.setPosition(
      model.getGridPosition(initial.x + event.virtualDisplacementX),
      model.getGridPosition(initial.y + event.virtualDisplacementY),
    );
  }

  adjustNodeLinks(node) {
    Object.values(node.getPorts()).forEach(port =>
      Object.values(port.getLinks()).forEach(this.adjustLinkPoints),
    );
  }

  adjustLinkPoints = link => {
    const first = link.getFirstPosition();
    const last = link.getLastPosition();

    if (
      !link.hasMiddlePoint() &&
      first.x !== last.x &&
      first.y !== last.y
    ) {
      link.addPoint(link.generatePoint(first.x, last.y), 1);
    } else if (link.hasMiddlePoint()) {
      const linkDirection = this.linkDirections[link.getID()];

      if (linkDirection === 'horizontal') {
        link.getMiddlePoint().setPosition(last.x, first.y);
      } else {
        link.getMiddlePoint().setPosition(first.x, last.y);
      }

      const middle = link.getMiddlePosition();

      if (samePosition(first, middle) || samePosition(middle, last)) {
        link.removePoint(link.getMiddlePoint());
      }
    }

    // Adjusts origin/target position from bifurcations of this link
    this.adjustLinkBifurcations(link);
  };

  adjustLinkBifurcations(link) {
    const bifurcations = link.getBifurcations();

    bifurcations.forEach(bifurcation => {
      this.adjustFirstAndLastPoints(bifurcation);

      // Adjusts the points of this bifurcation (recursion)
      this.adjustLinkPoints(bifurcation);
    });
  }

  /**
   * Assures that the first position on a bifurcation is still over
   * the source link, and that the last position is still over the
   * target link.
   */
  adjustFirstAndLastPoints(bifurcation) {
    const { gridSize } = this.engine.getModel().getOptions();

    const first = bifurcation.getFirstPoint();
    const closestToFirst = snap(
      closestPointToLink(
        first.getPosition(),
        bifurcation.getBifurcationSource(),
      ),
      gridSize,
    );
    first.setPosition(closestToFirst.x, closestToFirst.y);

    if (bifurcation.getBifurcationTarget()) {
      const last = bifurcation.getLastPoint();
      const closestToLast = snap(
        closestPointToLink(
          last.getPosition(),
          bifurcation.getBifurcationTarget(),
        ),
        gridSize,
      );
      last.setPosition(closestToLast.x, closestToLast.y);
    }
  }
}
