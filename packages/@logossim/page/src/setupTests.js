/* eslint-disable max-classes-per-file */
import '@testing-library/jest-dom/extend-expect';
import '@logossim/core/common/prototype';

// Mocks `worker-loader`
jest.mock('../../core/Simulation/simulation.worker.js', () => ({
  __esModule: true,
  default: class SimulationWorker {
    postMessage() {}
  },
}));

jest.mock('@logossim/core', () => ({
  ...jest.requireActual('@logossim/core'),
  SimulationEngine: class SimulationEngine {
    addCallback() {}

    removeCallback() {}

    start() {}

    pause() {}

    stop() {}

    getState() {}

    isRunning() {}

    isPaused() {}

    isStopped() {}
  },
}));

// Mocks createRange (for react-joyride)
document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});

global.addPort = function addPort(portName, { bits } = {}) {
  this.ports[portName] = { bits: bits || 1 };
};
