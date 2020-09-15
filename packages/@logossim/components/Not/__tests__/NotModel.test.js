/* eslint-disable no-new */
import NotModel from '../NotModel';

const { addPort } = global;

it('should add ports on initialization', () => {
  const addInputSpy = jest.spyOn(NotModel.prototype, 'addInputPort');
  addInputSpy.mockImplementation(addPort);

  const addOutputSpy = jest.spyOn(
    NotModel.prototype,
    'addOutputPort',
  );
  addOutputSpy.mockImplementation(addPort);

  new NotModel({
    DATA_BITS: 4,
  });

  expect(addInputSpy).toHaveBeenCalledWith('in', 4);
  expect(addOutputSpy).toHaveBeenCalledWith('out', 4);
});

it('should return the value negated', () => {
  const model = new NotModel({
    DATA_BITS: 1,
  });

  expect(
    model.stepAndMask({
      in: 0,
    }),
  ).toEqual({ out: 1 });

  expect(
    model.stepAndMask({
      in: 0,
    }),
  ).toEqual({ out: 1 });
});

it('should return the value negated for multiple bits', () => {
  const model = new NotModel({
    DATA_BITS: 8,
  });

  expect(
    model.stepAndMask({
      in: 0b0101_1010,
    }),
  ).toEqual({ out: 0b1010_0101 });
});
