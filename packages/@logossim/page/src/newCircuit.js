import { v4 as uuid } from 'uuid';

const newCircuit = () => {
  const circuitId = uuid();
  const now = new Date().toISOString();

  return {
    id: circuitId,
    name: 'Untitled circuit',
    createdAt: now,
    updatedAt: now,
    circuit: {
      id: circuitId,
      locked: false,
      offsetX: 0,
      offsetY: 0,
      zoom: 100,
      gridSize: 15,
      layers: [
        {
          id: uuid(),
          type: 'diagram-links',
          isSvg: true,
          transformed: true,
          models: {},
        },
        {
          id: uuid(),
          type: 'diagram-nodes',
          isSvg: false,
          transformed: true,
          models: {},
        },
      ],
    },
  };
};

export default newCircuit;
