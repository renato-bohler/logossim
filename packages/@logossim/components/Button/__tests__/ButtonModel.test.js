import ButtonModel from '../ButtonModel';

const { addPort } = global;

describe('ButtonModel', () => {
  it('should add ports on initialization', () => {
    const spy = jest.spyOn(ButtonModel.prototype, 'addOutputPort');
    spy.mockImplementation(addPort);

    new ButtonModel();

    expect(spy).toHaveBeenCalledWith('out');
  });

  it('should emit on simulation start', () => {
    const model = new ButtonModel();
    const spy = jest.spyOn(model, 'emit');
    model.onSimulationStart();

    expect(spy).toHaveBeenCalledWith({ out: 0 });
  });

  it('should emit correctly on click', () => {
    const model = new ButtonModel();
    const emitSpy = jest.spyOn(model, 'emit');

    model.onClick();

    expect(emitSpy).toHaveBeenCalledWith({ out: 1 });
  });

  it('should emit correctly on release', () => {
    const model = new ButtonModel();
    const emitSpy = jest.spyOn(model, 'emit');

    model.onRelease();

    expect(emitSpy).toHaveBeenCalledWith({ out: 0 });
  });
});
