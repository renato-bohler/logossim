/* eslint-disable no-restricted-globals */
import deserialize from './deserialize';
import { getCleanDiff, isInputValid } from './utils';

/**
 * This code runs the simulation workload on a Web Worker thread, to
 * avoid blocking the UI (main) thread.
 */

let circuit = null;
let diff = null;
let workInterval = null;
let emitQueue = [];
let stepQueue = [];

const getAllComponents = () => {
  if (!circuit) return [];

  return circuit.components;
};

const getComponent = id => {
  if (!circuit) return null;

  return (
    circuit.components.find(component => component.id === id) || null
  );
};

const getAffectedMeshes = emitted =>
  circuit.meshes.filter(mesh =>
    mesh.inputs.some(
      meshInput =>
        emitted.from === meshInput.componentId &&
        Object.keys(emitted.value).includes(meshInput.name),
    ),
  );

const getMeshOutputComponents = mesh =>
  [
    ...new Set(
      mesh.outputs.map(meshOutput => meshOutput.componentId),
    ),
  ].map(componentId => getComponent(componentId));

const getMeshInputValue = mesh => {
  const allInputValues = mesh.inputs
    .map(portInfo => {
      const component = circuit.components.find(
        c => c.id === portInfo.componentId,
      );

      // Port's output is the mesh's input
      const port = component.getOutputPort(portInfo.name);

      return port ? port.value : null;
    })
    .filter(value => value !== null);

  // A mesh input is coherent if all of its inputs has the same value
  const isCoherent = allInputValues.every(
    (value, i, values) => value === values[0],
  );

  return isCoherent ? allInputValues[0] : 'error';
};

// TODO: give this a better name
const doStep = () => {
  const component = stepQueue.shift();
  if (!component) return;

  const input = component.ports.input.reduce(
    (obj, port) => ({ ...obj, [port.name]: port.value }),
    {},
  );

  let result = {};
  if (isInputValid(input)) {
    result = component.step(input);
  } else {
    result = component.stepError(input);
  }

  if (!result) return;

  const output = Object.fromEntries(
    Object.entries(result).filter(([name]) =>
      component.ports.output.find(o => o.name === name),
    ),
  );

  component.setOutputValues(output);
  diff.components[component.id] = output;

  /**
   * TODO: propagate component output to mesh input
   *
   * It feels like a lot of code could be reused between emitted
   * events handling and collateral effects propagation.
   */
  doStep();
};

// TODO: give this a better name
const next = () => {
  if (!circuit) return;

  const emitted = emitQueue.shift();
  if (!emitted) return;

  const emitter = getComponent(emitted.from);
  emitter.setOutputValues(emitted.value);
  diff.components[emitter.id] = emitted.value;

  const affectedMeshes = getAffectedMeshes(emitted);
  affectedMeshes.forEach(mesh => {
    const meshValue = getMeshInputValue(mesh);
    mesh.links.forEach(link => {
      diff.links[link] = meshValue;
    });

    const connectedComponents = getMeshOutputComponents(mesh);
    connectedComponents.forEach(component => {
      const portsConnectedToMesh = mesh.outputs
        .filter(meshOutput => meshOutput.componentId === component.id)
        .map(meshOutput => meshOutput.name);

      const portsWithNewValue = portsConnectedToMesh.reduce(
        (obj, portName) => ({ [portName]: meshValue }),
        {},
      );

      component.setInputValues(portsWithNewValue);
      diff.components[component.id] = portsWithNewValue;
      stepQueue.push(component);
    });

    doStep();
  });

  postMessage({ type: 'diff', diff });
  diff = getCleanDiff();
};

self.addEventListener(
  'message',
  ({ data: { command, diagram, emitted } }) => {
    switch (command) {
      case 'start':
        if (diagram !== undefined) {
          circuit = deserialize(diagram);
          diff = getCleanDiff();
        }

        getAllComponents(circuit).forEach(component =>
          component.onSimulationStart(),
        );

        next();
        workInterval = setInterval(next);
        break;
      case 'pause':
        getAllComponents(circuit).forEach(component =>
          component.onSimulationPause(),
        );
        clearInterval(workInterval);
        break;
      case 'stop':
        getAllComponents(circuit).forEach(component =>
          component.onSimulationStop(),
        );
        clearInterval(workInterval);
        setTimeout(() => {
          postMessage({ type: 'clear' });
          circuit = null;
          diff = null;
          emitQueue = [];
          stepQueue = [];
        });
        break;
      case 'emit':
        if (circuit) emitQueue.push(emitted);
        break;
      default:
        break;
    }
  },
);
