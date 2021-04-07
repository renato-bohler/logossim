import RamModel from '../RamModel';

const { addPort } = global;

describe('RamModel', () => {
  beforeEach(() => {
    const getPortSpy = jest.spyOn(RamModel.prototype, 'getPort');
    getPortSpy.mockImplementation(() => ({
      getWireValue: () => ({ asNumber: () => 5 }),
    }));
  });

  it('should add ports on initialization', () => {
    const addInputSpy = jest.spyOn(
      RamModel.prototype,
      'addInputPort',
    );
    addInputSpy.mockImplementation(addPort);

    const addOutputSpy = jest.spyOn(
      RamModel.prototype,
      'addOutputPort',
    );
    addOutputSpy.mockImplementation(addPort);

    new RamModel({
      DATA_WIDTH: 2,
      ADDRESS_WIDTH: 4,
    });

    expect(addInputSpy).toHaveBeenCalledWith('clock', {
      floating: 0,
    });
    expect(addInputSpy).toHaveBeenCalledWith('load', { floating: 1 });
    expect(addInputSpy).toHaveBeenCalledWith('address', {
      bits: 4,
      floating: 0,
    });
    expect(addInputSpy).toHaveBeenCalledWith('clear', {
      floating: 0,
    });
    expect(addInputSpy).toHaveBeenCalledWith('select', {
      floating: 1,
    });
    expect(addOutputSpy).toHaveBeenCalledWith('data', { bits: 2 });
  });

  it('should be correctly initialized', () => {
    const model = new RamModel({
      DATA_WIDTH: 1,
      ADDRESS_WIDTH: 8,
    });
    const memory = model.getMemory();

    expect(memory).toHaveLength(256);
    memory.forEach(value => expect(value).toEqual(0));
  });

  it('should be correcly initialized with content defined in configuration', () => {
    const model = new RamModel({
      DATA_WIDTH: 4,
      ADDRESS_WIDTH: 4,
      CONTENT: '0001 0010 0100 1000',
    });
    const memory = model.getMemory();

    expect(memory[0]).toEqual(1);
    expect(memory[1]).toEqual(2);
    expect(memory[2]).toEqual(4);
    expect(memory[3]).toEqual(8);
    expect(memory).toHaveLength(16);
  });

  it('should asynchronously output value of given address to the data port', () => {
    const model = new RamModel({
      DATA_WIDTH: 4,
      ADDRESS_WIDTH: 4,
      CONTENT: '0001 0010 0100 1000',
    });

    [0, 1, 2, 3].forEach(address =>
      expect(
        model.step(
          {
            address,
            select: 1,
            load: 1,
          },
          { clock: { risingEdge: false } },
        ),
      ).toEqual({ data: 2 ** address }),
    );
  });

  it('should not output to data port if select is not set', () => {
    const model = new RamModel({
      DATA_WIDTH: 4,
      ADDRESS_WIDTH: 4,
      CONTENT: '0001 0010 0100 1000',
    });

    [0, 1, 2, 3].forEach(address =>
      expect(
        model.step(
          {
            address,
            select: 0,
            load: 1,
          },
          { clock: { risingEdge: false } },
        ),
      ).toEqual({ data: 'x' }),
    );
  });

  it('should asynchronously clear the memory when the clear port is set', () => {
    const model = new RamModel({
      DATA_WIDTH: 4,
      ADDRESS_WIDTH: 4,
      CONTENT: '0001 0010 0100 1000',
    });

    model.step({
      clear: 1,
      select: 0,
    });

    model.getMemory().forEach(value => expect(value).toEqual(0));
  });

  it('should synchronously store data', () => {
    const model = new RamModel({
      DATA_WIDTH: 4,
      ADDRESS_WIDTH: 4,
    });

    const { data } = model.step(
      {
        address: 12,
        load: 0,
        clear: 0,
        select: 1,
      },
      { clock: { risingEdge: true } },
    );

    expect(model.getMemory()[12]).toEqual(5);
    expect(data).toEqual('x');
  });

  it('should not asynchronously store data', () => {
    const model = new RamModel({
      DATA_WIDTH: 4,
      ADDRESS_WIDTH: 4,
    });

    const { data } = model.step(
      {
        address: 12,
        load: 0,
        clear: 0,
        select: 1,
      },
      { clock: { risingEdge: false } },
    );

    expect(model.getMemory()[12]).toEqual(0);
    expect(data).toEqual('x');
  });

  it('should not store data if clear is set', () => {
    const model = new RamModel({
      DATA_WIDTH: 4,
      ADDRESS_WIDTH: 4,
    });

    const { data } = model.step(
      {
        address: 12,
        load: 0,
        clear: 1,
        select: 1,
      },
      { clock: { risingEdge: true } },
    );

    expect(model.getMemory()[12]).toEqual(0);
    expect(data).toEqual('x');
  });

  it('should not store data if not selected', () => {
    const model = new RamModel({
      DATA_WIDTH: 4,
      ADDRESS_WIDTH: 4,
    });

    const { data } = model.step(
      {
        address: 12,
        load: 0,
        clear: 0,
        select: 0,
      },
      { clock: { risingEdge: true } },
    );

    expect(model.getMemory()[12]).toEqual(0);
    expect(data).toEqual('x');
  });

  it('should not store data if load is set', () => {
    const model = new RamModel({
      DATA_WIDTH: 4,
      ADDRESS_WIDTH: 4,
    });

    const { data } = model.step(
      {
        address: 12,
        load: 1,
        clear: 0,
        select: 1,
      },
      { clock: { risingEdge: true } },
    );

    expect(model.getMemory()[12]).toEqual(0);
    expect(data).toEqual(0);
  });
});
