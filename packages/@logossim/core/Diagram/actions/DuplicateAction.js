import { Action, InputType } from '@projectstorm/react-canvas-core';

import BaseModel from '../../BaseModel';

/**
 * Handle duplication (clone) actions.
 */
export default class DuplicateAction extends Action {
  constructor(areShortcutsAllowed) {
    super({
      type: InputType.KEY_DOWN,
      fire: ({ event }) => {
        if (!areShortcutsAllowed()) return;
        if (this.engine.getModel().isLocked()) return;

        if (this.matchesInput(event)) {
          event.preventDefault();
          this.handleAction();
        }
      },
    });
  }

  matchesInput = event => event.ctrlKey && event.code === 'KeyD';

  handleAction = () => {
    const model = this.engine.getModel();

    const clones = model
      .getSelectedEntities()
      .filter(entity => entity instanceof BaseModel)
      .filter(entity => !entity.isLocked())
      .map(entity => entity.clone());

    model.clearSelection();

    clones.forEach(clone => {
      model.addNode(clone);
      clone.setSelected(true);
    });

    this.engine.fireEvent({ nodes: clones }, 'componentsAdded');

    this.engine.repaintCanvas();
  };
}
