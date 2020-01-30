import {
  AbstractDisplacementState,
  Action,
  InputType,
} from '@projectstorm/react-canvas-core';
import {
  NodeModel,
  PortModel,
} from '@projectstorm/react-diagrams-core';

import { nearby, handleMouseMoved } from './common';

export default class DragNewLinkState extends AbstractDisplacementState {
  constructor(options = {}) {
    super({ name: 'drag-new-link' });

    this.config = {
      ...options,
    };

    this.registerAction(
      new Action({
        type: InputType.MOUSE_DOWN,
        fire: event => {
          this.moveDirection = undefined;
          this.hasStartedMoving = false;

          this.port = this.engine.getMouseElement(event.event);

          if (
            !(this.port instanceof PortModel) ||
            this.port.isLocked()
          ) {
            this.eject();
            return;
          }

          this.link = this.port.createLinkModel();

          if (!this.link) {
            this.eject();
            return;
          }

          this.link.setSelected(true);
          this.link.setSourcePort(this.port);
          this.engine.getModel().clearSelection();
          this.engine.getModel().addLink(this.link);
          this.port.reportPosition();
        },
      }),
    );

    this.registerAction(
      new Action({
        type: InputType.MOUSE_UP,
        fire: event => {
          const model = this.engine.getMouseElement(event.event);

          if (
            model instanceof PortModel &&
            this.port.canLinkToPort(model)
          ) {
            this.link.setTargetPort(model);
            model.reportPosition();
            this.engine.repaintCanvas();
            return;
          }

          if (
            model instanceof NodeModel ||
            this.isNearbySourcePort(event.event)
          ) {
            this.link.remove();
            this.engine.repaintCanvas();
          }
        },
      }),
    );
  }

  isNearbySourcePort(event) {
    const point = this.engine.getRelativeMousePoint(event);

    const sourcePort = this.link.getSourcePort();
    const sourcePortSize = sourcePort.width;
    const sourcePortPosition = sourcePort.getPosition();

    return nearby(point, sourcePortPosition, sourcePortSize);
  }

  fireMouseMoved(event) {
    handleMouseMoved.call(this, event, this.link);
  }
}
