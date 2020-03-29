import And from './And/AndRegister';
import Nand from './Nand/NandRegister';
import Or from './Or/OrRegister';
import Xor from './Xor/XorRegister';
import Button from './Button/ButtonRegister';
import Buffer from './Buffer/BufferRegister';
import Clock from './Clock/ClockRegister';

const components = [And, Nand, Or, Xor, Buffer, Button, Clock];

export default components;

export const groupedComponents = components.reduce(
  (acc, component) => {
    const group = acc.find(g => g.name === component.group);

    if (group) group.components.push(component);
    else acc.push({ name: component.group, components: [component] });

    return acc;
  },
  [],
);
