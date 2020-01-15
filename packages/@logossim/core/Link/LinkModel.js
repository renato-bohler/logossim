import { DefaultLinkModel } from '@projectstorm/react-diagrams-defaults';

export default class LinkModel extends DefaultLinkModel {
  constructor(options = {}) {
    super({
      type: 'link',
      ...options,
    });

    this.isBifurcation = false;
    this.bifurcations = [];

    this.lastPathXdirection = false;
    this.firstPathXdirection = false;
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

  setFirstAndLastPathsDirection() {
    const points = this.getPoints();

    for (let i = 1; i < points.length; i += points.length - 2) {
      const dx = Math.abs(points[i].getX() - points[i - 1].getX());
      const dy = Math.abs(points[i].getY() - points[i - 1].getY());

      if (i - 1 === 0) {
        this.firstPathXdirection = dx > dy;
      } else {
        this.lastPathXdirection = dx > dy;
      }
    }
  }

  addPoint(pointModel, index = 1) {
    super.addPoint(pointModel, index);
    this.setFirstAndLastPathsDirection();

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

  setManuallyFirstAndLastPathsDirection(first, last) {
    this.firstPathXdirection = first;
    this.lastPathXdirection = last;
  }

  getLastPathXdirection() {
    return this.lastPathXdirection;
  }

  getFirstPathXdirection() {
    return this.firstPathXdirection;
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
