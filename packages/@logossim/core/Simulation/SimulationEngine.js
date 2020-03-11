import SimulationWorker from './simulation.worker';

export default class SimulationEngine {
  constructor(components) {
    this.models = this.setupModels(components);
    this.reset();
  }

  reset() {
    this.worker = new SimulationWorker();
    this.state = 'stopped';
  }

  // TODO: move to another file
  getComponentPropertyNames(component) {
    return Object.keys(component).filter(
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
  }

  // TODO: move to another file
  getModelMethodNames(Model) {
    return Object.getOwnPropertyNames(Model.prototype).filter(
      methodName => !['constructor'].includes(methodName),
    );
  }

  // TODO: move to another file
  setupModels(components) {
    return components.map(component => {
      const { type, Model } = component;

      return {
        type,
        methods: this.getModelMethodNames(Model).reduce(
          (obj, name) => ({
            ...obj,
            [name]: Model.prototype[name].toString(),
          }),
          {},
        ),
      };
    });
  }

  addCallback(callback) {
    return this.worker.addEventListener('message', callback);
  }

  removeCallback(callback) {
    return this.worker.removeEventListener('message', callback);
  }

  start(diagram) {
    this.worker.postMessage({
      command: 'start',
      diagram: this.transform(diagram),
    });
    this.state = 'started';
  }

  pause() {
    this.worker.postMessage({ command: 'pause' });
    this.state = 'paused';
  }

  async stop() {
    return new Promise(resolve => {
      const waitForEnd = ({ data: { type } }) => {
        if (type === 'clear') {
          this.worker.removeEventListener('message', waitForEnd);
          this.state = 'stopped';
          resolve();
        }
      };
      this.worker.addEventListener('message', waitForEnd);

      this.worker.postMessage({ command: 'stop' });
    });
  }

  getState() {
    return this.state;
  }

  // TODO: move to another file
  transform(diagram) {
    return {
      models: this.models,
      components: Object.values(diagram.layers[1].models).map(
        component => ({
          id: component.getID(),
          type: component.getType(),
          configurations: component.configurations,
          ports: Object.values(component.ports).map(port => ({
            id: port.getID(),
            name: port.getName(),
          })),
          properties: this.getComponentPropertyNames(
            component,
          ).reduce(
            (obj, key) => ({ ...obj, [key]: component[key] }),
            {},
          ),
        }),
      ),
      links: Object.values(diagram.layers[0].models).map(link => ({
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
      })),
    };
  }
}
