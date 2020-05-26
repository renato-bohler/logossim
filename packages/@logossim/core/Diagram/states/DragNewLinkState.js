import {
  AbstractDisplacementState,
  Action,
  InputType,
} from '@projectstorm/react-canvas-core';
import {
  NodeModel,
  PortModel,
} from '@projectstorm/react-diagrams-core';

import { nearby, getLandingLink } from './common';
import handleLinkDrag from './handleLinkDrag';

/**
 * This State is responsible for handling link creation events.
 */
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

          // Disallows creation under nodes
          if (
            model instanceof NodeModel ||
            this.isNearbySourcePort(event.event)
          ) {
            this.link.remove();
            this.engine.repaintCanvas();
          }

          // Link connecting to port
          if (
            model instanceof PortModel &&
            this.port.canLinkToPort(model)
          ) {
            // Disallows connecting ports with different bit numbers
            if (this.port.getBits() !== model.getBits()) {
              this.link.remove();
              this.engine.repaintCanvas();
              return;
            }

            this.link.setTargetPort(model);
            model.reportPosition();
            this.engine.repaintCanvas();
            this.fireEvent();
            return;
          }

          // Link landing on another link
          const landing = getLandingLink(this.link, this.engine);
          if (landing) {
            // Disallows connecting links with different bit numbers
            if (landing.getBits() !== this.link.getBits()) {
              this.link.remove();
              this.engine.repaintCanvas();
              return;
            }

            const reverse = this.engine
              .getFactoryForLink(landing)
              .generateModel();
            reverse.setPoints(this.link.getPoints().reverse());
            reverse.setTargetPort(this.link.getSourcePort());
            reverse.setBifurcationSource(landing);
            reverse.setBits(landing.getBits());

            landing.addBifurcation(reverse);
            landing.setSelected(true);

            this.link.remove();
            this.engine.getModel().addLink(reverse);
            this.link = reverse;
          }

          this.fireEvent();
        },
      }),
    );
  }

  /**
   * Event is fired to be on the command manager, so the user can undo
   * and redo it.
   */
  fireEvent = () => {
    this.engine.fireEvent({ link: this.link }, 'linkAdded');
  };

  isNearbySourcePort(event) {
    const point = this.engine.getRelativeMousePoint(event);

    const sourcePort = this.link.getSourcePort();
    const sourcePortSize = sourcePort.width;
    const sourcePortPosition = sourcePort.getPosition();

    return nearby(point, sourcePortPosition, sourcePortSize);
  }

  /**
   * Updates link's points upon mouse move.
   */
  fireMouseMoved(event) {
    handleLinkDrag.call(this, event, this.link);
  }
}
