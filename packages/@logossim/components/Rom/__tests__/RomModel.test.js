import RomModel from '../RomModel';

const { addPort } = global;

describe('RomModel', () => {
  beforeEach(() => {
    const getPortSpy = jest.spyOn(RomModel.prototype, 'getPort');
    getPortSpy.mockImplementation(() => ({
      getWireValue: () => ({ asNumber: () => 5 }),
    }));
  });

  it('should add ports on initialization', () => {
    const addInputSpy = jest.spyOn(
      RomModel.prototype,
      'addInputPort',
    );
    addInputSpy.mockImplementation(addPort);

    const addOutputSpy = jest.spyOn(
      RomModel.prototype,
      'addOutputPort',
    );
    addOutputSpy.mockImplementation(addPort);

    new RomModel({
      DATA_WIDTH: 2,
      ADDRESS_WIDTH: 4,
    });

    expect(addInputSpy).toHaveBeenCalledWith('address', {
      bits: 4,
      floating: 0,
    });
    expect(addInputSpy).toHaveBeenCalledWith('select', {
      floating: 1,
    });
    expect(addOutputSpy).toHaveBeenCalledWith('data', { bits: 2 });
  });

  it('should be correctly initialized', () => {
    const model = new RomModel({
      DATA_WIDTH: 1,
      ADDRESS_WIDTH: 8,
    });
    const memory = model.getMemory();

    expect(memory).toHaveLength(256);
    memory.forEach(value => expect(value).toEqual(0));
  });

  it('should be correcly initialized with content defined in configuration', () => {
    const model = new RomModel({
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
    const model = new RomModel({
      DATA_WIDTH: 4,
      ADDRESS_WIDTH: 4,
      CONTENT: '0001 0010 0100 1000',
    });

    [0, 1, 2, 3].forEach(address =>
      expect(
        model.step({
          address,
          select: 1,
        }),
      ).toEqual({ data: 2 ** address }),
    );
  });

  it('should not output to data port if select is not set', () => {
    const model = new RomModel({
      DATA_WIDTH: 4,
      ADDRESS_WIDTH: 4,
      CONTENT: '0001 0010 0100 1000',
    });

    [0, 1, 2, 3].forEach(address =>
      expect(
        model.step({
          address,
          select: 0,
        }),
      ).toEqual({ data: 'x' }),
    );
  });
});
