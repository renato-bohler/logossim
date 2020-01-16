import { Point } from '@projectstorm/geometry';
import {
  AbstractDisplacementState,
  Action,
  InputType,
} from '@projectstorm/react-canvas-core';
import { PortModel } from '@projectstorm/react-diagrams-core';

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
          const position = this.engine.getRelativeMousePoint(
            event.event,
          );

          const snappedPosition = new Point(
            Math.round(position.x / 15) * 15,
            Math.round(position.y / 15) * 15,
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

          this.bifurcation.setAsBifurcation();
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

  isNearbySourcePosition({ clientX, clientY }) {
    const sourcePosition = this.bifurcation
      .getFirstPoint()
      .getPosition();

    return (
      clientX >= sourcePosition.x - 3 &&
      clientX <= sourcePosition.x + 3 &&
      clientY >= sourcePosition.y - 3 &&
      clientY <= sourcePosition.y + 3
    );
  }

  fireMouseMoved(event) {
    const portPos = this.bifurcation.getFirstPoint().getPosition();

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

    this.bifurcation.getLastPoint().setPosition(snappedX, snappedY);
    this.engine.repaintCanvas();
  }
}
