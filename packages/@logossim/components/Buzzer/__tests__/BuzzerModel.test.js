import BuzzerModel from '../BuzzerModel';

const { addPort } = global;

describe('BuzzerModel', () => {
  beforeEach(() => {
    const getPortSpy = jest.spyOn(BuzzerModel.prototype, 'getPort');
    getPortSpy.mockImplementation(() => ({
      getValue: () => [0],
    }));
  });

  it('should add ports on initialization', () => {
    const spy = jest.spyOn(BuzzerModel.prototype, 'addInputPort');
    spy.mockImplementation(addPort);

    new BuzzerModel();

    expect(spy).toHaveBeenCalledWith('in');
  });

  it('should instantiate audio on simulation start with correct parameters', () => {
    const model = new BuzzerModel({
      FREQUENCY_HZ: 1000,
      WAVEFORM: 'SAWTOOTH',
    });
    const spy = jest.spyOn(model, 'createAudio');

    model.onSimulationStart();

    expect(spy).toHaveBeenCalledWith(1000, 'SAWTOOTH');
  });

  it('should pause the audio on simulation pause', () => {
    const model = new BuzzerModel();
    model.audio = { pause: () => {} };

    const spy = jest.spyOn(model.audio, 'pause');

    model.onSimulationPause();

    expect(spy).toHaveBeenCalled();
  });

  it('should play the audio when input is high', () => {
    const model = new BuzzerModel();
    model.audio = { play: () => {} };

    const spy = jest.spyOn(model.audio, 'play');

    model.step({ in: 1 });

    expect(spy).toHaveBeenCalled();
  });

  it('should pause the audio when input is low', () => {
    const model = new BuzzerModel();
    model.audio = { pause: () => {} };

    const spy = jest.spyOn(model.audio, 'pause');

    model.step({ in: 0 });

    expect(spy).toHaveBeenCalled();
  });
});
