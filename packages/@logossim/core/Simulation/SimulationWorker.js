export default class SimulationWorker {
  constructor() {
    this.reset();
  }

  reset() {
    const code = this.thread.toString();
    const blob = new Blob([`(${code})()`]);

    this.worker = new Worker(URL.createObjectURL(blob));
    this.state = 'stopped';
  }

  addCallback(callback) {
    return this.worker.addEventListener('message', callback);
  }

  removeCallback(callback) {
    return this.worker.removeEventListener('message', callback);
  }

  start(initial) {
    this.worker.postMessage({ command: 'start', initial });
    this.state = 'started';
  }

  pause() {
    this.worker.postMessage({ command: 'pause' });
    this.state = 'paused';
  }

  async stop() {
    return new Promise(resolve => {
      const waitForEnd = ({ data }) => {
        if (Object.values(data).every(d => d === null)) {
          this.worker.removeEventListener('message', waitForEnd);
          this.state = 'stopped';
          resolve();
        }
      };
      this.worker.addEventListener('message', waitForEnd);

      this.worker.postMessage({ command: 'stop' });
    });
  }

  getState() {
    return this.state;
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
        const getAllLinks = () => {
          if (!self.circuit) return [];

          return Object.entries(self.circuit.layers[0].models);
        };

        const setAllToRandom = () =>
          postMessage(
            Object.fromEntries(
              getAllLinks().map(([id]) => [
                id,
                Math.random() < 0.5 ? 0 : 1,
              ]),
            ),
          );

        const clearAll = () =>
          postMessage(
            Object.fromEntries(
              getAllLinks().map(([id]) => [id, null]),
            ),
          );

        switch (command) {
          case 'start':
            if (initial !== undefined) {
              self.circuit = JSON.parse(initial);
            }

            self.workInterval = setInterval(setAllToRandom);
            break;
          case 'pause':
            clearInterval(self.workInterval);
            break;
          case 'stop':
            clearInterval(self.workInterval);
            setTimeout(() => {
              clearAll();
              self.circuit = null;
            });
            break;
          default:
            break;
        }
      },
    );
  };
}
