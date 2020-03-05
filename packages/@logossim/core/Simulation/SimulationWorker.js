export default class SimulationWorker {
  constructor() {
    this.reset();
  }

  reset() {
    const code = this.thread.toString();
    const blob = new Blob([`(${code})()`]);

    this.worker = new Worker(URL.createObjectURL(blob));
    this.runState = 'stopped';
  }

  addCallback(callback) {
    return this.worker.addEventListener('message', callback);
  }

  removeCallback(callback) {
    return this.worker.removeEventListener('message', callback);
  }

  start(circuit) {
    this.worker.postMessage({ command: 'start', initial: circuit });
    this.runState = 'started';
  }

  pause() {
    this.worker.postMessage({ command: 'pause' });
    this.runState = 'paused';
  }

  stop() {
    this.worker.postMessage({ command: 'stop' });
    this.runState = 'stopped';
  }

  getRunState() {
    return this.runState;
  }

  /**
   * This code runs on the Web Worker thread, so simulation workload
   * runs on another thread, in order to avoid blocking the UI (main)
   * thread.
   */
  /* eslint-disable no-restricted-globals */
  thread = () => {
    self.addEventListener(
      'message',
      ({ data: { command, initial } }) => {
        const doWork = () => {
          self.state += 1;
        };

        const doUpdate = () =>
          self.requestAnimationFrame(() => postMessage(self.state));

        switch (command) {
          case 'start':
            if (initial !== undefined) {
              self.state = initial;
            }

            self.workInterval = setInterval(doWork);
            self.updateInterval = setInterval(doUpdate);
            break;
          case 'pause':
          case 'stop':
            if (command === 'stop') {
              self.state = 0;
            }

            clearInterval(self.workInterval);
            clearInterval(self.updateInterval);

            postMessage(self.state);
            break;
          default:
            break;
        }
      },
    );
  };
}
