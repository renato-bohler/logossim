import React, { Component } from 'react';

import { DiagramEngine, Diagram } from '@logossim/core';
import components from '@logossim/components';

import DiagramStateButtons from './ui-components/Buttons/DiagramStateButtons';
import ComponentSelectButton from './ui-components/Buttons/ComponentSelectButton';
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
      // TODO: revert to false
      isComponentSelectOpen: true,
    };

    this.groups = this.groupComponents();
  }

  groupComponents = () =>
    components.reduce((acc, component) => {
      const group = acc.find(g => g.name === component.group);

      if (group) group.components.push(component);
      else
        acc.push({ name: component.group, components: [component] });

      return acc;
    }, []);

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

  handleClickLock = () => {
    this.diagram.setLocked(!this.diagram.isLocked());
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

  handleComponentDrop = (event, component) => {
    const { Model } = components.find(c => c.type === component.type);

    const point = this.diagram.getRelativeMousePoint(event);

    const model = new Model(component.type);
    model.setPosition(point);

    this.diagram.addComponent(model);
    this.diagram.repaint();
  };

  render() {
    const { isComponentSelectOpen } = this.state;

    return (
      <>
        <DiagramStateButtons
          handleClickSave={this.handleClickSave}
          handleClickLoad={this.handleClickLoad}
          handleClickLock={this.handleClickLock}
          isLocked={this.diagram.isLocked()}
        />
        <ComponentSelectButton handleClick={this.showAddComponent} />
        <ComponentSelect
          isOpen={isComponentSelectOpen}
          handleClose={this.hideAddComponent}
          groups={this.groups}
        />
        <Diagram engine={this.diagram.getEngine()} />
      </>
    );
  }
}

export default App;
