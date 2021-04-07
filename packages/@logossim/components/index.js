import And from './And/AndRegister';
import Buffer from './Buffer/BufferRegister';
import Button from './Button/ButtonRegister';
import Buzzer from './Buzzer/BuzzerRegister';
import Clock from './Clock/ClockRegister';
import ControlledBuffer from './ControlledBuffer/ControlledBufferRegister';
import ControlledInverter from './ControlledInverter/ControlledInverterRegister';
import Counter from './Counter/CounterRegister';
import Demux from './Demux/DemuxRegister';
import Ground from './Ground/GroundRegister';
import Input from './Input/InputRegister';
import Joiner from './Joiner/JoinerRegister';
import Led from './Led/LedRegister';
import Mux from './Mux/MuxRegister';
import Nand from './Nand/NandRegister';
import Nor from './Nor/NorRegister';
import Not from './Not/NotRegister';
import Or from './Or/OrRegister';
import Output from './Output/OutputRegister';
import Power from './Power/PowerRegister';
import Ram from './Ram/RamRegister';
import Rom from './Rom/RomRegister';
import Splitter from './Splitter/SplitterRegister';
import Ssd from './Ssd/SsdRegister';
import Switch from './Switch/SwitchRegister';
import Xnor from './Xnor/XnorRegister';
import Xor from './Xor/XorRegister';

const components = [
  Input,
  Output,
  Button,
  Switch,
  Clock,
  Led,
  Ssd,
  Buzzer,
  And,
  Nand,
  Or,
  Nor,
  Xor,
  Xnor,
  Buffer,
  Not,
  ControlledBuffer,
  ControlledInverter,
  Splitter,
  Joiner,
  Power,
  Ground,
  Mux,
  Demux,
  Ram,
  Rom,
  Counter,
];

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
