import SwitchModel from '../SwitchModel';

const { addPort } = global;

describe('SwitchModel', () => {
  it('should add ports on initialization', () => {
    const spy = jest.spyOn(SwitchModel.prototype, 'addOutputPort');
    spy.mockImplementation(addPort);

    new SwitchModel();

    expect(spy).toHaveBeenCalledWith('out');
  });

  it('should emit on simulation start', () => {
    const model = new SwitchModel();
    const spy = jest.spyOn(model, 'emit');
    model.onSimulationStart();

    expect(spy).toHaveBeenCalledWith({ out: 0 });
  });

  it('should toggle to 1 upon clicking when value is 0', () => {
    const model = new SwitchModel();
    const emitSpy = jest.spyOn(model, 'emit');
    const outputSpy = jest.spyOn(model, 'getOutput');
    outputSpy.mockImplementation(() => 0);

    model.onClick();

    expect(emitSpy).toHaveBeenCalledWith({ out: 1 });
  });

  it('should toggle to 0 upon clicking when value is 1', () => {
    const model = new SwitchModel();
    const emitSpy = jest.spyOn(model, 'emit');
    const outputSpy = jest.spyOn(model, 'getOutput');
    outputSpy.mockImplementation(() => 1);

    model.onClick();

    expect(emitSpy).toHaveBeenCalledWith({ out: 0 });
  });
});
