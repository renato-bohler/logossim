/* eslint-disable no-restricted-globals */

/**
 * This code runs the simulation workload on a Web Worker thread, to
 * avoid blocking the UI (main) thread.
 */
const worker = () => {
  // TODO: move to another file (2)
  class GenericComponent {
    constructor(properties, methods) {
      Object.entries(properties).forEach(([key, value]) => {
        this[key] = value;
      });

      Object.entries(methods).forEach(([name, method]) => {
        this[name] = method.bind(this);
      });

      this.initialize(properties.configurations);
    }

    setPortValues(values) {
      this.ports = this.ports.map(port => ({
        ...port,
        value:
          values[port.name] !== undefined
            ? values[port.name]
            : port.value,
      }));
    }

    // Defaults
    onSimulationStart() {}

    onSimulationPause() {}

    onSimulationStop() {}

    step() {}

    // Diagram stubs
    addPort() {}

    removePort() {}
  }

  // TODO: move to another file
  const createModelMethods = model =>
    Object.fromEntries(
      Object.entries(model.methods).map(([key, stringFn]) => [
        key,
        // eslint-disable-next-line no-new-func
        new Function(`return function ${stringFn}`)(),
      ]),
    );

  // TODO: move to another file
  const mountModels = diagram =>
    diagram.models
      .map(model => ({
        ...model,
        methods: createModelMethods(model),
      }))
      .reduce(
        (obj, model) => ({
          ...obj,
          [model.type]: model.methods,
        }),
        {},
      );

  // TODO: move to another file
  const mount = diagram => {
    const models = mountModels(diagram);

    return {
      ...diagram,
      components: diagram.components.map(
        component =>
          new GenericComponent(
            {
              ...component.properties,
              id: component.id,
              configurations: component.configurations,
              ports: component.ports.map(port => ({
                ...port,
                value: 0,
              })),
            },
            models[component.type],
          ),
      ),
    };
  };

  self.addEventListener(
    'message',
    ({ data: { command, diagram } }) => {
      // TODO: move to another file (2)
      const resetDiff = () => {
        self.diff = {
          components: {},
          links: {},
        };
      };

      // TODO: move to another file (2)
      const getAllComponents = () => {
        if (!self.circuit) return [];

        return self.circuit.components;
      };

      const setAllToStepReturn = () => {
        getAllComponents().forEach(component => {
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
        resetDiff();
      };

      const clearAll = () => postMessage({ type: 'clear' });

      switch (command) {
        case 'start':
          if (diagram !== undefined) {
            resetDiff();
            self.circuit = mount(diagram);
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
    },
  );
};

export default worker;
