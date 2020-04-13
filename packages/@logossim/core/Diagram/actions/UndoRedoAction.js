import { Action, InputType } from '@projectstorm/react-canvas-core';

/**
 * Handles undo/redo actions.
 */
export default class UndoRedoAction extends Action {
  constructor(areShortcutsAllowed) {
    super({
      type: InputType.KEY_DOWN,
      fire: ({ event }) => {
        if (!areShortcutsAllowed()) return;
        if (this.engine.getModel().isLocked()) return;

        if (this.matchesInput(event)) {
          event.preventDefault();

          const { ctrlKey, shiftKey, code } = event;
          if (ctrlKey && !shiftKey && code === 'KeyZ')
            this.handleUndo();
          else this.handleRedo();
        }
      },
    });
  }

  matchesInput = ({ ctrlKey, shiftKey, code }) =>
    (ctrlKey && (code === 'KeyZ' || code === 'KeyY')) ||
    (ctrlKey && shiftKey && code === 'KeyZ');

  /** Undo */
  handleUndo = () => {
    this.engine.commands.undo();
    this.engine.repaintCanvas();
  };

  /** Redo */
  handleRedo = () => {
    this.engine.commands.redo();
    this.engine.repaintCanvas();
  };
}
