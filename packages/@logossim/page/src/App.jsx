import React, { Component } from 'react';

import { DiagramEngine, Diagram } from '@logossim/core';
import components from '@logossim/components';

import DiagramStateButtons from './ui-components/Buttons/DiagramStateButtons';
import ComponentAddButton from './ui-components/Buttons/ComponentAddButton';
import DroppableLayer from './ui-components/ComponentSelect/DroppableLayer';
import ComponentAdd from './ui-components/ComponentSelect/ComponentAdd';

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
      isComponentAddOpen: true,
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
      isComponentAddOpen: true,
    });

  hideAddComponent = () =>
    this.setState({
      isComponentAddOpen: false,
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
    const { isComponentAddOpen } = this.state;

    return (
      <>
        <DiagramStateButtons
          handleClickSave={this.handleClickSave}
          handleClickLoad={this.handleClickLoad}
          handleClickLock={this.handleClickLock}
          isLocked={this.diagram.isLocked()}
        />
        <ComponentAddButton handleClick={this.showAddComponent} />
        <ComponentAdd
          isOpen={isComponentAddOpen}
          handleClose={this.hideAddComponent}
          groups={this.groups}
        />
        <DroppableLayer
          handleClickMenu={this.handleClickMenu}
          handleComponentDrop={this.handleComponentDrop}
        >
          <Diagram engine={this.diagram.getEngine()} />
        </DroppableLayer>
      </>
    );
  }
}

export default App;
