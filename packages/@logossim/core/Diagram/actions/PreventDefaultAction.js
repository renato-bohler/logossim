import { Action, InputType } from '@projectstorm/react-canvas-core';

/**
 * Prevents default key down
 */
export default class PreventDefaultAction extends Action {
  constructor() {
    super({
      type: InputType.KEY_DOWN,
      fire: ({ event }) => {
        event.preventDefault();
        event.stopPropagation();
      },
    });
  }
}
