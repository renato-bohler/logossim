import { Point } from '@projectstorm/geometry';
import { PointModel } from '@projectstorm/react-diagrams';
import { DefaultLinkModel } from '@projectstorm/react-diagrams-defaults';
import { sameAxis } from '../Diagram/states/common';

export default class LinkModel extends DefaultLinkModel {
  constructor(options) {
    super({
      type: 'link',
      ...options,
    });

    this.bifurcations = [];
    this.bifurcationSource = null;
    this.bifurcationTarget = null;
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

  addBifurcation(link) {
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

  getSelectionEntities() {
    return [...super.getSelectionEntities(), ...this.bifurcations];
  }

  setSelected(selected) {
    super.setSelected(selected);
    this.bifurcations.forEach(b => b.setSelected(selected));
  }

  remove() {
    this.bifurcations.forEach(bifurcation => bifurcation.remove());

    if (this.bifurcationSource) {
      this.bifurcationSource.removeBifurcation(this);
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
    };
  }

  deserialize(event) {
    super.deserialize(event);

    const {
      getModel,
      registerModel,
      data: { bifurcationSource, bifurcationTarget, bifurcations },
    } = event;

    registerModel(this);

    requestAnimationFrame(() => {
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
    return this.getFirstPoint().getPosition();
  }

  getSecondPosition() {
    return this.getSecondPoint().getPosition();
  }

  getMiddlePosition() {
    if (!this.hasMiddlePoint()) return null;

    return this.getMiddlePoint().getPosition();
  }

  getSecondLastPosition() {
    return this.getSecondLastPoint().getPosition();
  }

  getLastPosition() {
    return this.getLastPoint().getPosition();
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

  setWidth(width) {
    this.options.width = width;
    this.fireEvent({ width }, 'widthChanged');
  }

  setColor(color) {
    this.options.color = color;
    this.fireEvent({ color }, 'colorChanged');
  }
}
