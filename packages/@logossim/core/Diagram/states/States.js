import {
  SelectingState,
  State,
  Action,
  InputType,
  DragCanvasState,
} from '@projectstorm/react-canvas-core';
import {
  PortModel,
  LinkModel,
  DragNewLinkState,
  DragDiagramItemsState,
} from '@projectstorm/react-diagrams-core';

import BifurcateLinkState from './BifurcateLinkState';

export default class States extends State {
  constructor(options) {
    super({
      name: 'default-diagrams',
    });

    const config = {
      allowLinksFromLockedPorts: false,
      allowLooseLinks: false,
      ...options,
    };

    this.childStates = [new SelectingState()];
    this.dragCanvas = new DragCanvasState();
    this.dragNewLink = new DragNewLinkState(config);
    this.bifurcateLink = new BifurcateLinkState(config);
    this.dragItems = new DragDiagramItemsState();

    // determine what was clicked on
    this.registerAction(
      new Action({
        type: InputType.MOUSE_DOWN,
        fire: event => {
          const element = this.engine
            .getActionEventBus()
            .getModelForEvent(event);

          // the canvas was clicked on, transition to the dragging canvas state
          if (!element) {
            this.transitionWithEvent(this.dragCanvas, event);
          }
          // initiate dragging a new link
          else if (element instanceof PortModel) {
            this.transitionWithEvent(this.dragNewLink, event);
          }
          // create a bifurcation
          else if (
            event.event.ctrlKey &&
            element instanceof LinkModel
          ) {
            if (event.event.ctrlKey) {
              this.transitionWithEvent(this.bifurcateLink, event);
            }
          }
          // move the items (and potentially link points)
          else {
            this.transitionWithEvent(this.dragItems, event);
          }
        },
      }),
    );
  }
}
