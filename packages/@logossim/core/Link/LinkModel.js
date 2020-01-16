import { DefaultLinkModel } from '@projectstorm/react-diagrams-defaults';

export default class LinkModel extends DefaultLinkModel {
  constructor(options = {}) {
    super({
      type: 'link',
      ...options,
    });

    this.isBifurcation = false;
    this.bifurcations = [];
  }

  setAsBifurcation() {
    this.isBifurcation = true;
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
      isBifurcation: this.isBifurcation,
      bifurcations: this.bifurcations,
    };
  }

  deserialize(event) {
    super.deserialize(event);

    this.bifurcations = event.data.bifurcations;
    this.isBifurcation = event.data.isBifurcation;
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
