/* eslint-disable max-classes-per-file */
import { DEFAULT_PORT_CONFIGURATION } from '@logossim/core/Simulation/const';
import '@testing-library/jest-dom/extend-expect';

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

// react-diagrams engine stub
global.engine = {
  registerListener: () => {},
  getCanvas: () => {},
  getPortCoords: () => ({
    getWidth: () => {},
    getHeight: () => {},
    getTopLeft: () => {},
  }),
  getModel: () => ({ isLocked: () => false }),
};

global.addPort = function addPort(
  portName,
  { bits = 1 } = DEFAULT_PORT_CONFIGURATION,
) {
  this.ports[portName] = { bits };
};
