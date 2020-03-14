/**
 * SimulationWorker receives all components properties and methods
 * serialized. For that reason, we need to deserialize them before
 * executing the simulation thread.
 */

/* ---------------------------------------------------------------- */
import findMeshes from './mesh';

/**
 * This class represents a generic component. It receives deserialized
 * properties and methods in its constructor and it's used to handle
 * simulation logic.
 */
export class GenericComponent {
  constructor(properties, methods) {
    Object.entries(properties).forEach(([key, value]) => {
      this[key] = value;
    });

    Object.entries(methods).forEach(([name, method]) => {
      this[name] = method.bind(this);
    });

    this.initialize(properties.configurations);
  }

  getInputPort(name) {
    return this.ports.input.find(port => port.name === name);
  }

  getOutputPort(name) {
    return this.ports.output.find(port => port.name === name);
  }

  setInputValues(values) {
    this.ports.input = this.ports.input.map(port => ({
      ...port,
      value:
        values[port.name] !== undefined
          ? values[port.name]
          : port.value,
    }));
  }

  setOutputValues(values) {
    this.ports.output = this.ports.output.map(port => ({
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

  step() {
    return {};
  }

  stepError() {
    return this.ports.reduce(
      (obj, port) => ({ ...obj, [port.name]: 'error' }),
      {},
    );
  }

  // Diagram stubs
  addInPort() {}

  addOutPort() {}

  removePort() {}
}

/**
 * Converts string representing functions to actual functions in given
 * model.
 */
const deserializeMethod = model =>
  Object.fromEntries(
    Object.entries(model.methods).map(([key, stringFn]) => [
      key,
      // eslint-disable-next-line no-new-func
      new Function(
        `return ${
          /**
           * We need to add the `function` token when on development
           * environment.
           */
          process.env.NODE_ENV === 'development' ? 'function ' : ''
        }${stringFn}`,
      )(),
    ]),
  );

const deserializeModels = models =>
  models
    .map(model => ({
      ...model,
      methods: deserializeMethod(model),
    }))
    .reduce(
      (obj, model) => ({
        ...obj,
        [model.type]: model.methods,
      }),
      {},
    );

/**
 * Deserialize a given diagram (serialized), generating
 * `GenericComponent` instances with its given methods and properties.
 */
const deserialize = serialized => {
  const models = deserializeModels(serialized.models);

  return {
    components: serialized.components.map(
      component =>
        new GenericComponent(
          {
            ...component.properties,
            id: component.id,
            configurations: component.configurations,
            ports: {
              input: component.ports
                .filter(port => port.input)
                .map(port => ({
                  ...port,
                  value: 0,
                })),
              output: component.ports
                .filter(port => !port.input)
                .map(port => ({
                  ...port,
                  value: 0,
                })),
            },
          },
          models[component.type],
        ),
    ),
    meshes: findMeshes(serialized.links),
  };
};

export default deserialize;
