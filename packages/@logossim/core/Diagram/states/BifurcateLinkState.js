import {
  AbstractDisplacementState,
  Action,
  InputType,
} from '@projectstorm/react-canvas-core';
import { PortModel } from '@projectstorm/react-diagrams-core';

import { snap, nearby, handleMouseMoved } from './common';

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

          const position = this.engine.getRelativeMousePoint(
            event.event,
          );

          const snappedPosition = snap(
            position,
            this.engine.getModel().gridSize,
          );

          this.source = this.engine.getMouseElement(event.event);

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
          this.bifurcation
            .getFirstPoint()
            .setPosition(snappedPosition);
          this.bifurcation
            .getLastPoint()
            .setPosition(snappedPosition);

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
          const model = this.engine.getMouseElement(event.event);

          if (model instanceof PortModel) {
            if (
              this.bifurcation.getSourcePort().canLinkToPort(model)
            ) {
              this.bifurcation.setTargetPort(model);
              model.reportPosition();
              this.engine.repaintCanvas();
              return;
            }
          }

          if (
            this.isNearbySourcePosition(event.event) ||
            !this.config.allowLooseLinks
          ) {
            this.source.removeBifurcation(this.bifurcation);
            this.bifurcation.remove();
            this.engine.repaintCanvas();
          }
        },
      }),
    );
  }

  isNearbySourcePosition(mousePosition) {
    return nearby(
      mousePosition,
      this.bifurcation.getFirstPoint().getPosition(),
      3,
    );
  }

  fireMouseMoved(event) {
    handleMouseMoved.call(this, event, this.bifurcation);
  }
}
