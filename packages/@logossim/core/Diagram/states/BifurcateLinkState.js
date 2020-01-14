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
      allowLooseLinks: false,
      allowLinksFromLockedPorts: false,
      ...options,
    };

    // console.log('Create bifurcation');
    // console.log(
    //   'Link points position:',
    //   element.points.map(p => p.position),
    // );
    // console.log(
    //   'At relative mouse point:',
    //   this.engine.getRelativeMousePoint(event.event),
    // );

    this.registerAction(
      new Action({
        type: InputType.MOUSE_DOWN,
        fire: event => {
          const position = this.engine.getRelativeMousePoint(
            event.event,
          );

          console.log('[BifurcateLinkState] MOUSE_DOWN');

          this.sourceLink = this.engine.getMouseElement(event.event);
          console.log('this.sourceLink:', this.sourceLink);

          if (
            !this.config.allowLinksFromLockedPorts &&
            this.sourceLink.isLocked()
          ) {
            this.eject();
            return;
          }

          this.newLink = this.engine
            .getLinkFactories()
            .getFactory(this.sourceLink.getType())
            .generateModel();
          this.newLink.point(position.x, position.y, 1);
          this.newLink.point(position.x, position.y, 2);

          if (!this.newLink) {
            this.eject();
            return;
          }

          this.newLink.setSelected(true);
          // this.newLink.setBifucrationSource(this.sourceLink);
          this.sourceLink.addBifurcation(this.newLink);
          // this.engine.getModel().addLink(this.link);
          // this.port.reportPosition();
        },
      }),
    );

    this.registerAction(
      new Action({
        type: InputType.MOUSE_UP,
        fire: event => {
          const model = this.engine.getMouseElement(event.event);

          console.log('[BifurcateLinkState] MOUSE_UP');

          // // check to see if we connected to a new port
          // if (model instanceof PortModel) {
          //   if (this.port.canLinkToPort(model)) {
          //     this.link.setTargetPort(model);
          //     model.reportPosition();
          //     this.engine.repaintCanvas();
          //     return;
          //   }
          // }

          // if (
          //   this.isNearbySourcePort(event.event) ||
          //   !this.config.allowLooseLinks
          // ) {
          //   this.link.remove();
          //   this.engine.repaintCanvas();
          // }
        },
      }),
    );
  }

  /**
   * Checks whether the mouse event appears to happen in proximity of the link's source port
   * @param event
   */
  isNearbySourcePort({ clientX, clientY }) {
    const sourcePort = this.newLink.getSourcePort();
    const sourcePortPosition = this.newLink
      .getSourcePort()
      .getPosition();

    return (
      clientX >= sourcePortPosition.x &&
      clientX <= sourcePortPosition.x + sourcePort.width &&
      clientY >= sourcePortPosition.y &&
      clientY <= sourcePortPosition.y + sourcePort.height
    );
  }

  /**
   * Calculates the link's far-end point position on mouse move.
   * In order to be as precise as possible the mouse initialXRelative & initialYRelative are taken into account as well
   * as the possible engine offset
   */
  fireMouseMoved(event) {
    const portPos = this.newLink.getFirstPoint();
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

    this.newLink.getLastPoint().setPosition(linkNextX, linkNextY);
    this.engine.repaintCanvas();
  }
}
