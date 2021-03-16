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
    input: port.isInput(),
    bits: port.getBits(),
    defaultFloatingValue: port.getDefaultFloatingValue(),
    defaultErrorValue: port.getDefaultErrorValue(),
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

const getPortInfo = port =>
  port
    ? {
        componentId: port.getParent().getID(),
        name: port.getName(),
        input: port.isInput(),
      }
    : null;

const getLinkId = link => (link ? link.getID() : null);

const serializeLinks = links =>
  links.map(link => ({
    id: link.getID(),
    source: getPortInfo(link.getSourcePort()),
    target: getPortInfo(link.getTargetPort()),
    bifurcations: link
      .getBifurcations()
      .map(bifurcation => bifurcation.getID()),
    bifurcation: {
      source: getLinkId(link.getBifurcationSource()),
      target: getLinkId(link.getBifurcationTarget()),
    },
    isBifurcation: link.isBifurcation(),
    bits: link.getBits(),
  }));

/**
 * Prepares the whole diagram to be transferred.
 */
const serialize = (diagram, models) => ({
  models: serializeModels(models),
  links: serializeLinks(
    Object.values(diagram.getActiveLinkLayer().getModels()),
  ),
  components: serializeComponents(
    Object.values(diagram.getActiveNodeLayer().getModels()),
  ),
});

export default serialize;
