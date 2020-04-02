import { Action, InputType } from '@projectstorm/react-canvas-core';

/**
 * Handles delete actions
 */
export default class DeleteAction extends Action {
  constructor() {
    super({
      type: InputType.KEY_DOWN,
      fire: ({ event }) => {
        if (this.matchesInput(event)) {
          event.preventDefault();
          this.handleAction();
        }
      },
    });
  }

  matchesInput = event => event.key === 'Delete';

  handleAction = () => {
    this.engine
      .getModel()
      .getSelectedEntities()
      .filter(model => !model.isLocked())
      .forEach(model => model.remove());
    this.engine.repaintCanvas();
  };
}
