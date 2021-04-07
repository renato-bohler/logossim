import { Point } from '@projectstorm/geometry';
import {
  PointModel,
  LabelModel,
  LinkModel as RDLinkModel,
} from '@projectstorm/react-diagrams';
import { DefaultLabelModel } from '@projectstorm/react-diagrams-defaults';

import { snap, sameAxis } from '../Diagram/states/common';
import {
  isValueError,
  isValueValid,
  MAX_VALUE,
} from '../Simulation/utils';

export default class LinkModel extends RDLinkModel {
  constructor(options) {
    super({
      type: 'link',
      ...options,
    });

    this.bifurcations = [];
    this.bifurcationSource = null;
    this.bifurcationTarget = null;

    this.value = null;
    this.bits = null;
  }

  getGridSize() {
    return this.getParent()
      .getParent()
      .getOptions().gridSize;
  }

  addLabel(label) {
    if (label instanceof LabelModel) {
      return super.addLabel(label);
    }

    const newLabel = new DefaultLabelModel();
    newLabel.setLabel(label);
    return super.addLabel(newLabel);
  }

  setBifurcationSource(link) {
    this.bifurcationSource = link;
  }

  getBifurcationSource() {
    return this.bifurcationSource;
  }

  setBifurcationTarget(link) {
    this.bifurcationTarget = link;
  }

  getBifurcationTarget() {
    return this.bifurcationTarget;
  }

  isBifurcation() {
    return !!(
      this.getBifurcationSource() || this.getBifurcationTarget()
    );
  }

  addBifurcation(link) {
    if (
      this.bifurcations.find(
        bifurcation => bifurcation.getID() === link.getID(),
      )
    ) {
      return;
    }

    this.bifurcations.push(link);
  }

  removeBifurcation(link) {
    this.bifurcations = this.bifurcations.filter(
      b => b.getID() !== link.getID(),
    );
  }

  getBifurcations() {
    return this.bifurcations;
  }

  getAllBifurcations() {
    const result = [...this.bifurcations];
    this.bifurcations.forEach(bifurcation =>
      result.push(bifurcation.getAllBifurcations()),
    );
    return result.flat(Infinity);
  }

  getSelectionEntities() {
    return [...super.getSelectionEntities(), ...this.bifurcations];
  }

  setSelected(selected) {
    super.setSelected(selected);
    this.bifurcations.forEach(b => b.setSelected(selected));

    if (this.getSourcePort()) {
      this.getSourcePort().setSelected(selected);
    }
    if (this.getTargetPort()) {
      this.getTargetPort().setSelected(selected);
    }
  }

  remove() {
    this.bifurcations.forEach(bifurcation => bifurcation.remove());

    if (this.bifurcationSource) {
      this.bifurcationSource.removeBifurcation(this);
    }

    if (this.bifurcationTarget) {
      this.bifurcationTarget.removeBifurcation(this);
    }

    super.remove();
  }

  serialize() {
    return {
      ...super.serialize(),
      bifurcations: this.bifurcations.map(b => b.getID()),
      bifurcationSource: this.bifurcationSource
        ? this.bifurcationSource.getID()
        : null,
      bifurcationTarget: this.bifurcationTarget
        ? this.bifurcationTarget.getID()
        : null,
      value: this.value,
      bits: this.bits,
    };
  }

  deserialize(event) {
    super.deserialize(event);

    const {
      getModel,
      registerModel,
      data: {
        bifurcationSource,
        bifurcationTarget,
        bifurcations,
        bits,
      },
    } = event;

    registerModel(this);

    requestAnimationFrame(() => {
      this.bits = bits;

      this.points = event.data.points.map(
        point =>
          new PointModel({
            link: this,
            position: new Point(point.x, point.y),
          }),
      );

      bifurcations.forEach(b =>
        getModel(b).then(bifurcation =>
          this.addBifurcation(bifurcation),
        ),
      );

      if (bifurcationSource) {
        getModel(bifurcationSource).then(source =>
          this.setBifurcationSource(source),
        );
      }

      if (bifurcationTarget) {
        getModel(bifurcationTarget).then(target =>
          this.setBifurcationTarget(target),
        );
      }

      event.engine.repaintCanvas();
    });
  }

  addPoint(pointModel, index = 1) {
    super.addPoint(pointModel, index);

    return pointModel;
  }

  generatePoint(x, y) {
    const point = super.generatePoint(x, y);
    point.setPosition(
      snap(x, this.getGridSize()),
      snap(y, this.getGridSize()),
    );

    return point;
  }

  getMiddlePoint() {
    if (!this.hasMiddlePoint()) return null;

    return this.getPoints()[1];
  }

  getSecondPoint() {
    return this.getPoints()[1];
  }

  getSecondLastPoint() {
    const points = this.getPoints();
    return points[points.length - 2];
  }

  getFirstPosition() {
    return snap(
      this.getFirstPoint().getPosition(),
      this.getGridSize(),
    );
  }

  getSecondPosition() {
    return snap(
      this.getSecondPoint().getPosition(),
      this.getGridSize(),
    );
  }

  getMiddlePosition() {
    if (!this.hasMiddlePoint()) return null;

    return snap(
      this.getMiddlePoint().getPosition(),
      this.getGridSize(),
    );
  }

  getSecondLastPosition() {
    return snap(
      this.getSecondLastPoint().getPosition(),
      this.getGridSize(),
    );
  }

  getLastPosition() {
    return snap(
      this.getLastPoint().getPosition(),
      this.getGridSize(),
    );
  }

  hasMiddlePoint() {
    return this.getPoints().length === 3;
  }

  isStraight() {
    if (!this.hasMiddlePoint()) return true;

    const first = this.getFirstPosition();
    const middle = this.getMiddlePosition();
    const last = this.getLastPosition();

    if (sameAxis(first, middle, last)) return true;

    return false;
  }

  getBits() {
    return this.bits;
  }

  setBits(bits) {
    if (![1, 2, 4, 8, 16].includes(bits))
      throw new Error(
        '[logossim] Number of bits should be one of: 1, 2, 4, 8 or 16',
      );

    this.bits = bits;
  }

  getValue() {
    return this.value;
  }

  setValue(value) {
    this.value = value;
  }

  getColor() {
    if (this.isSelected()) return 'var(--link-selected)';

    if (!isValueValid(this.value, this.bits)) {
      if (isValueError(this.value)) return 'var(--value-error)';
      return 'var(--value-floating)';
    }
    if (this.value === null)
      return `var(--link-${this.bits || 1}-bit-color)`;

    return `var(--value-${Math.round(
      (this.value.asNumber() / MAX_VALUE[this.bits]) * 10,
    )})`;
  }

  getLineWidth() {
    return `var(--link-${this.bits || 1}-bit-width)`;
  }

  getPointRadius() {
    return getComputedStyle(document.body).getPropertyValue(
      `--link-${this.bits || 1}-bit-join-radius`,
    );
  }
}
