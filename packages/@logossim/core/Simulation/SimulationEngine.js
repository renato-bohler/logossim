import SimulationWorker from './simulation.worker';
import serialize from './serialize';
import { cleanDiff } from './utils';

/**
 * SimulationEngine encapsulates SimulationWorker to act as an
 * interface to the application. It handles messaging with the worker,
 * keeping track of the `diff` being generated so the application can
 * use it to update itself.
 */
export default class SimulationEngine {
  constructor(components) {
    this.components = components;
    this.callback = () => {};
    this.reset();
  }

  reset() {
    this.worker = new SimulationWorker();
    this.worker.addEventListener('message', this.onSimulationMessage);
    this.state = 'stopped';
    this.clearDiff();
  }

  onSimulationMessage = ({ data: { type, diff } }) => {
    if (type === 'diff') {
      this.appendDiff(diff);
    }
  };

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

  getDiff() {
    return this.diff;
  }

  clearDiff() {
    this.diff = cleanDiff;
  }

  appendDiff(diff) {
    this.diff = {
      components: { ...this.diff.components, ...diff.components },
      links: { ...this.diff.links, ...diff.links },
    };
  }
}