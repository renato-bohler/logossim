import { Action, InputType } from '@projectstorm/react-canvas-core';

import BaseModel from '../../BaseModel';
import LinkModel from '../../Link/LinkModel';

/**
 * Handles delete actions.
 */
export default class DeleteAction extends Action {
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

  matchesInput = event => event.code === 'Delete';

  handleAction = () => {
    const entities = this.engine
      .getModel()
      .getSelectedEntities()
      .filter(model => !model.isLocked());

    this.fireEvent(entities);

    entities.forEach(model => model.remove());

    this.engine.repaintCanvas();
  };

  /**
   * Event is fired to be on the command manager, so the user can undo
   * and redo it.
   */
  fireEvent = entities => {
    // All selected nodes
    const nodes = entities.filter(
      model => model instanceof BaseModel,
    );

    // All selected links
    const links = entities.filter(
      model => model instanceof LinkModel,
    );

    // All links from selected nodes
    const nodesLinks = nodes.reduce(
      (arr, node) => [...arr, ...node.getAllLinks()],
      [],
    );

    this.engine.fireEvent(
      { nodes, links: [...nodesLinks, ...links] },
      'entitiesRemoved',
    );
  };
}
