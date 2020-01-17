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

  addBifurcation(link) {
    this.bifurcations.push(link);
  }

  removeBifurcation(link) {
    this.bifurcations = this.bifurcations.filter(
      b => b.getID() !== link.getID(),
    );
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
    this.bifurcations.forEach(b => b.remove());
    this.bifurcations = [];
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
