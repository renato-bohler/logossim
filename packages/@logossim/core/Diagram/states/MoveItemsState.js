import { Point } from '@projectstorm/geometry';
import {
  Action,
  InputType,
  BasePositionModel,
  AbstractDisplacementState,
} from '@projectstorm/react-canvas-core';
import { NodeModel } from '@projectstorm/react-diagrams-core';

import { snap, samePosition } from './common';

export default class MoveItemsState extends AbstractDisplacementState {
  constructor() {
    super({
      name: 'move-items',
    });

    this.registerAction(
      new Action({
        type: InputType.MOUSE_DOWN,
        fire: event => {
          this.lastDisplacement = new Point(0, 0);

          const element = this.engine
            .getActionEventBus()
            .getModelForEvent(event);

          if (!element.isSelected()) {
            this.engine.getModel().clearSelection();
          }

          element.setSelected(true);
          this.engine.repaintCanvas();
        },
      }),
    );
  }

  activated(previous) {
    super.activated(previous);
    this.initialPositions = {};
  }

  fireMouseMoved(event) {
    const currentDisplacement = snap(
      new Point(
        event.virtualDisplacementX,
        event.virtualDisplacementY,
      ),
      this.engine.getModel().getOptions().gridSize,
    );

    if (samePosition(currentDisplacement, this.lastDisplacement)) {
      return;
    }
    this.lastDisplacement = currentDisplacement;

    this.engine
      .getModel()
      .getSelectedEntities()
      .forEach(entity => {
        if (entity instanceof BasePositionModel) {
          this.moveEntity(entity, event);

          if (entity instanceof NodeModel) {
            this.adjustNodeLinks(entity);
          }
        }
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

  adjustLinkPoints(link) {
    const points = link.getPoints();
    const first = link.getFirstPoint().getPosition();
    const last = link.getLastPoint().getPosition();

    if (
      points.length === 2 &&
      first.x !== last.x &&
      first.y !== last.y
    ) {
      link.addPoint(link.generatePoint(first.x, last.y), 1);
    } else if (points.length === 3) {
      const middlePoint = points[1];
      let middle = middlePoint.getPosition();

      if (first.x !== middle.x) {
        middlePoint.setPosition(first.x, middle.y);
        middle = middlePoint.getPosition();
      } else if (last.y !== middle.y) {
        middlePoint.setPosition(middle.x, last.y);
        middle = middlePoint.getPosition();
      }

      if (samePosition(first, middle) || samePosition(middle, last)) {
        link.removePoint(middlePoint);
      }
    }
  }
}
