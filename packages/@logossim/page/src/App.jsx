import React, { Component } from 'react';
import styled from 'styled-components';
import { DiagramEngine, Diagram } from '@logossim/core';
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

    this.diagram = new DiagramEngine(components);
    this.diagram.load(defaultCircuit);
    this.state = {
      circuit: undefined,
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

  render() {
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
            {this.diagram.isLocked() ? 'Unlock' : 'Lock'}
          </Button>
        </ButtonsContainer>
        <Diagram engine={this.diagram.getEngine()} />
      </>
    );
  }
}

export default App;
