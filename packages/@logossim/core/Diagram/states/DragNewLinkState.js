import {
  AbstractDisplacementState,
  Action,
  InputType,
} from '@projectstorm/react-canvas-core';
import { PortModel } from '@projectstorm/react-diagrams-core';

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
            !this.config.allowLinksFromLockedPorts &&
            this.port.isLocked()
          ) {
            this.eject();
            return;
          }
          this.link = this.port.createLinkModel();

          // if no link is given, just eject the state
          if (!this.link) {
            this.eject();
            return;
          }
          this.link.setSelected(true);
          this.link.setSourcePort(this.port);
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

          // check to see if we connected to a new port
          if (model instanceof PortModel) {
            if (this.port.canLinkToPort(model)) {
              this.link.setTargetPort(model);
              model.reportPosition();
              this.engine.repaintCanvas();
              return;
            }
          }

          if (
            this.isNearbySourcePort(event.event) ||
            !this.config.allowLooseLinks
          ) {
            this.link.remove();
            this.engine.repaintCanvas();
          }
        },
      }),
    );
  }

  isNearbySourcePort({ clientX, clientY }) {
    const sourcePort = this.link.getSourcePort();
    const sourcePortPosition = this.link
      .getSourcePort()
      .getPosition();

    return (
      clientX >= sourcePortPosition.x &&
      clientX <= sourcePortPosition.x + sourcePort.width &&
      clientY >= sourcePortPosition.y &&
      clientY <= sourcePortPosition.y + sourcePort.height
    );
  }

  fireMouseMoved(event) {
    const portPos = this.port.getPosition();
    const zoomLevelPercentage =
      this.engine.getModel().getZoomLevel() / 100;
    const engineOffsetX =
      this.engine.getModel().getOffsetX() / zoomLevelPercentage;
    const engineOffsetY =
      this.engine.getModel().getOffsetY() / zoomLevelPercentage;
    const initialXRelative =
      this.initialXRelative / zoomLevelPercentage;
    const initialYRelative =
      this.initialYRelative / zoomLevelPercentage;
    const linkNextX =
      portPos.x -
      engineOffsetX +
      (initialXRelative - portPos.x) +
      event.virtualDisplacementX;
    const linkNextY =
      portPos.y -
      engineOffsetY +
      (initialYRelative - portPos.y) +
      event.virtualDisplacementY;

    const snappedX = Math.round(linkNextX / 15) * 15;
    const snappedY = Math.round(linkNextY / 15) * 15;

    const first = this.link.getFirstPoint().getPosition();
    const last = this.link.getLastPoint().getPosition();

    if (this.hasStartedMoving) {
      if (this.link.getPoints().length === 2) {
        if (first.x === last.x && first.y === last.y) {
          this.moveDirection = undefined;
        }

        if (last.x !== snappedX) {
          if (!this.moveDirection) {
            this.moveDirection = 'horizontal';
          }

          if (this.moveDirection === 'vertical') {
            this.link.addPoint(
              this.link.generatePoint(last.x, last.y),
              1,
            );
          }
        } else if (last.y !== snappedY) {
          if (!this.moveDirection) {
            this.moveDirection = 'vertical';
          }

          if (this.moveDirection === 'horizontal') {
            this.link.addPoint(
              this.link.generatePoint(last.x, last.y),
              1,
            );
          }
        }
      } else if (this.link.getPoints().length === 3) {
        const middle = this.link.getPoints()[1];
        const middlePosition = middle.getPosition();

        if (
          middlePosition.x === last.x &&
          middlePosition.y === last.y
        ) {
          this.link.removePoint(middle);
        } else if (this.moveDirection === 'horizontal') {
          if (last.x !== snappedX) {
            middle.setPosition(snappedX, first.y);
          }
        } else if (this.moveDirection === 'vertical') {
          if (last.y !== snappedY) {
            middle.setPosition(first.x, snappedY);
          }
        }
      }
    }

    if (first.x === last.x && first.y === last.y) {
      this.hasStartedMoving = true;
    }

    this.link.getLastPoint().setPosition(snappedX, snappedY);
    this.engine.repaintCanvas();
  }
}
