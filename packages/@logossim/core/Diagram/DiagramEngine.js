import { Point } from '@projectstorm/geometry';
import createEngine, {
  DiagramModel,
} from '@projectstorm/react-diagrams';

import BaseModel from '../BaseModel';
import LinkFactory from '../Link/LinkFactory';
import PortFactory from '../Port/PortFactory';
import ClipboardAction from './actions/ClipboardAction';
import CloneAction from './actions/CloneAction';
import DeleteAction from './actions/DeleteAction';
import ZoomAction from './actions/ZoomAction';
import States from './states/States';

export default class DiagramEngine {
  constructor(components) {
    this.components = components;
    this.locked = false;

    this.initializeEngine();
    this.initializeModel();
  }

  getEngine = () => this.engine;

  /**
   * Initialization methods
   */
  initializeEngine = () => {
    this.engine = createEngine({
      registerDefaultDeleteItemsAction: false,
      registerDefaultZoomCanvasAction: false,
    });

    this.engine.getStateMachine().pushState(new States());

    const actions = [
      new CloneAction(),
      new ClipboardAction(),
      new DeleteAction(),
      new ZoomAction(),
    ];
    actions.forEach(action =>
      this.engine.getActionEventBus().registerAction(action),
    );

    this.engine.getPortFactories().registerFactory(new PortFactory());
    this.engine.getLinkFactories().registerFactory(new LinkFactory());

    this.registerComponents();
  };

  initializeModel = () => {
    this.model = new DiagramModel();

    this.model.setGridSize(15);
    this.model.setLocked(false);
    this.model.registerListener({
      eventDidFire: event => {
        const type = event.function;
        if (type === 'offsetUpdated') this.adjustGridOffset(event);
        if (type === 'zoomUpdated') this.adjustGridZoom(event);
      },
    });
    this.realignGrid();

    this.engine.setModel(this.model);
  };

  registerComponents = () => {
    this.components.forEach(component => {
      this.engine.getNodeFactories().registerFactory(component);
    });
  };

  /**
   * Serializing & deserializing methods
   */
  serialize = () => this.model.serialize();

  load = circuit => {
    this.model.deserializeModel(circuit, this.engine);
    this.realignGrid();
    this.engine.repaintCanvas();
  };

  /**
   * Diagram locking methods
   */
  setLocked = locked => {
    this.model.setLocked(locked);
    this.locked = locked;
  };

  isLocked = () => this.locked;

  /**
   * Diagram painting methods
   */
  repaint = () => this.engine.repaintCanvas();

  realignGrid = () => {
    this.adjustGridOffset({
      offsetX: this.model.getOffsetX(),
      offsetY: this.model.getOffsetY(),
    });

    this.adjustGridZoom({
      zoom: this.model.getZoomLevel(),
    });
  };

  adjustGridOffset = ({ offsetX, offsetY }) => {
    document.body.style.setProperty('--offset-x', `${offsetX}px`);
    document.body.style.setProperty('--offset-y', `${offsetY}px`);
  };

  adjustGridZoom = ({ zoom }) => {
    const { gridSize } = this.model.getOptions();
    document.body.style.setProperty(
      '--grid-size',
      `${(gridSize * zoom) / 100}px`,
    );
  };

  /**
   * Component creation and configuration methods
   */
  handleComponentDrop = (event, component) => {
    const { Model } = this.components.find(
      c => c.type === component.type,
    );

    const getSnappedRelativeMousePoint = () => {
      const { x, y } = this.engine.getRelativeMousePoint(event);
      return new Point(
        Math.round(x / 15) * 15,
        Math.round(y / 15) * 15,
      );
    };

    const point = event
      ? getSnappedRelativeMousePoint(event)
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

  getSelectedNodes = () =>
    this.engine
      .getModel()
      .getSelectedEntities()
      .filter(entity => entity instanceof BaseModel);

  fireAction = event =>
    this.engine.getActionEventBus().fireAction({
      event: {
        ...event,
        preventDefault: () => {},
        stopPropagation: () => {},
      },
    });

  cloneSelected = () =>
    this.fireAction({ type: 'keydown', ctrlKey: true, key: 'd' });

  cutSelected = () =>
    this.fireAction({ type: 'keydown', ctrlKey: true, key: 'x' });

  copySelected = () =>
    this.fireAction({ type: 'keydown', ctrlKey: true, key: 'c' });

  pasteSelected = () =>
    this.fireAction({ type: 'keydown', ctrlKey: true, key: 'v' });

  deleteSelected = () =>
    this.fireAction({ type: 'keydown', key: 'Delete' });

  zoomIn = ({ event }) =>
    this.fireAction({
      clientX: event.clientX,
      clientY: event.clientY,
      type: 'wheel',
      deltaY: +1,
    });

  zoomOut = ({ event }) =>
    this.fireAction({
      clientX: event.clientX,
      clientY: event.clientY,
      type: 'wheel',
      deltaY: -1,
    });

  /**
   * Simulation methods
   */
  synchronizeLink = (id, value) =>
    this.getEngine()
      .getModel()
      .getLink(id)
      .setValue(value);

  synchronizeComponent = (id, diff) => {
    const component = this.getEngine()
      .getModel()
      .getNode(id);

    // Sets output port values
    Object.entries(diff.output).forEach(([name, value]) =>
      component.getPort(name).setValue(value),
    );

    // Sets custom properties
    Object.entries(diff.properties).forEach(([name, value]) => {
      component[name] = value;
    });
  };

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
