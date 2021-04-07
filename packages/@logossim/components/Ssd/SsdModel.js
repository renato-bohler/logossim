import { BaseModel } from '@logossim/core';

export default class LedModel extends BaseModel {
  initialize(configurations) {
    this.activeWhen = configurations.ACTIVE_WHEN;
    this.colors = {
      on: configurations.ON_COLOR,
      off: configurations.OFF_COLOR,
    };

    this.addInputPort('a', { floating: 0, error: 0 });
    this.addInputPort('b', { floating: 0, error: 0 });
    this.addInputPort('c', { floating: 0, error: 0 });
    this.addInputPort('d', { floating: 0, error: 0 });
    this.addInputPort('e', { floating: 0, error: 0 });
    this.addInputPort('f', { floating: 0, error: 0 });
    this.addInputPort('g', { floating: 0, error: 0 });
    this.addInputPort('dp', { floating: 0, error: 0 });
  }

  getInput(segment) {
    return this.getPort(segment).getValue() || [0];
  }

  isActive(segment) {
    const input = this.getInput(segment)[0];

    if (this.activeWhen === 'HIGH') {
      if (input === 0) return false;
      return true;
    }

    if (input === 0) return true;
    return false;
  }

  getPositionForSegment(segment) {
    const POSITIONS = {
      a: {
        vertical: 1,
        horizontal: 3,
      },
      b: {
        vertical: 1,
        horizontal: 4,
      },
      c: {
        vertical: 2,
        horizontal: 3,
      },
      d: {
        vertical: 2,
        horizontal: 2,
      },
      e: {
        vertical: 2,
        horizontal: 1,
      },
      f: {
        vertical: 1,
        horizontal: 2,
      },
      g: {
        vertical: 1,
        horizontal: 1,
      },
      dp: {
        vertical: 2,
        horizontal: 4,
      },
    };

    const position = POSITIONS[segment];

    return {
      horizontal: 8 + 15 * (position.horizontal - 1),
      vertical: position.vertical === 1 ? -2 : 88,
    };
  }

  getColor(segment) {
    if (this.isActive(segment)) return this.colors.on;
    return this.colors.off;
  }
}
