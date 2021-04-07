/**
 * SimulationWorker receives all components properties and methods
 * serialized. For that reason, we need to deserialize them before
 * executing the simulation thread.
 */

/* ---------------------------------------------------------------- */
import findMeshes from './mesh';
import { isValueEqual } from './utils';

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

  getPort(name) {
    return [...this.ports.input, ...this.ports.output].find(
      port => port.name === name,
    );
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

      let current = previous;
      let errorOrFloating = false;

      if (values[port.name] !== undefined) {
        current = values[port.name];
        if (typeof current === 'number') {
          current = values[port.name].asArray(port.bits);
        } else if (current === 'x' || current === 'e') {
          current = Array(port.bits).fill(current);
          errorOrFloating = true;
        } else if (!Array.isArray(current)) {
          errorOrFloating = true;
        }
      }

      current = current.map(bit => {
        if (bit === 'x') return port.defaultFloatingValue ?? 'x';
        if (bit === 'e') return port.defaultErrorValue ?? 'e';
        return bit;
      });

      if (previous.some(bit => bit === 'x' || bit === 'e')) {
        errorOrFloating = true;
      }

      const risingEdge = !errorOrFloating && previous < current;
      const fallingEdge = !errorOrFloating && previous > current;

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

  setWireValues(values) {
    this.ports.output = this.ports.output.map(port => {
      if (!values[port.name]) return port;

      return {
        ...port,
        linkValue: values[port.name],
      };
    });
  }

  hasOutputChanged(values) {
    return !Object.keys(values).every(portName =>
      isValueEqual(
        values[portName],
        this.ports.output.find(output => output.name === portName)
          .value,
      ),
    );
  }

  getProperties() {
    const customPropertyNames = Object.keys(this).filter(
      key =>
        !['id', 'initialize', 'configurations', 'ports'].includes(
          key,
        ),
    );

    return JSON.parse(
      JSON.stringify(
        customPropertyNames
          .filter(property => typeof this[property] !== 'function')
          .reduce(
            (obj, property) => ({
              ...obj,
              [property]: this[property],
            }),
            {},
          ),
      ),
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
      (obj, port) => ({
        ...obj,
        [port.name]: Array(port.bits).fill('e'),
      }),
      {},
    );
  }

  stepFloating() {
    return this.ports.output.reduce(
      (obj, port) => ({
        ...obj,
        [port.name]: Array(port.bits).fill('x'),
      }),
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

  // Functionality that requires calling main thread
  createAudio(frequency, waveform) {
    if (!this.audioCount) {
      this.audioCount = 0;
    }

    const AUDIO_ID = `${this.audioCount}-${this.id}`;
    this.audioCount += 1;

    postMessage({
      type: 'audio',
      payload: {
        command: 'create',
        id: AUDIO_ID,
        frequency,
        waveform: waveform.toLowerCase(),
      },
    });

    const play = () =>
      postMessage({
        type: 'audio',
        payload: {
          command: 'play',
          id: AUDIO_ID,
        },
      });

    const pause = () =>
      postMessage({
        type: 'audio',
        payload: { command: 'pause', id: AUDIO_ID },
      });

    const setFrequency = freq =>
      postMessage({
        type: 'audio',
        payload: {
          command: 'setFrequency',
          id: AUDIO_ID,
          frequency: freq,
        },
      });

    const setWaveform = wf =>
      postMessage({
        type: 'audio',
        payload: {
          command: 'setWaveform',
          id: AUDIO_ID,
          waveform: wf,
        },
      });

    return {
      play,
      pause,
      setFrequency,
      setWaveform,
    };
  }
}

/**
 * Converts string representing functions to actual functions in given
 * model.
 */
const deserializeMethod = model =>
  Object.fromEntries(
    Object.entries(model.methods).map(([key, stringFn]) => {
      return [
        key,
        // eslint-disable-next-line no-new-func
        new Function(`return function ${stringFn}`)(),
      ];
    }),
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

const deserializePort = port => ({
  ...port,
  value: new Array(port.bits || 1).fill(port.defaultFloatingValue),
  linkValue: new Array(port.bits || 1).fill(
    port.defaultFloatingValue,
  ),
  getValue() {
    return this.value;
  },
  getWireValue() {
    return this.linkValue;
  },
});

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
                .map(deserializePort),
              output: component.ports
                .filter(port => !port.input)
                .map(deserializePort),
            },
          },
          models[component.type],
        ),
    ),
    meshes: findMeshes(serialized.links),
  };
};

export default deserialize;
