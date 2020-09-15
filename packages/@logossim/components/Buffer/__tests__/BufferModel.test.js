/* eslint-disable no-new */
import BufferModel from '../BufferModel';

const { addPort } = global;

it('should add ports on initialization', () => {
  const addInputSpy = jest.spyOn(
    BufferModel.prototype,
    'addInputPort',
  );
  addInputSpy.mockImplementation(addPort);

  const addOutputSpy = jest.spyOn(
    BufferModel.prototype,
    'addOutputPort',
  );
  addOutputSpy.mockImplementation(addPort);

  new BufferModel({
    DATA_BITS: 4,
  });

  expect(addInputSpy).toHaveBeenCalledWith('in', 4);
  expect(addOutputSpy).toHaveBeenCalledWith('out', 4);
});

it('should return the value unmodified', () => {
  const model = new BufferModel({
    DATA_BITS: 1,
  });

  expect(
    model.stepAndMask({
      in: 0,
    }),
  ).toEqual({ out: 0 });

  expect(
    model.stepAndMask({
      in: 1,
    }),
  ).toEqual({ out: 1 });
});

it('should return the value unmodified for multiple bits', () => {
  const model = new BufferModel({
    DATA_BITS: 8,
  });

  expect(
    model.stepAndMask({
      in: 0b0101_1010,
    }),
  ).toEqual({ out: 0b0101_1010 });
});
