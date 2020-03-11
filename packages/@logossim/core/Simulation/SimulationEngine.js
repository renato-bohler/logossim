import SimulationWorker from './simulation.worker';
import serialize from './serialize';

export default class SimulationEngine {
  constructor(components) {
    this.components = components;
    this.reset();
  }

  reset() {
    this.worker = new SimulationWorker();
    this.state = 'stopped';
  }

  addCallback(callback) {
    return this.worker.addEventListener('message', callback);
  }

  removeCallback(callback) {
    return this.worker.removeEventListener('message', callback);
  }

  start(diagram) {
    this.worker.postMessage({
      command: 'start',
      diagram: serialize(diagram, this.components),
    });
    this.state = 'started';
  }

  pause() {
    this.worker.postMessage({ command: 'pause' });
    this.state = 'paused';
  }

  async stop() {
    return new Promise(resolve => {
      const waitForEnd = ({ data: { type } }) => {
        if (type === 'clear') {
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
}
