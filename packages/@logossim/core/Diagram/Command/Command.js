export default class Command {
  constructor(execute, undo) {
    this.execute = execute;
    this.undo = undo;
  }

  execute(engine) {
    this.execute(engine);
  }

  undo(engine) {
    this.undo(engine);
  }
}
