import '@testing-library/jest-dom/extend-expect';

jest.mock('@logossim/core', () => ({
  ...jest.requireActual('@logossim/core'),
  SimulationEngine: class SimulationEngine {
    addCallback() {}

    removeCallback() {}

    start() {}

    pause() {}

    stop() {}

    getState() {}
  },
}));
