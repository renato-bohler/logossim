import { Action, InputType } from '@projectstorm/react-canvas-core';

import BaseModel from '../../BaseModel';

/**
 * Handles clipboard actions
 */
export default class ClipboardAction extends Action {
  constructor() {
    super({
      type: InputType.KEY_DOWN,
      fire: ({ event }) => {
        if (this.matchesInput(event)) {
          event.preventDefault();

          const { key } = event;
          if (key === 'x') this.handleCut();
          if (key === 'c') this.handleCopy();
          if (key === 'v') this.handlePaste();
        }
      },
    });
  }

  matchesInput = ({ ctrlKey, key }) =>
    ctrlKey && (key === 'x' || key === 'c' || key === 'v');

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

    this.engine.repaintCanvas();
  };
}
