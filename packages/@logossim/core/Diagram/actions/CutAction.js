import { Action, InputType } from '@projectstorm/react-canvas-core';

import BaseModel from '../../BaseModel';

/**
 * Cuts all selected items
 */
export default class CutAction extends Action {
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

  matchesInput = event => event.ctrlKey && event.key === 'x';

  handleAction = () => {
    const model = this.engine.getModel();

    const selected = model
      .getSelectedEntities()
      .filter(entity => entity instanceof BaseModel)
      .filter(entity => !entity.isLocked());

    const copies = selected.map(entity => entity.clone().serialize());

    selected.forEach(node => node.remove());

    this.engine.repaintCanvas();

    localStorage.setItem('clipboard', JSON.stringify(copies));
  };
}
