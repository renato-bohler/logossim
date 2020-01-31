import {
  State,
  Action,
  InputType,
  DragCanvasState,
} from '@projectstorm/react-canvas-core';
import {
  PortModel,
  LinkModel,
} from '@projectstorm/react-diagrams-core';

import BifurcateLinkState from './BifurcateLinkState';
import DragNewLinkState from './DragNewLinkState';
import MoveItemsState from './MoveItemsState';
import SelectingState from './SelectingState';

export default class States extends State {
  constructor() {
    super({
      name: 'diagram-states',
    });

    this.childStates = [new SelectingState()];
    this.dragCanvas = new DragCanvasState();
    this.dragNewLink = new DragNewLinkState();
    this.bifurcateLink = new BifurcateLinkState();
    this.dragItems = new MoveItemsState();

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
          else if (element instanceof LinkModel) {
            this.transitionWithEvent(this.bifurcateLink, event);
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
