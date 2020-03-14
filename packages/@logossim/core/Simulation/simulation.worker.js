/* eslint-disable no-restricted-globals */
import deserialize from './deserialize';
import {
  getAllComponents,
  isInputValid,
  cleanDiff,
  getMeshInputValue,
} from './utils';

/**
 * This code runs the simulation workload on a Web Worker thread, to
 * avoid blocking the UI (main) thread.
 */
self.addEventListener('message', ({ data: { command, diagram } }) => {
  const setAllToStepReturn = () => {
    getAllComponents(self.circuit).forEach(component => {
      const input = component.ports.input.reduce(
        (obj, c) => ({ ...obj, [c.name]: c.value }),
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

      self.diff.components[component.id] = output;
    });

    self.circuit.meshes.forEach(mesh => {
      const meshValue = getMeshInputValue(
        mesh,
        self.circuit.components,
      );
      mesh.links.forEach(link => {
        self.diff.links[link] = meshValue;
      });
    });

    postMessage({ type: 'diff', diff: self.diff });
    self.diff = cleanDiff;
  };

  const clearAll = () => postMessage({ type: 'clear' });

  switch (command) {
    case 'start':
      if (diagram !== undefined) {
        self.circuit = deserialize(diagram);
        self.diff = cleanDiff;
      }

      getAllComponents().forEach(component =>
        component.onSimulationStart(),
      );

      setAllToStepReturn();
      self.workInterval = setInterval(setAllToStepReturn, 1000);
      break;
    case 'pause':
      getAllComponents().forEach(component =>
        component.onSimulationPause(),
      );
      clearInterval(self.workInterval);
      break;
    case 'stop':
      getAllComponents().forEach(component =>
        component.onSimulationStop(),
      );
      clearInterval(self.workInterval);
      setTimeout(() => {
        clearAll();
        self.circuit = null;
        self.diff = null;
      });
      break;
    default:
      break;
  }
});
