function agregarPersona() {
    // Capturamos lo que el usuario escribió en la pantalla
    let nombreInput = $('#nombre').val();
    let apaternoInput = $('#apaterno').val();
    let amaternoInput = $('#amaterno').val();

    // VALIDACIÓN CORREGIDA: Se cambió 'apaterno' por 'apaternoInput'
    if(!nombreInput || !apaternoInput || !amaternoInput) {
        alert("Por favor, llena todos los campos.");
        return;
    }

    // El objeto coincide exactamente con los campos que espera la base de datos
    let nuevaPersona = {
        nombre: nombreInput,
        apellido_paterno: apaternoInput,
        apellido_materno: amaternoInput
    };

    $.ajax({
        url: 'https://aarizmendi.tesvg.com.mx/personas',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(nuevaPersona),
        success: function(resultado) {
            alert('Registro agregado con éxito');
            
            // LIMPIEZA CORREGIDA: Se usa '#amaterno' para coincidir con el input real
            $('#nombre').val('');
            $('#apaterno').val('');
            $('#amaterno').val('');
            
            getPeople();
        },
        error: function() {
            alert('Error al conectar con el servidor.');
        }
    });
}

function limpiar() {
    $('#personas').html("");
}

function eliminarPersona(personaId) {
    let url = 'https://aarizmendi.tesvg.com.mx/personas/' + personaId;
    
    $.ajax({
        url: url,
        type: 'DELETE',
        success: function(resultado) {
            limpiar();
            getPeople();
        },
        error: function(error) {
            console.error('Hubo un error al eliminar:', error);
            // ALERTA CORREGIDA: Se cambió "producto" por "persona"
            alert('No se pudo eliminar a la persona.');
        }
    });
}

function getPeople() {
    limpiar();
    
    $.ajax({
        url: 'https://aarizmendi.tesvg.com.mx/personas',
        cache: false,
        success: function(result) {
            // Recorremos el array devuelto por el microservicio
            $.each(result, function(index, persona) {
                // Construcción de las tarjetas de Bootstrap con los datos mapeados de la BD
                var itemHtml = `
                    <div class='col-12 col-sm-6 col-md-3'> 
                        <div class='card mb-4 text-muted shadow'>
                            <div class='card-body'>
                                <h5>Nombre: ${persona.nombre}</h5>
                                <h5>A. Paterno: ${persona.apellido_paterno}</h5>
                                <h5>A. Materno: ${persona.apellido_materno}</h5>
                            </div>
                            <div class='card-footer bg-white d-flex justify-content-end'>
                                <button class='btn btn-sm btn-outline-danger' onclick='eliminarPersona(${persona.id});'>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>`;
                
                // Lo inyectamos en el contenedor correspondiente
                $('#personas').append(itemHtml);
            });
        },
        error: function(error) {
            console.error('Error al obtener los registros:', error);
        }
    });
}
