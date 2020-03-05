import React, { Component } from 'react';

import {
  DiagramEngine,
  Diagram,
  SimulationWorker,
} from '@logossim/core';
import components from '@logossim/components';

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

    this.groups = this.groupComponents();

    this.simulation = new SimulationWorker();
  }

  componentDidMount() {
    this.simulation.addCallback(this.handleSimulation);
    this.simulation.stop();
  }

  componentWillUnmount() {
    this.simulation.removeCallback(this.handleSimulation);
  }

  handleSimulation = message => {
    // TODO: test setting layer.allowRepaint to false and then true
    console.log('TODO: handle simulation', message.data);
    this.forceUpdate();
  };

  groupComponents = () =>
    components.reduce((acc, component) => {
      const group = acc.find(g => g.name === component.group);

      if (group) group.components.push(component);
      else
        acc.push({ name: component.group, components: [component] });

      return acc;
    }, []);

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
    this.diagram.setLocked(true);
    this.forceUpdate();

    this.simulation.start();
  };

  handleClickPause = () => {
    this.simulation.pause();
  };

  handleClickStop = () => {
    this.simulation.stop();
    this.diagram.setLocked(false);
    this.forceUpdate();
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
          state={this.simulation.getRunState()}
          handleClickStart={this.handleClickStart}
          handleClickPause={this.handleClickPause}
          handleClickStop={this.handleClickStop}
        />
        <ComponentSelectButton handleClick={this.showAddComponent} />
        <ComponentSelect
          isOpen={isComponentSelectOpen}
          groups={this.groups}
          handleClose={this.hideAddComponent}
          handleComponentDrop={this.diagram.handleComponentDrop}
        />
        <Diagram engine={this.diagram} />
      </>
    );
  }
}
