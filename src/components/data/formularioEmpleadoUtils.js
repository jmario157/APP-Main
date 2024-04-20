import axios from 'axios';

export const handleChange = (event, formularioEmpleado, setFormularioEmpleado) => {
    setFormularioEmpleado({
      ...formularioEmpleado,
      [event.target.name]: event.target.value,
    });
  };
export  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:4001/api/empleados/listar");
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };


  export const handleModificar = (formularioEmpleado, apiUrl) => {
    // verificar
    if (formularioEmpleado.primernombre === '') {
      console.log('Por favor, complete todos los campos');
      alert('Por favor, seleccione un registro de la tabla');
      return;
    }
  
    axios
      .put(
        `${apiUrl}/empleados/editar/?id=${formularioEmpleado.id}`,
        formularioEmpleado
      )
      .then((response) => {
        // La petición ha sido exitosa
        console.log('Respuesta:', response.data);
        alert(response.data.msj);
      })
      .catch((error) => {
        // Ha ocurrido un error,
        console.error('Error:', error);
        alert(error);
      });
  };
  
  export const handleInputChange = (event, formularioEmpleado, setFormularioEmpleado) => {
    handleChange(event, formularioEmpleado, setFormularioEmpleado);
  };

  export const limpiarCampos = (setFormularioEmpleado) => {
    setFormularioEmpleado({
      id: null,
      identidad: "",
      primernombre: "",
      segundonombre: "",
      primerapellido: "",
      segundoapellido: "",
      salario: "",
      fechaingreso: "",
      activo: "",
      Imagen: "",
      cargoId: "",
      // Reinicia los demás campos a su valor inicial
    });
  };

  export const handleRowClick = (empleado, setFormularioEmpleado) => {
    setFormularioEmpleado({
      id: empleado.id,
      identidad: empleado.identidad,
      primernombre: empleado.primernombre,
      segundonombre: empleado.segundonombre,
      primerapellido: empleado.primerapellido,
      segundoapellido: empleado.segundoapellido,
      salario: empleado.salario,
      fechaingreso: empleado.fechaingreso,
      activo: empleado.activo,
      Imagen: empleado.Imagen,
      cargoId: empleado.cargoId,
    });
  };

