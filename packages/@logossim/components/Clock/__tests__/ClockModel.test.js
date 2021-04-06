import ClockModel from '../ClockModel';

const { addPort } = global;

describe('ClockModel', () => {
  it('should add ports on initialization', () => {
    const spy = jest.spyOn(ClockModel.prototype, 'addOutputPort');
    spy.mockImplementation(addPort);

    new ClockModel();

    expect(spy).toHaveBeenCalledWith('out');
  });

  it('should emit on simulation start', () => {
    const model = new ClockModel();
    const spy = jest.spyOn(model, 'emit');
    model.onSimulationStart();

    expect(spy).toHaveBeenCalledWith({ out: 0 });
  });

  it('should generate the correct signal', () => {
    jest.useFakeTimers();

    const model = new ClockModel({
      FREQUENCY_HZ: 1,
      HIGH_DURATION: 1,
      LOW_DURATION: 1,
    });
    const spy = jest.spyOn(model, 'emit');

    model.onSimulationStart();

    expect(spy).toHaveBeenNthCalledWith(1, { out: 0 });
    jest.advanceTimersByTime(500);

    expect(spy).toHaveBeenNthCalledWith(2, { out: 1 });
    jest.advanceTimersByTime(500);

    expect(spy).toHaveBeenNthCalledWith(3, { out: 0 });
  });

  it('should be able to generate with custom high duration', () => {
    jest.useFakeTimers();

    const model = new ClockModel({
      FREQUENCY_HZ: 1,
      HIGH_DURATION: 2,
      LOW_DURATION: 1,
    });
    const spy = jest.spyOn(model, 'emit');

    model.onSimulationStart();

    expect(spy).toHaveBeenNthCalledWith(1, { out: 0 });
    jest.advanceTimersByTime(500);

    expect(spy).toHaveBeenNthCalledWith(2, { out: 1 });
    jest.advanceTimersByTime(1000);

    expect(spy).toHaveBeenNthCalledWith(3, { out: 0 });
  });

  it('should be able to generate with custom low duration', () => {
    jest.useFakeTimers();

    const model = new ClockModel({
      FREQUENCY_HZ: 1,
      HIGH_DURATION: 1,
      LOW_DURATION: 2,
    });
    const spy = jest.spyOn(model, 'emit');

    model.onSimulationStart();

    expect(spy).toHaveBeenNthCalledWith(1, { out: 0 });
    jest.advanceTimersByTime(1000);

    expect(spy).toHaveBeenNthCalledWith(2, { out: 1 });
    jest.advanceTimersByTime(500);

    expect(spy).toHaveBeenNthCalledWith(3, { out: 0 });
  });

  it('should pause the signal generation upon simulation pause', () => {
    jest.useFakeTimers();

    const model = new ClockModel({
      FREQUENCY_HZ: 1,
      HIGH_DURATION: 1,
      LOW_DURATION: 1,
    });
    const spy = jest.spyOn(model, 'emit');

    model.onSimulationStart();

    expect(spy).toHaveBeenNthCalledWith(1, { out: 0 });
    jest.advanceTimersByTime(500);

    expect(spy).toHaveBeenNthCalledWith(2, { out: 1 });

    model.onSimulationPause();
    jest.advanceTimersByTime(5000);

    expect(spy).toHaveBeenCalledTimes(2);

    model.onSimulationStart();

    expect(spy).toHaveBeenNthCalledWith(3, { out: 1 });
    jest.advanceTimersByTime(500);

    expect(spy).toHaveBeenNthCalledWith(4, { out: 0 });
  });
});
