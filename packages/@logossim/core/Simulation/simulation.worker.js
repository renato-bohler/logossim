/* eslint-disable no-restricted-globals */
import deserialize from './deserialize';
import { getAllComponents, cleanDiff } from './utils';

/**
 * This code runs the simulation workload on a Web Worker thread, to
 * avoid blocking the UI (main) thread.
 */
self.addEventListener('message', ({ data: { command, diagram } }) => {
  const setAllToStepReturn = () => {
    getAllComponents(self.circuit).forEach(component => {
      const result = component.step(
        component.ports.reduce(
          (obj, c) => ({ ...obj, [c.name]: c.value }),
          {},
        ),
      );

      if (!result) return;

      component.setPortValues(result);

      self.diff.components[component.id] = result;
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
      self.workInterval = setInterval(setAllToStepReturn);
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
