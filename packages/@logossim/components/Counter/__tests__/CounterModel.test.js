import CounterModel from '../CounterModel';

const { addPort } = global;

describe('CounterModel', () => {
  it('should add ports on initialization', () => {
    const addInputSpy = jest.spyOn(
      CounterModel.prototype,
      'addInputPort',
    );
    addInputSpy.mockImplementation(addPort);

    const addOutputSpy = jest.spyOn(
      CounterModel.prototype,
      'addOutputPort',
    );
    addOutputSpy.mockImplementation(addPort);

    new CounterModel({
      DATA_BITS: 4,
      COUNT_ON: 'rising',
      START_AT: 0,
      WRAP_AT: 0,
      STEP_VALUE: 1,
    });

    expect(addInputSpy).toHaveBeenCalledWith('in');
    expect(addOutputSpy).toHaveBeenCalledWith('out', { bits: 4 });
  });

  it('should start at START_VALUE', () => {
    const model = new CounterModel({
      DATA_BITS: 4,
      COUNT_ON: 'rising',
      START_AT: 10,
      WRAP_AT: 0,
      STEP_VALUE: 1,
    });

    const { out } = model.step({}, { in: { risingEdge: false } });

    expect(out).toEqual(10);
  });

  it('should increment by STEP_VALUE on rising edge if configured', () => {
    const model = new CounterModel({
      DATA_BITS: 4,
      COUNT_ON: 'rising',
      START_AT: 10,
      WRAP_AT: 0,
      STEP_VALUE: 2,
    });

    const { out } = model.step({}, { in: { risingEdge: true } });

    expect(out).toEqual(12);
  });

  it('should increment by STEP_VALUE on falling edge if configured', () => {
    const model = new CounterModel({
      DATA_BITS: 4,
      COUNT_ON: 'falling',
      START_AT: 10,
      WRAP_AT: 0,
      STEP_VALUE: 2,
    });

    const { out } = model.step({}, { in: { fallingEdge: true } });

    expect(out).toEqual(12);
  });

  it('should wrap if configured', () => {
    const model = new CounterModel({
      DATA_BITS: 4,
      COUNT_ON: 'rising',
      START_AT: 10,
      WRAP_AT: 14,
      STEP_VALUE: 1,
    });

    // 10 => 11
    model.step({}, { in: { risingEdge: true } });
    // 11 => 12
    model.step({}, { in: { risingEdge: true } });
    // 12 => 13
    model.step({}, { in: { risingEdge: true } });
    // 13 => 14 => 0 (wrap)
    const { out } = model.step({}, { in: { risingEdge: true } });

    expect(out).toEqual(10);
  });
});
