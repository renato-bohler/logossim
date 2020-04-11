import { Action, InputType } from '@projectstorm/react-canvas-core';

import BaseModel from '../../BaseModel';

/**
 * Handles clipboard actions.
 */
export default class ClipboardAction extends Action {
  constructor(areShortcutsAllowed) {
    super({
      type: InputType.KEY_DOWN,
      fire: ({ event }) => {
        if (!areShortcutsAllowed()) return;
        if (this.engine.getModel().isLocked()) return;

        if (this.matchesInput(event)) {
          event.preventDefault();

          const { code } = event;
          if (code === 'KeyX') this.handleCut();
          if (code === 'KeyC') this.handleCopy();
          if (code === 'KeyV') this.handlePaste();
        }
      },
    });
  }

  matchesInput = ({ ctrlKey, code }) =>
    ctrlKey &&
    (code === 'KeyX' || code === 'KeyC' || code === 'KeyV');

  getSelectedComponents = () =>
    this.engine
      .getModel()
      .getSelectedEntities()
      .filter(entity => entity instanceof BaseModel)
      .filter(entity => !entity.isLocked());

  /** Cut */
  handleCut = () => {
    const selected = this.getSelectedComponents();
    const copies = selected.map(entity => entity.clone().serialize());

    this.engine.fireEvent(
      {
        nodes: selected,
        links: selected.reduce(
          (arr, node) => [...arr, ...node.getAllLinks()],
          [],
        ),
      },
      'entitiesRemoved',
    );
    selected.forEach(node => node.remove());
    this.engine.repaintCanvas();

    localStorage.setItem('clipboard', JSON.stringify(copies));
  };

  /** Copy */
  handleCopy = () => {
    const copies = this.getSelectedComponents().map(entity =>
      entity.clone().serialize(),
    );

    localStorage.setItem('clipboard', JSON.stringify(copies));
  };

  /** Paste */
  handlePaste = () => {
    const model = this.engine.getModel();

    const clipboard = JSON.parse(localStorage.getItem('clipboard'));
    if (!clipboard) return;

    model.clearSelection();

    const models = clipboard.map(serialized => {
      const modelInstance = model
        .getActiveNodeLayer()
        .getChildModelFactoryBank(this.engine)
        .getFactory(serialized.type)
        .generateModel({ initialConfig: serialized });

      modelInstance.deserialize({
        engine: this.engine,
        data: serialized,
        registerModel: () => {},
      });

      return modelInstance;
    });

    models.forEach(modelInstance => {
      model.addNode(modelInstance);
      modelInstance.setSelected(true);
    });

    localStorage.setItem(
      'clipboard',
      JSON.stringify(
        models.map(modelInstance =>
          modelInstance.clone().serialize(),
        ),
      ),
    );

    this.engine.fireEvent({ nodes: models }, 'componentsAdded');

    this.engine.repaintCanvas();
  };
}
