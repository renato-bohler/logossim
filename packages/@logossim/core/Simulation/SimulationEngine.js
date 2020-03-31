import serialize from './serialize';
import SimulationWorker from './simulation.worker';
import { getCleanDiff } from './utils';

const worker = new SimulationWorker();

/**
 * SimulationEngine encapsulates SimulationWorker to act as an
 * interface to the application. It handles messaging with the worker,
 * keeping track of the `diff` being generated so the application can
 * use it to update itself.
 */
export default class SimulationEngine {
  constructor(components) {
    this.components = components;

    this.worker = worker;
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
      diagram:
        this.state === 'stopped'
          ? serialize(diagram, this.components)
          : undefined,
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

  isRunning() {
    return this.state === 'started';
  }

  isPaused() {
    return this.state === 'paused';
  }

  isStopped() {
    return this.state === 'stopped';
  }

  getDiff() {
    return this.diff;
  }

  clearDiff() {
    this.diff = getCleanDiff();
  }

  appendDiff(diff) {
    this.diff = {
      components: { ...this.diff.components, ...diff.components },
      links: { ...this.diff.links, ...diff.links },
    };
  }
}

/**
 * Emit is exported as a separate function so it can be used on
 * `BaseModel`.
 */
export const emit = (from, value) =>
  worker.postMessage({
    command: 'emit',
    emitted: { from, value },
  });
