import React, { Component } from 'react';
import styled from 'styled-components';
import createEngine, {
  DiagramModel,
  RightAngleLinkFactory,
} from '@projectstorm/react-diagrams';
import { CanvasWidget } from '@projectstorm/react-canvas-core';
import { PortFactory } from '@logossim/core';
import components from '@logossim/components';

import defaultCircuit from './defaultCircuit';
import './App.css';

const ButtonsContainer = styled.div`
  position: absolute;
  right: 0;

  z-index: 100;
`;

const Button = styled.button.attrs((...props) => ({
  ...props,
  type: 'button',
}))`
  border: none;
  border-radius: 5px;
  background: ${props => {
    switch (props.color) {
      case 'green':
        return '#07d26b';
      case 'orange':
        return 'orange';
      default:
        return 'gray';
    }
  }};

  color: white;
  font-weight: bold;
  font-size: 1.2em;

  min-width: 110px;
  padding: 5px 20px;
  margin: 5px;
`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      circuit: undefined,
      locked: false,
    };
  }

  componentDidMount() {
    this.initializeEngine();
    this.initializeModel();

    this.forceUpdate();
  }

  initializeEngine() {
    this.engine = createEngine({
      registerDefaultZoomCanvasAction: false,
    });

    // TODO: this may not be the best way to disallow loose links
    const state = this.engine.getStateMachine().getCurrentState();
    if (state) {
      state.dragNewLink.config.allowLooseLinks = false;
    }

    this.engine.getPortFactories().registerFactory(new PortFactory());

    this.engine
      .getLinkFactories()
      .registerFactory(new RightAngleLinkFactory());

    this.registerComponents();
  }

  initializeModel() {
    this.model = new DiagramModel();

    this.model.setGridSize(15);
    this.model.registerListener({
      eventDidFire: this.realignGrid,
    });

    this.engine.setModel(this.model);

    this.loadDiagram(defaultCircuit);
  }

  loadDiagram(circuit) {
    this.model.deserializeModel(circuit, this.engine);
    this.realignGrid({
      offsetX: this.model.getOffsetX(),
      offsetY: this.model.getOffsetY(),
    });
    setTimeout(() => this.engine.repaintCanvas());
  }

  realignGrid = ({ offsetX, offsetY }) => {
    document.body.style.backgroundPosition = `${offsetX}px ${offsetY}px`;
  };

  registerComponents = () => {
    components.forEach(component => {
      this.engine.getNodeFactories().registerFactory(component);
    });
  };

  handleClickSave = () => {
    const { model } = this;

    const serialized = model.serialize();
    this.setState({ circuit: serialized });
    console.log(serialized);
  };

  handleClickLoad = () => {
    const { circuit } = this.state;

    if (!circuit) {
      window.alert('No circuit has been saved yet');
      return;
    }

    this.loadDiagram(circuit);
  };

  handleClickLock = () => {
    this.setState(
      state => ({
        locked: !state.locked,
      }),
      () => {
        const { locked } = this.state;
        this.model.setLocked(locked);
      },
    );
  };

  render() {
    const { engine, model } = this;
    const { locked } = this.state;

    if (!engine || !model) return <div>Loading...</div>;

    return (
      <>
        <ButtonsContainer>
          <Button color="green" onClick={this.handleClickSave}>
            Save
          </Button>
          <Button color="orange" onClick={this.handleClickLoad}>
            Load
          </Button>
          <Button onClick={this.handleClickLock}>
            {locked ? 'Unlock' : 'Lock'}
          </Button>
        </ButtonsContainer>
        <CanvasWidget className="diagram" engine={engine} />
      </>
    );
  }
}

export default App;
