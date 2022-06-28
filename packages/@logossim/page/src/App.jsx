import React, { Component } from 'react';
import Tooltip from 'react-tooltip';

import components, { groupedComponents } from '@logossim/components';
import {
  SimulationEngine,
  DiagramEngine,
  Diagram,
} from '@logossim/core';

import FileSaver from 'file-saver';

import {
  Titlebar,
  SimulationControlButtons,
  ComponentSelectButton,
  ComponentSelect,
  ComponentEdit,
  ContextMenus,
  HelpKeyboardShortcuts,
  LoadingExample,
  HelpAbout,
  Snackbar,
  Tour,
} from './ui-components';
import SelectCircuit from './ui-components/SelectCircuit/SelectCircuit';
import tourCircuit, {
  DIMENSIONS,
} from './ui-components/Tour/tourCircuit';

import './App.css';
import newCircuit from './newCircuit';

const DEFAULT_CIRCUIT_NAME = 'Untitled circuit';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSelectCircuitOpen: false,
      isComponentSelectOpen: false,
      isComponentEditOpen: false,
      isHelpKeyboardOpen: false,
      isHelpAboutOpen: false,
      componentEdit: null,
      isTourAvailable: false,
      isTourRunning: !JSON.parse(localStorage.getItem('tour-done')),
      isTourManualRun: false,
      circuitName: DEFAULT_CIRCUIT_NAME,
      circuitCreatedAt: null,
      isCircuitNameFocused: false,
      isLoadingExample: false,
      snackbar: {
        open: false,
        message: '',
        type: 'success',
        timeout: 0,
        timeoutID: null,
      },
    };

    this.diagram = new DiagramEngine(
      components,
      this.areShortcutsAllowed,
      this.showSnackbar,
    );
    this.simulation = new SimulationEngine(components);
  }

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const example = urlParams.get('example');

    if (example !== null) {
      this.loadExample(example);
    } else {
      this.setState({ isTourAvailable: true });
    }

    const { isTourRunning } = this.state;
    if (
      !isTourRunning &&
      window.location.hash !== '#app' &&
      example === null
    ) {
      this.showSelectCircuit();
    }

    window.addEventListener('keydown', this.shortcutHandler);
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
    const {
      isSelectCircuitOpen,
      isComponentSelectOpen,
      isComponentEditOpen,
      isHelpKeyboardOpen,
      isHelpAboutOpen,
      isCircuitNameFocused,
      isTourRunning,
    } = this.state;

    return !(
      isSelectCircuitOpen ||
      isComponentSelectOpen ||
      isComponentEditOpen ||
      isHelpKeyboardOpen ||
      isHelpAboutOpen ||
      isCircuitNameFocused ||
      isTourRunning
    );
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

  loadFile = file => {
    this.setState({
      circuitName: file.name,
      circuitCreatedAt: file.createdAt,
    });
    this.diagram.load(file.circuit);
  };

  loadExample = async name => {
    this.setState({ isLoadingExample: true });
    const response = await window.fetch(`./examples/${name}.lgsim`);
    const circuit = await response.json();
    this.loadFile(circuit);
    this.setState({ isLoadingExample: false });
  };

  shouldWarnUnload = () => {
    const lastSaved = JSON.parse(
      localStorage.getItem('last-saved-circuit'),
    );
    const file = this.generateFile();

    if (this.isCircuitEmpty(file.circuit)) return false;
    if (this.isCircuitEmpty(lastSaved?.circuit)) return false;

    return (
      JSON.stringify(lastSaved.circuit.layers) !==
      JSON.stringify(file.circuit.layers)
    );
  };

  unloadHandler = event => {
    if (this.shouldWarnUnload()) {
      if (this.simulation.isStopped()) {
        const file = this.generateFile();
        localStorage.setItem(
          'circuit-autosave',
          JSON.stringify(file),
        );
      }
      // eslint-disable-next-line no-param-reassign
      event.returnValue =
        'You have unsaved changes. Are you sure you want to leave?';
    }
  };

  generateFile = () => {
    const { circuitName, circuitCreatedAt } = this.state;
    const circuit = this.diagram.serialize();

    return {
      id: circuit.id,
      name: circuitName,
      createdAt: circuitCreatedAt || new Date(),
      updatedAt: new Date(),
      circuit,
    };
  };

  autoSave = () => {
    const file = this.generateFile();

    if (file.circuit.id === 'tour-circuit') return;
    if (this.isCircuitEmpty(file.circuit)) return;
    if (!this.simulation.isStopped()) return;

    localStorage.setItem('circuit-autosave', JSON.stringify(file));
  };

  getAutoSavedCircuit = () =>
    JSON.parse(localStorage.getItem('circuit-autosave'));

  hasAutoSavedCircuit = () =>
    !this.isCircuitEmpty(this.getAutoSavedCircuit()?.circuit);

  loadAutoSavedCircuit = () => {
    if (!this.hasAutoSavedCircuit()) return;
    this.loadFile(this.getAutoSavedCircuit());
  };

  loadNewCircuit = () => this.loadFile(newCircuit());

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

  handleCircuitNameChange = event => {
    event.stopPropagation();
    event.preventDefault();
    this.setState({ circuitName: event.target.value });
  };

  handleCircuitNameFocus = event => {
    this.setState({ isCircuitNameFocused: true });
    if (event.target.value === DEFAULT_CIRCUIT_NAME)
      event.target.select();
  };

  handleCircuitNameBlur = () =>
    this.setState({ isCircuitNameFocused: false });

  handleClickSave = () => {
    const { circuitCreatedAt } = this.state;
    if (!circuitCreatedAt)
      this.setState({ circuitCreatedAt: new Date() });

    const file = JSON.stringify(this.generateFile(), null, 2);
    const blob = new Blob([file], {
      type: 'application/json',
    });

    const { circuitName } = this.state;
    const filename = circuitName.replace(/[/|\\:*?"<>]/g, '');
    localStorage.setItem('last-saved-circuit', file);

    FileSaver.saveAs(blob, `${filename}.lgsim`);
  };

  handleClickLoad = () =>
    document.getElementById('file-input').click();

  handleFileLoad = event => {
    const {
      target: { files },
    } = event;

    if (files.length !== 1) return;

    const handleError = () =>
      this.showSnackbar(
        `Error loading circuit file:\n${files[0].name}`,
      );

    const fr = new FileReader();
    fr.onerror = handleError;
    fr.onload = e => {
      try {
        const file = JSON.parse(e.target.result);
        this.loadFile(file);
      } catch (exception) {
        handleError();
      }
    };
    fr.readAsText(files.item(0));
  };

  handleClickStart = () => {
    const serialized = JSON.stringify(this.diagram.serialize());
    localStorage.setItem('circuit-autosave', serialized);

    this.diagram.clearSelection();
    this.diagram.setLocked(true);

    this.simulation.start(this.diagram.getModel());
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

  setTourRunning = isTourRunning => {
    const { isTourManualRun } = this.state;
    if (
      !isTourRunning &&
      !isTourManualRun &&
      window.location.hash !== '#app'
    ) {
      this.showSelectCircuit();
    }
    this.setState({ isTourRunning, isTourManualRun: false });
  };

  showHelpTour = () =>
    this.setState({ isTourRunning: true, isTourManualRun: true });

  showSelectCircuit = () => {
    window.location.hash = '';
    this.setState({ isSelectCircuitOpen: true });
  };

  hideSelectCircuit = () => {
    this.setState({
      isSelectCircuitOpen: false,
      isTourAvailable: true,
    });
    window.location.hash = '#app';
  };

  showHelpKeyboard = () =>
    this.setState({ isHelpKeyboardOpen: true });

  hideHelpKeyboard = () =>
    this.setState({ isHelpKeyboardOpen: false });

  showHelpAbout = () => this.setState({ isHelpAboutOpen: true });

  hideHelpAbout = () => this.setState({ isHelpAboutOpen: false });

  showSnackbar = async (message, type = 'error') => {
    const { snackbar } = this.state;
    const timeout = 3000 + message.split(' ').length * 50;

    if (snackbar.open) {
      clearTimeout(snackbar.timeoutID);
      this.hideSnackbar();
      await new Promise(res => setTimeout(res, 500));
    }

    this.setState({
      snackbar: {
        open: true,
        message,
        type,
        timeout,
        timeoutID: setTimeout(this.hideSnackbar, timeout),
      },
    });
  };

  hideSnackbar = () => {
    const { snackbar } = this.state;
    clearTimeout(snackbar.timeoutID);

    this.setState(state => ({
      snackbar: {
        ...state.snackbar,
        open: false,
      },
    }));
  };

  handleLoadTourCircuit = () => {
    this.circuitBeforeTour = this.generateFile();
    this.loadFile(tourCircuit);
    this.handleCenterTourCircuitOffset();
  };

  handleUnloadTourCircuit = () => {
    if (!this.circuitBeforeTour) return;

    this.loadFile(this.circuitBeforeTour);
    this.circuitBeforeTour = null;
  };

  handleCenterTourCircuitOffset = () => {
    this.diagram
      .getModel()
      .setOffset(
        (window.innerWidth - DIMENSIONS.width) / 2,
        (window.innerHeight - DIMENSIONS.height) / 2,
      );
    this.diagram.realignGrid();
    this.diagram.repaint();
  };

  render() {
    const {
      isSelectCircuitOpen,
      isComponentSelectOpen,
      isComponentEditOpen,
      isHelpKeyboardOpen,
      isHelpAboutOpen,
      componentEdit,
      isTourAvailable,
      isTourRunning,
      circuitName,
      isCircuitNameFocused,
      isLoadingExample,
      snackbar,
    } = this.state;

    return (
      <>
        <Titlebar
          circuitName={circuitName}
          isCircuitNameFocused={isCircuitNameFocused}
          handleChangeCircuitName={this.handleCircuitNameChange}
          handleFocusCircuitName={this.handleCircuitNameFocus}
          handleBlurCircuitName={this.handleCircuitNameBlur}
          handleClickSave={this.handleClickSave}
          handleFileLoad={this.handleFileLoad}
          handleClickSelectCircuit={this.showSelectCircuit}
          handleClickKeyboardShortcuts={this.showHelpKeyboard}
          handleClickRedoTour={this.showHelpTour}
          handleClickAbout={this.showHelpAbout}
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

        <SelectCircuit
          isOpen={isSelectCircuitOpen}
          handleClose={this.hideSelectCircuit}
          handleNewCircuit={this.loadNewCircuit}
          handleClickLoad={this.handleClickLoad}
          handleLoadExample={this.loadExample}
          hasAutoSavedCircuit={this.hasAutoSavedCircuit()}
          handleLoadAutoSavedCircuit={this.loadAutoSavedCircuit}
          shouldWarnUnload={this.shouldWarnUnload}
        />
        <HelpKeyboardShortcuts
          isOpen={isHelpKeyboardOpen}
          handleClose={this.hideHelpKeyboard}
        />
        <HelpAbout
          isOpen={isHelpAboutOpen}
          handleClose={this.hideHelpAbout}
        />
        {isTourAvailable && (
          <Tour
            run={isTourRunning}
            setTourRunning={this.setTourRunning}
            loadCircuit={this.handleLoadTourCircuit}
            clearCircuit={this.handleUnloadTourCircuit}
            recenterCircuit={this.handleCenterTourCircuitOffset}
          />
        )}

        {isLoadingExample && <LoadingExample />}
        <Diagram engine={this.diagram} />

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

        <Tooltip id="tooltip" globalEventOff="click" />
        <Snackbar
          open={snackbar.open}
          type={snackbar.type}
          message={snackbar.message}
          timeout={snackbar.timeout}
          handleClose={this.hideSnackbar}
        />
      </>
    );
  }
}
