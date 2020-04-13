import React, { Component } from 'react';
import Tooltip from 'react-tooltip';

import components, { groupedComponents } from '@logossim/components';
import {
  SimulationEngine,
  DiagramEngine,
  Diagram,
} from '@logossim/core';

import {
  DiagramStateButtons,
  SimulationControlButtons,
  ComponentSelectButton,
  ComponentSelect,
  ComponentEdit,
  ContextMenus,
} from './ui-components';

import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isComponentSelectOpen: false,
      isComponentEditOpen: false,
      componentEdit: null,
    };

    this.diagram = new DiagramEngine(
      components,
      this.areShortcutsAllowed,
    );
    this.simulation = new SimulationEngine(components);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.shortcutHandler);
    window.addEventListener('load', this.loadHandler);
    window.addEventListener('beforeunload', this.unloadHandler);

    this.autoSaveInterval = setInterval(this.autoSave, 15000);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.shortcutHandler);
    window.addEventListener('load', this.loadHandler);
    window.removeEventListener('beforeunload', this.unloadHandler);

    clearInterval(this.autoSaveInterval);
  }

  areShortcutsAllowed = () => {
    const { isComponentSelectOpen, isComponentEditOpen } = this.state;
    return !(isComponentSelectOpen || isComponentEditOpen);
  };

  shortcutHandler = event => {
    const { ctrlKey, shiftKey, code } = event;

    if (!this.areShortcutsAllowed()) return;

    // Add component
    if (ctrlKey && code === 'KeyA') {
      event.preventDefault();
      if (!this.simulation.isStopped()) return;

      this.showAddComponent();
    }

    // Component configuration
    if (ctrlKey && code === 'KeyE') {
      event.preventDefault();
      if (!this.simulation.isStopped()) return;

      const selectedNodes = this.diagram.getSelectedNodes();
      if (selectedNodes.length !== 1) return;
      const node = selectedNodes[0];
      this.showEditComponent(node);
    }

    // Play/pause toggle simulation
    if (!ctrlKey && code === 'Space') {
      event.preventDefault();
      if (this.simulation.isRunning()) this.handleClickPause();
      else this.handleClickStart();
    }

    // Stop simulation
    if ((ctrlKey && code === 'Space') || code === 'Escape') {
      event.preventDefault();

      if (!this.simulation.isStopped()) this.handleClickStop();
    }

    // Save circuit
    if (ctrlKey && !shiftKey && code === 'KeyS') {
      event.preventDefault();
      this.handleClickSave();
    }

    // Load circuit
    if (
      (ctrlKey && code === 'KeyL') ||
      (ctrlKey && shiftKey && code === 'KeyS')
    ) {
      event.preventDefault();
      this.handleClickLoad();
    }
  };

  isCircuitEmpty = circuit => {
    if (!circuit) return true;

    return Object.keys(circuit.layers[1].models).length === 0;
  };

  loadHandler = () => {
    const lastSaved = JSON.parse(
      localStorage.getItem('circuit-autosave'),
    );

    if (this.isCircuitEmpty(lastSaved)) return;

    const reload = window.confirm('Reload last unsaved circuit?');
    if (reload) this.diagram.load(lastSaved);
    else localStorage.removeItem('circuit-autosave');
  };

  shouldWarnUnload = (currentCircuit, lastSavedCircuit) => {
    if (this.isCircuitEmpty(currentCircuit)) return false;

    return (
      JSON.stringify(lastSavedCircuit.layers) !==
      JSON.stringify(currentCircuit.layers)
    );
  };

  unloadHandler = event => {
    const lastSaved = JSON.parse(localStorage.getItem('circuit'));
    const current = this.diagram.serialize();

    if (this.shouldWarnUnload(current, lastSaved)) {
      if (this.simulation.isStopped()) {
        localStorage.setItem(
          'circuit-autosave',
          JSON.stringify(current),
        );
      }
      // eslint-disable-next-line no-param-reassign
      event.returnValue =
        'You have unsaved changes. Sure you want to leave?';
    }
  };

  autoSave = () => {
    const circuit = this.diagram.serialize();

    if (this.isCircuitEmpty(circuit)) return;
    if (!this.simulation.isStopped()) return;

    localStorage.setItem('circuit-autosave', JSON.stringify(circuit));
  };

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
    const serialized = JSON.stringify(this.diagram.serialize());
    localStorage.setItem('circuit-autosave', serialized);

    this.diagram.clearSelection();
    this.diagram.setLocked(true);

    this.simulation.start(this.diagram.getEngine().getModel());
    this.renderSimulation();
    this.forceUpdate();
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

  showEditComponent = componentEdit => {
    this.diagram.clearSelection();

    this.setState({
      isComponentEditOpen: true,
      componentEdit,
    });
  };

  hideEditComponent = () =>
    this.setState({
      isComponentEditOpen: false,
      componentEdit: null,
    });

  render() {
    const {
      isComponentSelectOpen,
      isComponentEditOpen,
      componentEdit,
    } = this.state;

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
        <ComponentEdit
          isOpen={isComponentEditOpen}
          components={components}
          component={componentEdit}
          handleClose={this.hideEditComponent}
          handleComponentEdit={this.diagram.handleComponentEdit}
        />
        <Diagram engine={this.diagram} />
        <Tooltip id="tooltip" globalEventOff="click" />
        <ContextMenus
          duplicateSelected={this.diagram.duplicateSelected}
          cutSelected={this.diagram.cutSelected}
          copySelected={this.diagram.copySelected}
          pasteSelected={this.diagram.pasteSelected}
          deleteSelected={this.diagram.deleteSelected}
          undo={this.diagram.undo}
          redo={this.diagram.redo}
          zoomIn={this.diagram.zoomIn}
          zoomOut={this.diagram.zoomOut}
          configureComponent={this.showEditComponent}
        />
      </>
    );
  }
}
