import {
  PortModel as RDPortModel,
  RightAngleLinkModel,
} from '@projectstorm/react-diagrams';

export default class PortModel extends RDPortModel {
  constructor(options = {}) {
    super({
      type: 'Port',
      ...options,
    });
  }

  serialize() {
    return { ...super.serialize(), value: this.value };
  }

  deSerialize(data, engine) {
    super.deSerialize(data, engine);
    this.value = data.value;
  }

  createLinkModel() {
    return new RightAngleLinkModel();
  }
}
