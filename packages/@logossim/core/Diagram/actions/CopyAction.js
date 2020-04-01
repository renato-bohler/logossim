import { Action, InputType } from '@projectstorm/react-canvas-core';

import BaseModel from '../../BaseModel';

/**
 * Copies all selected items
 */
export default class CopyAction extends Action {
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

  matchesInput = event => event.ctrlKey && event.key === 'c';

  handleAction = () => {
    const model = this.engine.getModel();

    const copies = model
      .getSelectedEntities()
      .filter(entity => entity instanceof BaseModel)
      .filter(entity => !entity.isLocked())
      .map(entity => entity.clone().serialize());

    localStorage.setItem('clipboard', JSON.stringify(copies));
  };
}
