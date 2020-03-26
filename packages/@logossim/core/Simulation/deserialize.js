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

  setValues(values, type) {
    this.ports[type] = this.ports[type].map(port => {
      const previous = port.value;

      const current =
        values[port.name] !== undefined
          ? values[port.name]
          : previous;

      const risingEdge = previous === 0 && current === 1;
      const fallingEdge = previous === 1 && current === 0;

      return {
        ...port,
        value: current,
        meta: {
          previous,
          risingEdge,
          fallingEdge,
        },
      };
    });
  }

  setInputValues(values) {
    this.setValues(values, 'input');
  }

  setOutputValues(values) {
    this.setValues(values, 'output');
  }

  hasOutputChanged(values) {
    return !Object.keys(values).every(
      portName =>
        values[portName] ===
        this.ports.output.find(output => output.name === portName)
          .value,
    );
  }

  getProperties() {
    const customPropertyNames = Object.keys(this).filter(
      key =>
        !['id', 'initialize', 'configurations', 'ports'].includes(
          key,
        ),
    );

    return customPropertyNames
      .filter(property => typeof this[property] !== 'function')
      .reduce(
        (obj, property) => ({ ...obj, [property]: this[property] }),
        {},
      );
  }

  // Defaults
  onSimulationStart() {}

  onSimulationPause() {}

  onSimulationStop() {}

  step() {
    return {};
  }

  stepError() {
    return this.ports.output.reduce(
      (obj, port) => ({ ...obj, [port.name]: 'error' }),
      {},
    );
  }

  emit(value) {
    const event = new MessageEvent('message', {
      data: {
        command: 'emit',
        emitted: { from: this.id, value },
      },
    });

    // eslint-disable-next-line no-restricted-globals
    self.dispatchEvent(event);
  }

  // Diagram stubs
  addInputPort() {}

  addOutputPort() {}

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
