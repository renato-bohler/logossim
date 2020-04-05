import Command from './Command';

/**
 * This class manages the undo/redo stack.
 */
export default class CommandManager {
  constructor() {
    this.clear();
  }

  clear() {
    this.stack = [];
    this.index = 0;
  }

  add({ execute, undo }) {
    const command = new Command(execute, undo);
    this.stack.length = this.index;
    this.stack.push(command);
    this.index += 1;
  }

  undo() {
    if (this.index > 0) {
      this.index -= 1;
      const command = this.stack[this.index];
      command.undo();
    }
  }

  redo() {
    if (this.index < this.stack.length) {
      const command = this.stack[this.index];
      command.execute();
      this.index += 1;
    }
  }
}
