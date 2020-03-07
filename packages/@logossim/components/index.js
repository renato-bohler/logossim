import And from './And/AndRegister';
import Or from './Or/OrRegister';
import Button from './Button/ButtonRegister';

const components = [And, Or, Button];

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
