import { Action, InputType } from '@projectstorm/react-canvas-core';

import BaseModel from '../../BaseModel';

/**
 * Clones all selected items
 */
export default class CloneAction extends Action {
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

  matchesInput = event => event.ctrlKey && event.key === 'd';

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

    this.engine.repaintCanvas();
  };
}
