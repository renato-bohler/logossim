import React, { Component } from 'react';
import Tooltip from 'react-tooltip';

import {
  DiagramEngine,
  Diagram,
  SimulationWorker,
} from '@logossim/core';
import components, { groupedComponents } from '@logossim/components';

import DiagramStateButtons from './ui-components/Buttons/DiagramStateButtons';
import SimulationControlButtons from './ui-components/Buttons/SimulationControlButtons';
import ComponentSelectButton from './ui-components/Buttons/ComponentSelectButton';
import ComponentSelect from './ui-components/ComponentSelect/ComponentSelect';

import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.diagram = new DiagramEngine(components);
    this.state = {
      circuit: undefined,
      isComponentSelectOpen: false,
    };

    this.simulation = new SimulationWorker();
    this.diff = {};
  }

  componentDidMount() {
    this.simulation.addCallback(this.handleSimulation);
    this.simulation.stop();
  }

  componentWillUnmount() {
    this.simulation.removeCallback(this.handleSimulation);
  }

  handleSimulation = ({ data: diff }) => {
    this.diff = { ...this.diff, ...diff };
  };

  applySimulationDiff = () => {
    Object.entries(this.diff).forEach(([id, value]) =>
      this.diagram.getLink(id).setValue(value),
    );

    this.diagram.repaint();
  };

  renderSimulation = () => {
    if (this.simulation.getState() !== 'started') return;

    this.applySimulationDiff();

    requestAnimationFrame(this.renderSimulation);
  };

  handleClickSave = () => {
    const serialized = JSON.stringify(this.diagram.serialize());
    this.setState({ circuit: serialized });
    console.log(JSON.parse(serialized));
  };

  handleClickLoad = () => {
    const { circuit } = this.state;

    if (!circuit) {
      window.alert('No circuit has been saved yet');
      return;
    }

    this.diagram.load(JSON.parse(circuit));
  };

  handleClickStart = () => {
    this.diagram.clearSelection();
    this.diagram.setLocked(true);
    this.forceUpdate();

    this.simulation.start(JSON.stringify(this.diagram.serialize()));
    this.renderSimulation();
  };

  handleClickPause = () => {
    this.simulation.pause();
    this.forceUpdate();
  };

  handleClickStop = async () => {
    await this.simulation.stop();
    this.diagram.setLocked(false);
    this.applySimulationDiff();
    this.forceUpdate();
    this.diff = {};
  };

  showAddComponent = () =>
    this.setState({
      isComponentSelectOpen: true,
    });

  hideAddComponent = () =>
    this.setState({
      isComponentSelectOpen: false,
    });

  render() {
    const { isComponentSelectOpen } = this.state;

    return (
      <>
        <DiagramStateButtons
          handleClickSave={this.handleClickSave}
          handleClickLoad={this.handleClickLoad}
        />
        <SimulationControlButtons
          state={this.simulation.getState()}
          handleClickStart={this.handleClickStart}
          handleClickPause={this.handleClickPause}
          handleClickStop={this.handleClickStop}
        />
        <ComponentSelectButton handleClick={this.showAddComponent} />
        <ComponentSelect
          isOpen={isComponentSelectOpen}
          groups={groupedComponents}
          handleClose={this.hideAddComponent}
          handleComponentDrop={this.diagram.handleComponentDrop}
        />
        <Diagram engine={this.diagram} />
        <Tooltip id="tooltip" globalEventOff="click" />
      </>
    );
  }
}
