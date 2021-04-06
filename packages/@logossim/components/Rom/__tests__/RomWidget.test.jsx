import React from 'react';

import { render } from '../../testUtils';
import RomModel from '../RomModel';
import RomWidget from '../RomWidget';

describe('RomWidget', () => {
  it('should have 1 output port', () => {
    const model = new RomModel({
      DATA_WIDTH: 1,
      ADDRESS_WIDTH: 8,
    });

    const { container } = render(<RomWidget model={model} />);

    const data = container.querySelector('[data-name=data]');

    expect(data).toBeTruthy();
  });

  it('should have the correct input ports', () => {
    const model = new RomModel({
      DATA_WIDTH: 1,
      ADDRESS_WIDTH: 8,
    });

    const { container } = render(<RomWidget model={model} />);

    const address = container.querySelector('[data-name=address]');
    const select = container.querySelector('[data-name=select]');

    expect(address).toBeTruthy();
    expect(select).toBeTruthy();
  });

  it('should display the first 5 values for the first 3 addresses', () => {
    const model = new RomModel({
      DATA_WIDTH: 4,
      ADDRESS_WIDTH: 4,
      CONTENT: '0001 0010 0100 1000 1111',
    });
    model.getAddress = () => 0;

    const { getByText, rerender } = render(
      <RomWidget model={model} />,
    );

    expect(getByText('0x00')).toBeTruthy();
    expect(getByText('0x00').nextSibling).toHaveTextContent(1);

    expect(getByText('0x01')).toBeTruthy();
    expect(getByText('0x01').nextSibling).toHaveTextContent(2);

    expect(getByText('0x02')).toBeTruthy();
    expect(getByText('0x02').nextSibling).toHaveTextContent(4);

    expect(getByText('0x03')).toBeTruthy();
    expect(getByText('0x03').nextSibling).toHaveTextContent(8);

    expect(getByText('0x04')).toBeTruthy();
    expect(getByText('0x04').nextSibling).toHaveTextContent(15);

    model.getAddress = () => 1;
    rerender(<RomWidget model={model} />);

    expect(getByText('0x00')).toBeTruthy();
    expect(getByText('0x00').nextSibling).toHaveTextContent(1);

    expect(getByText('0x01')).toBeTruthy();
    expect(getByText('0x01').nextSibling).toHaveTextContent(2);

    expect(getByText('0x02')).toBeTruthy();
    expect(getByText('0x02').nextSibling).toHaveTextContent(4);

    expect(getByText('0x03')).toBeTruthy();
    expect(getByText('0x03').nextSibling).toHaveTextContent(8);

    expect(getByText('0x04')).toBeTruthy();
    expect(getByText('0x04').nextSibling).toHaveTextContent(15);

    model.getAddress = () => 2;
    rerender(<RomWidget model={model} />);

    expect(getByText('0x00')).toBeTruthy();
    expect(getByText('0x00').nextSibling).toHaveTextContent(1);

    expect(getByText('0x01')).toBeTruthy();
    expect(getByText('0x01').nextSibling).toHaveTextContent(2);

    expect(getByText('0x02')).toBeTruthy();
    expect(getByText('0x02').nextSibling).toHaveTextContent(4);

    expect(getByText('0x03')).toBeTruthy();
    expect(getByText('0x03').nextSibling).toHaveTextContent(8);

    expect(getByText('0x04')).toBeTruthy();
    expect(getByText('0x04').nextSibling).toHaveTextContent(15);
  });

  it('should display the adjacent values for addresses in the middle', () => {
    const model = new RomModel({
      DATA_WIDTH: 4,
      ADDRESS_WIDTH: 4,
      CONTENT: '0001 0010 0100 1000 1111',
    });
    model.getAddress = () => 3;

    const { getByText, rerender } = render(
      <RomWidget model={model} />,
    );

    expect(getByText('0x01')).toBeTruthy();
    expect(getByText('0x01').nextSibling).toHaveTextContent(2);

    expect(getByText('0x02')).toBeTruthy();
    expect(getByText('0x02').nextSibling).toHaveTextContent(4);

    expect(getByText('0x03')).toBeTruthy();
    expect(getByText('0x03').nextSibling).toHaveTextContent(8);

    expect(getByText('0x04')).toBeTruthy();
    expect(getByText('0x04').nextSibling).toHaveTextContent(15);

    expect(getByText('0x05')).toBeTruthy();
    expect(getByText('0x05').nextSibling).toHaveTextContent(0);

    model.getAddress = () => 4;
    rerender(<RomWidget model={model} />);

    expect(getByText('0x02')).toBeTruthy();
    expect(getByText('0x02').nextSibling).toHaveTextContent(4);

    expect(getByText('0x03')).toBeTruthy();
    expect(getByText('0x03').nextSibling).toHaveTextContent(8);

    expect(getByText('0x04')).toBeTruthy();
    expect(getByText('0x04').nextSibling).toHaveTextContent(15);

    expect(getByText('0x05')).toBeTruthy();
    expect(getByText('0x05').nextSibling).toHaveTextContent(0);

    expect(getByText('0x06')).toBeTruthy();
    expect(getByText('0x06').nextSibling).toHaveTextContent(0);

    model.getAddress = () => 5;
    rerender(<RomWidget model={model} />);

    expect(getByText('0x03')).toBeTruthy();
    expect(getByText('0x03').nextSibling).toHaveTextContent(8);

    expect(getByText('0x04')).toBeTruthy();
    expect(getByText('0x04').nextSibling).toHaveTextContent(15);

    expect(getByText('0x05')).toBeTruthy();
    expect(getByText('0x05').nextSibling).toHaveTextContent(0);

    expect(getByText('0x06')).toBeTruthy();
    expect(getByText('0x06').nextSibling).toHaveTextContent(0);

    expect(getByText('0x07')).toBeTruthy();
    expect(getByText('0x07').nextSibling).toHaveTextContent(0);
  });

  it('should display the last 5 values for the last 3 addresses', () => {
    const model = new RomModel({
      DATA_WIDTH: 4,
      ADDRESS_WIDTH: 4,
      CONTENT: '0001 0010 0100 1000 1111',
    });
    model.getAddress = () => 13;

    const { getByText, rerender } = render(
      <RomWidget model={model} />,
    );

    expect(getByText('0x0b')).toBeTruthy();
    expect(getByText('0x0b').nextSibling).toHaveTextContent(0);

    expect(getByText('0x0c')).toBeTruthy();
    expect(getByText('0x0c').nextSibling).toHaveTextContent(0);

    expect(getByText('0x0d')).toBeTruthy();
    expect(getByText('0x0d').nextSibling).toHaveTextContent(0);

    expect(getByText('0x0e')).toBeTruthy();
    expect(getByText('0x0e').nextSibling).toHaveTextContent(0);

    expect(getByText('0x0f')).toBeTruthy();
    expect(getByText('0x0f').nextSibling).toHaveTextContent(0);

    model.getAddress = () => 14;
    rerender(<RomWidget model={model} />);

    expect(getByText('0x0b')).toBeTruthy();
    expect(getByText('0x0b').nextSibling).toHaveTextContent(0);

    expect(getByText('0x0c')).toBeTruthy();
    expect(getByText('0x0c').nextSibling).toHaveTextContent(0);

    expect(getByText('0x0d')).toBeTruthy();
    expect(getByText('0x0d').nextSibling).toHaveTextContent(0);

    expect(getByText('0x0e')).toBeTruthy();
    expect(getByText('0x0e').nextSibling).toHaveTextContent(0);

    expect(getByText('0x0f')).toBeTruthy();
    expect(getByText('0x0f').nextSibling).toHaveTextContent(0);

    model.getAddress = () => 15;
    rerender(<RomWidget model={model} />);

    expect(getByText('0x0b')).toBeTruthy();
    expect(getByText('0x0b').nextSibling).toHaveTextContent(0);

    expect(getByText('0x0c')).toBeTruthy();
    expect(getByText('0x0c').nextSibling).toHaveTextContent(0);

    expect(getByText('0x0d')).toBeTruthy();
    expect(getByText('0x0d').nextSibling).toHaveTextContent(0);

    expect(getByText('0x0e')).toBeTruthy();
    expect(getByText('0x0e').nextSibling).toHaveTextContent(0);

    expect(getByText('0x0f')).toBeTruthy();
    expect(getByText('0x0f').nextSibling).toHaveTextContent(0);
  });
});
