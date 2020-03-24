/**
 * This code runs the simulation workload on a Web Worker thread, to
 * avoid blocking the UI (main) thread.
 *
 * Whenever a component executes `emit`, its changes are pushed to
 * `emitQueue`, which will be handled by the `executeNextEmitted`
 * function.
 *
 * Every component that is affected by this emitted event is pushed to
 * the `stepQueue`, which will be handled recursively by the
 * `executeNextStep` function.
 */

/* ---------------------------------------------------------------- */

/* eslint-disable no-restricted-globals */
/* eslint-disable no-use-before-define */
import deserialize from './deserialize';
import {
  getCleanDiff,
  appendComponentDiff,
  initializeDiffAndValues,
  isInputValid,
  getComponent,
  getAffectedMeshes,
  getMeshInputValue,
  getMeshOutputComponents,
} from './utils';

/**
 * Worker states
 */
self.circuit = null; // circuit information
self.diff = null; // diff to send back to the app
self.emitQueue = []; // emitted changes that are pending
self.stepQueue = []; // components that are pending propagation
self.workInterval = null; // main execution interval

/**
 * Worker message handling
 */
self.addEventListener(
  'message',
  ({ data: { command, diagram, emitted } }) => {
    switch (command) {
      /**
       * START
       */
      case 'start':
        if (diagram !== undefined) {
          self.circuit = deserialize(diagram);
          self.diff = getCleanDiff();
          initializeDiffAndValues();
        }

        self.circuit.components.forEach(component =>
          component.onSimulationStart(),
        );

        // Main workload
        executeNextEmitted();
        self.workInterval = setInterval(executeNextEmitted);
        break;

      /**
       * PAUSE
       */
      case 'pause':
        self.circuit.components.forEach(component =>
          component.onSimulationPause(),
        );
        clearInterval(self.workInterval);
        break;

      /**
       * STOP
       */
      case 'stop':
        self.circuit.components.forEach(component =>
          component.onSimulationStop(),
        );
        clearInterval(self.workInterval);
        setTimeout(() => {
          postMessage({ type: 'clear' });
          self.circuit = null;
          self.diff = null;
          self.emitQueue = [];
          self.stepQueue = [];
        });
        break;

      /**
       * EMIT
       */
      case 'emit':
        if (self.circuit) self.emitQueue.push(emitted);
        break;

      default:
        break;
    }
  },
);

/**
 * Handles the next emitted event on the emit queue and propagates it.
 */
const executeNextEmitted = (first = true) => {
  console.trace();
  console.timeEnd();
  console.time();
  if (!self.circuit) return;

  const emitted = self.emitQueue.shift();
  if (!emitted) return;

  const emitter = getComponent(emitted.from);
  emitter.setOutputValues(emitted.value);

  appendComponentDiff(emitter, emitted.value);
  propagate(emitted);
  executeNextStep();

  executeNextEmitted(false);

  if (first) {
    postMessage({ type: 'diff', diff: self.diff });
    self.diff = getCleanDiff();
  }
};

/**
 * Executes a step on the next component affected by the emitted
 * change that is being currently handled. Propagates this component's
 * change forward.
 */
const executeNextStep = () => {
  const component = self.stepQueue.shift();
  if (!component) return;

  const input = component.ports.input.reduce(
    (obj, port) => ({ ...obj, [port.name]: port.value }),
    {},
  );

  const meta = component.ports.input.reduce(
    (obj, port) => ({ ...obj, [port.name]: port.meta }),
    {},
  );

  let result = {};
  if (isInputValid(input)) {
    result = component.step(input, meta);
  } else {
    result = component.stepError(input, meta);
  }

  if (!result) return;

  const output = Object.fromEntries(
    Object.entries(result).filter(([name]) =>
      component.ports.output.find(o => o.name === name),
    ),
  );

  if (component.hasOutputChanged(output)) {
    component.setOutputValues(output);
    appendComponentDiff(component, output);
    propagate({ from: component.id, value: output });
  }

  executeNextStep();
};

/**
 * Propagates a change on a component to all components connected to
 * its output.
 */
const propagate = emitted => {
  const affectedMeshes = getAffectedMeshes(emitted);
  affectedMeshes.forEach(mesh => {
    const meshValue = getMeshInputValue(mesh);
    mesh.links.forEach(link => {
      self.diff.links[link] = meshValue;
    });

    const connectedComponents = getMeshOutputComponents(mesh);
    connectedComponents.forEach(component => {
      const portsConnectedToMesh = mesh.outputs
        .filter(meshOutput => meshOutput.componentId === component.id)
        .map(meshOutput => meshOutput.name);

      const portsWithNewValue = portsConnectedToMesh.reduce(
        (obj, portName) => ({ ...obj, [portName]: meshValue }),
        {},
      );

      component.setInputValues(portsWithNewValue);

      appendComponentDiff(component, portsWithNewValue);

      self.stepQueue.push(component);
    });
  });
};
