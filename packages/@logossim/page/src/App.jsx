import React, { Component } from 'react';
import styled from 'styled-components';
import Tooltip from 'react-tooltip';
import { Menu, Item, Separator, Submenu } from 'react-contexify';

import {
  SimulationEngine,
  DiagramEngine,
  Diagram,
} from '@logossim/core';
import components, { groupedComponents } from '@logossim/components';

import {
  DiagramStateButtons,
  SimulationControlButtons,
  ComponentSelectButton,
  ComponentSelect,
} from './ui-components';
import {
  ArrowRight,
  Clone,
  Copy,
  Paste,
  RotateClockwise,
  RotateCounterclockwise,
  Settings,
} from './ui-components/Icons';

import './App.css';
import 'react-contexify/dist/ReactContexify.min.css';

const MenuIconContainer = styled.div`
  display: flex;
  align-items: center;

  width: 16px;
  height: 16px;
  margin-right: 16px;
`;

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isComponentSelectOpen: false,
    };

    this.diagram = new DiagramEngine(components);
    this.simulation = new SimulationEngine(components);
  }

  synchronizeSimulation = () => {
    const diff = this.simulation.getDiff();

    // Handles components diff
    Object.entries(diff.components).forEach(([id, componentDiff]) =>
      this.diagram.synchronizeComponent(id, componentDiff),
    );

    // Handles link value diff
    Object.entries(diff.links).forEach(([id, value]) =>
      this.diagram.synchronizeLink(id, value),
    );

    this.simulation.clearDiff();
    this.diagram.repaint();
  };

  renderSimulation = () => {
    if (!this.simulation.isRunning()) return;

    this.synchronizeSimulation();

    requestAnimationFrame(this.renderSimulation);
  };

  handleClickSave = () => {
    const serialized = JSON.stringify(this.diagram.serialize());
    localStorage.setItem('circuit', serialized);
    console.log(JSON.parse(serialized));
  };

  handleClickLoad = () => {
    const circuit = localStorage.getItem('circuit');
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

    this.simulation.start(this.diagram.getEngine().getModel());
    this.renderSimulation();
  };

  handleClickPause = () => {
    this.simulation.pause();
    this.forceUpdate();
  };

  handleClickStop = async () => {
    await this.simulation.stop();
    this.diagram.clearAllValues();
    this.diagram.setLocked(false);
    this.forceUpdate();
    this.simulation.clearDiff();
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
          disabled={!this.simulation.isStopped()}
        />
        <SimulationControlButtons
          state={this.simulation.getState()}
          handleClickStart={this.handleClickStart}
          handleClickPause={this.handleClickPause}
          handleClickStop={this.handleClickStop}
        />
        <ComponentSelectButton
          handleClick={this.showAddComponent}
          disabled={!this.simulation.isStopped()}
        />
        <ComponentSelect
          isOpen={isComponentSelectOpen}
          groups={groupedComponents}
          handleClose={this.hideAddComponent}
          handleComponentDrop={this.diagram.handleComponentDrop}
        />
        <Diagram engine={this.diagram} />
        <Tooltip id="tooltip" globalEventOff="click" />
        <Menu id="component">
          <Item onClick={console.log}>
            <MenuIconContainer>
              <Clone size={16} />
            </MenuIconContainer>
            Clone
          </Item>
          <Item onClick={console.log}>
            <MenuIconContainer>
              <Copy size={16} />
            </MenuIconContainer>
            Copy
          </Item>
          <Item onClick={console.log}>
            <MenuIconContainer>
              <Paste size={16} />
            </MenuIconContainer>
            Paste
          </Item>
          <Separator />
          <Submenu
            label={
              <div style={{ display: 'flex' }}>
                <MenuIconContainer />
                Rotate
              </div>
            }
            arrow={<ArrowRight size={10} />}
          >
            <Item onClick={console.log}>
              <MenuIconContainer>
                <RotateClockwise size={16} />
              </MenuIconContainer>
              Clockwise
            </Item>
            <Item onClick={console.log}>
              <MenuIconContainer>
                <RotateCounterclockwise size={16} />
              </MenuIconContainer>
              Counterclockwise
            </Item>
          </Submenu>
          <Item onClick={console.log}>
            <MenuIconContainer>
              <Settings size={16} />
            </MenuIconContainer>
            Configurations...
          </Item>
        </Menu>
      </>
    );
  }
}
