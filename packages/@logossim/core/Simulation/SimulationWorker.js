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

  thread = () => {
    this.addEventListener(
      'message',
      ({ data: { command, initial } }) => {
        switch (command) {
          case 'start':
            if (initial !== undefined) {
              this.state = initial;
            }

            this.workInterval = setInterval(() => {
              this.state += 1;
            });

            this.updateInterval = setInterval(
              () =>
                this.requestAnimationFrame(() =>
                  postMessage(this.state),
                ),
              1000,
            );
            break;
          case 'pause':
          case 'stop':
            if (command === 'stop') {
              this.state = 0;
            }
            if (this.workInterval) {
              clearInterval(this.workInterval);
            }
            if (this.updateInterval) {
              clearInterval(this.updateInterval);
            }
            postMessage(this.state);
            break;
          default:
            break;
        }
      },
    );
  };
}
