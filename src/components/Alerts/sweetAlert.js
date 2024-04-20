import swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(swal);
const swalWithBootstrapButtons = MySwal.mixin({
    customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
});

export function mostraAlerta(mensaje, icono, foco) {

    MySwal.fire({

        title: mensaje,
        icon: icono, //success, info, error, warning
        confirmButtonText: 'Aceptar',
        customClass: {
            confirmButton: 'btn-primary', // Clases de Bootstrap para el botón de confirmación
        },
    });
}

export function mostraAlertaOk(mensaje, icono, foco) {
    MySwal.fire({

        title: mensaje,
        icon: 'success', //success, info, error, warning
        confirmButtonText: 'Aceptar',
        showConfirmButton: false,
        timer: 1500
    });
}
export function mostraAlertaPregunta(mensaje, icono, foco) {
    MySwal.fire({

        title: mensaje,
        icon: 'question', //success, info, error, warning
        confirmButtonText: 'Guardar',
        showConfirmButton: true,
        showCancelButton: true,
    });
    return MySwal
}
export function mostraAlertaError(mensaje, icono, foco) {
    MySwal.fire({

        title: mensaje,
        icon: 'error', //success, info, error, warning
        confirmButtonText: 'Aceptar',
        showConfirmButton: false,
        timer: 3000
    });
}
export function mostraAlertaWarning(mensaje, icono, foco) {
    MySwal.fire({

        title: mensaje,
        icon: 'warning', //success, info, error, warning
        confirmButtonText: 'Aceptar',
        showConfirmButton: false,
        timer: 3000
    });
}

export function mostraAlertaModificar(titulo, mensaje, peticion) {
    swalWithBootstrapButtons.fire({
        title: titulo,
        text: mensaje,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Modificar',
        cancelButtonText: 'Cancel!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            swalWithBootstrapButtons.fire(
                'Modificado',
                'Registro Modificado',
                'success'
            )
        } else if (
            /* Read more about handling dismissals below */
            result.dismiss === swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire(
                'Cancelled',
                'Your imaginary file is safe :)',
                'error'
            )
        }
    });
}

function onfocus(foco) {
    if (foco !== '') {
        document.getElementById(foco).focus();
    }
}