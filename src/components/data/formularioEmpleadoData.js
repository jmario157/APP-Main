// formularioEmpleadoData.js
import { useState } from 'react';

const formularioEmpleadoData = {
  id: null,
  identidad: "",
  primernombre: "",
  segundonombre: "",
  primerapellido: "",
  segundoapellido: "",
  salario: "",
  fechaingreso: "",
  activo: true,
  Imagen: "https://th.bing.com/th/id/R.579240372b9ea8f56ac3cb39d4c02c82?rik=w4w6Dia1XQxGyg&pid=ImgRaw&r=0",
  cargoId: "",
};

export const useFormularioEmpleado = () => {
  const [formularioEmpleado, setFormularioEmpleado] = useState(formularioEmpleadoData);

  return {
    formularioEmpleado,
    setFormularioEmpleado,
  };
};

