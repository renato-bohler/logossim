import {
  State,
  Action,
  InputType,
} from '@projectstorm/react-canvas-core';

import SelectionBoxState from './SelectionBoxState';

/**
 * This State handles nodes selection.
 */
export default class SelectingState extends State {
  constructor() {
    super({
      name: 'selecting',
    });
    this.keys = ['shift'];

    this.registerAction(
      new Action({
        type: InputType.MOUSE_DOWN,
        fire: event => {
          const element = this.engine
            .getActionEventBus()
            .getModelForEvent(event);

          // Go into a selection box on the canvas state
          if (!element) {
            this.transitionWithEvent(new SelectionBoxState(), event);
          } else {
            element.setSelected(true);
            this.engine.repaintCanvas();
          }
        },
      }),
    );
  }
}
