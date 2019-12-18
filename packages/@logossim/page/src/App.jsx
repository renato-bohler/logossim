import React, { Component } from 'react';
import { DiagramEngine, Diagram } from '@logossim/core';
import components from '@logossim/components';

import Buttons from './ui-components/Buttons/Buttons';
import ComponentSelect from './ui-components/ComponentSelect/ComponentSelect';

import defaultCircuit from './defaultCircuit';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.diagram = new DiagramEngine(components);
    this.diagram.load(defaultCircuit);
    this.state = {
      circuit: undefined,
      isComponentSelectOpen: false,
    };
  }

  handleClickSave = () => {
    const serialized = this.diagram.serialize();
    this.setState({ circuit: serialized });
    console.log(serialized);
  };

  handleClickLoad = () => {
    const { circuit } = this.state;

    if (!circuit) {
      window.alert('No circuit has been saved yet');
      return;
    }

    this.diagram.load(circuit);
  };

  handleClickLock = () =>
    this.diagram.setLocked(!this.diagram.isLocked());

  handleClickMenu = () =>
    this.setState(state => ({
      isComponentSelectOpen: !state.isComponentSelectOpen,
    }));

  render() {
    const { isComponentSelectOpen } = this.state;

    return (
      <>
        <Buttons
          handleClickSave={this.handleClickSave}
          handleClickLoad={this.handleClickLoad}
          handleClickLock={this.handleClickLock}
          isLocked={this.diagram.isLocked()}
        />
        <ComponentSelect
          open={isComponentSelectOpen}
          handleClickMenu={this.handleClickMenu}
          engine={this.diagram.getEngine()}
          components={components}
        />
        <Diagram engine={this.diagram.getEngine()} />
      </>
    );
  }
}

export default App;
