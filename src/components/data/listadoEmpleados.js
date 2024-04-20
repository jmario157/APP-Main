import { useState } from 'react';

export const DataEstadoCompartido = () => {
  const [data, setData] = useState(null);

  return [data, setData];
};

export default DataEstadoCompartido;