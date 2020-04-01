import { Action, InputType } from '@projectstorm/react-canvas-core';

/**
 * Deletes all selected items
 */
export default class DeleteAction extends Action {
  constructor() {
    super({
      type: InputType.KEY_DOWN,
      fire: ({ event }) => {
        if (this.matchesInput(event)) {
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
