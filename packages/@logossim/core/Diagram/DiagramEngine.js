import createEngine, {
  DiagramModel,
} from '@projectstorm/react-diagrams';
import { Point } from '@projectstorm/geometry';

import States from './states/States';

import LinkFactory from '../Link/LinkFactory';
import PortFactory from '../Port/PortFactory';

export default class DiagramEngine {
  constructor(components) {
    this.components = components;
    this.locked = false;

    this.initializeEngine();
    this.initializeModel();
  }

  initializeEngine = () => {
    this.engine = createEngine({
      registerDefaultZoomCanvasAction: false,
    });

    this.engine.getStateMachine().pushState(new States());

    this.engine.getPortFactories().registerFactory(new PortFactory());
    this.engine.getLinkFactories().registerFactory(new LinkFactory());

    this.registerComponents();
  };

  initializeModel = () => {
    this.model = new DiagramModel();

    this.model.setGridSize(15);
    this.model.setLocked(false);
    this.model.registerListener({
      eventDidFire: this.realignGrid,
    });

    this.engine.setModel(this.model);
  };

  getEngine = () => this.engine;

  registerComponents = () => {
    this.components.forEach(component => {
      this.engine.getNodeFactories().registerFactory(component);
    });
  };

  serialize = () => this.model.serialize();

  load = circuit => {
    this.model.deserializeModel(circuit, this.engine);
    this.realignGrid({
      offsetX: this.model.getOffsetX(),
      offsetY: this.model.getOffsetY(),
    });
    requestAnimationFrame(() => this.engine.repaintCanvas());
  };

  setLocked = locked => {
    this.model.setLocked(locked);
    this.locked = locked;
  };

  isLocked = () => this.locked;

  repaint = () => this.engine.repaintCanvas();

  realignGrid = ({ offsetX, offsetY }) =>
    requestAnimationFrame(() => {
      document.body.style.backgroundPosition = `${offsetX}px ${offsetY}px`;
    });

  getSnappedRelativeMousePoint = event => {
    const { x, y } = this.engine.getRelativeMousePoint(event);
    return new Point(
      Math.round(x / 15) * 15,
      Math.round(y / 15) * 15,
    );
  };

  handleComponentDrop = (event, component) => {
    const { Model } = this.components.find(
      c => c.type === component.type,
    );

    const point = event
      ? this.getSnappedRelativeMousePoint(event)
      : new Point(0, 0);

    const node = new Model(component.type, component.configurations);
    this.model.addNode(node);
    node.setPosition(point);

    this.engine.repaintCanvas();
  };

  clearSelection = () =>
    this.getEngine()
      .getModel()
      .clearSelection();

  // TODO: change to setLinkValue
  getLink = id =>
    this.getEngine()
      .getModel()
      .getLink(id);

  // TODO: change to setPortValue
  getComponent = id =>
    this.getEngine()
      .getModel()
      .getNode(id);

  clearAllValues = () => {
    this.clearLinkValues();
    this.clearPortValues();
  };

  clearLinkValues = () =>
    this.getEngine()
      .getModel()
      .getLinks()
      .forEach(link => link.setValue(null));

  clearPortValues = () =>
    this.getEngine()
      .getModel()
      .getNodes()
      .forEach(node =>
        Object.values(node.getPorts()).forEach(port =>
          port.setValue(null),
        ),
      );
}
