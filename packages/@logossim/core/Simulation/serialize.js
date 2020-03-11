/**
 * In order to execute the simulation workload on a Web Worker, we
 * need to serialize some component properties and methods to send
 * them to the worker.
 */

/* ---------------------------------------------------------------- */

/**
 * Receives a component instance and returns the name of all custom
 * properties.
 */
const getComponentPropertyNames = instance =>
  Object.keys(instance).filter(
    key =>
      ![
        'listeners',
        'options',
        'position',
        'ports',
        'width',
        'height',
        'configurations',
        'parent',
      ].includes(key),
  );

/**
 * Receives a component class and returns the name of all custom
 * methods.
 */
const getModelMethodNames = Class =>
  Object.getOwnPropertyNames(Class.prototype).filter(
    methodName => !['constructor'].includes(methodName),
  );

const serializeModels = components =>
  components.map(component => {
    const { type, Model } = component;

    return {
      type,
      methods: getModelMethodNames(Model).reduce(
        (obj, name) => ({
          ...obj,
          [name]: Model.prototype[name].toString(),
        }),
        {},
      ),
    };
  });

const serializePorts = ports =>
  Object.values(ports).map(port => ({
    id: port.getID(),
    name: port.getName(),
  }));

/**
 * Prepares a list of component instances to transfer, including
 * configuration and instance properties.
 */
const serializeComponents = components =>
  components.map(component => ({
    id: component.getID(),
    type: component.getType(),
    configurations: component.configurations,
    ports: serializePorts(component.ports),
    properties: getComponentPropertyNames(component).reduce(
      (obj, key) => ({ ...obj, [key]: component[key] }),
      {},
    ),
  }));

const serializeLinks = links =>
  links.map(link => ({
    id: link.getID(),
    source: link.getSourcePort()
      ? link.getSourcePort().getID()
      : null,
    target: link.getTargetPort()
      ? link.getTargetPort().getID()
      : null,
    bifurcations: link
      .getBifurcations()
      .map(bifurcation => bifurcation.getID()),
  }));

/**
 * Prepares the whole diagram to be transferred.
 */
const serialize = (diagram, models) => ({
  models: serializeModels(models),
  links: serializeLinks(Object.values(diagram.layers[0].models)),
  components: serializeComponents(
    Object.values(diagram.layers[1].models),
  ),
});

export default serialize;
