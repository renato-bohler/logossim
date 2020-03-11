/**
 * SimulationWorker receives all components properties and methods
 * serialized. For that reason, we need to deserialize them before
 * executing the simulation thread.
 */

/* ---------------------------------------------------------------- */

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
  addPort() {}

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
    ...serialized,
    components: serialized.components.map(
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

export default deserialize;
