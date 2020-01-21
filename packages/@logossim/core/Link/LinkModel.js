import { Point } from '@projectstorm/geometry';
import { PointModel } from '@projectstorm/react-diagrams';
import { DefaultLinkModel } from '@projectstorm/react-diagrams-defaults';

export default class LinkModel extends DefaultLinkModel {
  constructor(options) {
    super({
      type: 'link',
      ...options,
    });

    this.bifurcations = [];
    this.bifurcationSource = null;
  }

  setBifurcationSource(link) {
    this.bifurcationSource = link;
  }

  getBifurcationSource() {
    return this.bifurcationSource;
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

  addPoint(pointModel, index = 1) {
    super.addPoint(pointModel, index);

    return pointModel;
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
    };
  }

  deserialize(event) {
    super.deserialize(event);

    const {
      getModel,
      registerModel,
      data: { bifurcationSource, bifurcations },
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

      event.engine.repaintCanvas();
    });
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
