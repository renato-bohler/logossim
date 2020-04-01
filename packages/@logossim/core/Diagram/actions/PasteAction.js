import { Action, InputType } from '@projectstorm/react-canvas-core';

/**
 * Paste all clipboard items
 */
export default class PasteAction extends Action {
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

  matchesInput = event => event.ctrlKey && event.key === 'v';

  handleAction = () => {
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
