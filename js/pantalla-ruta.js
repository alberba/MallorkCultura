/**
 * Función que se encarga de crear la pantalla de la ruta
 */
function crearTuRuta(){
    window.scrollTo(0, 0);
    // Elimina el contenido del header y añade el nuevo. Esto se hace para que, en caso de estar la imagen 
    // de portada de la pantalla principal, se elimine
    $("header > div").remove();
    $("header").append(crearDiv("mapa-museo map-container")
        .append(crearDiv("ubi-header").attr("id","map"))
    );
    
    $("main").empty();
    $("main").attr("class","contenedor-principal ruta");
    $("main").append(crearBotonAtras(crearDondeVisitar, "Inicio"));
    $("main").append(crearH2("Tu ruta"))
        .append(crearHr);

    let eventos = recuperarVisitas();
    let museo = museos.find(museo => museo.areaServed.name === eventos[0].lugar);
    $("main").append(mostrarTiempo(museo.areaServed.geo));

    $("main").append(crearDiv("contenedor-ruta-general mt-5", "ctdRuta")
        .append(crearDiv("vl"))
        .append($("<ul>").addClass("section-ruta"))    
    ).append(crearDiv("guardar-calendar"));

    mostrarRuta();
    
    let eventosGeo = eventos.map(evento => {
        let museo = museos.find(museo => museo.areaServed.name === evento.lugar);
        console.log(museo);
        return {lat: parseFloat(museo.areaServed.geo.latitude), lng: parseFloat(museo.areaServed.geo.longitude)};
    });
    console.log(eventosGeo);
    initMap({position: centroMallorca,
        zoom: 9,
        arrPositionRoutes: eventosGeo
    })
}

/**
 * Función que se encarga de leer del webStorage y crea las componentes para mostrar la ruta al usuario
 * 
 */
function mostrarRuta() {
    const eventos = recuperarVisitas(); // Recuperar los eventos
    const contenedorRuta = $('.section-ruta'); // Obtener el contenedor de la ruta

    // Limpiar el contenido existente del contenedor
    contenedorRuta.empty();

    // Verificar si hay eventos
    if (eventos.length === 0) {
        // Si no hay eventos, mostrar un mensaje
        contenedorRuta.html('<p>Todavía no has empezado a diseñar tu ruta</p>');
        var botonGuardar = $('.guardar-calendar button');
        if(botonGuardar.length !== 0){
            botonGuardar.remove();
        }
    } else {
        // Si hay eventos, mostrar cada uno en la lista
        eventos.forEach((evento, index) => {
            const duracion = calcularDuracionRuta(evento.horaInicio, evento.horaFin); // Calcular la duración del evento
            const descanso = index === eventos.length - 1 ? '' : '<div><p class="descanso">Descanso: 1h</p></div>'; // Añadir un descanso si no es el último evento

            const li = $('<li>').addClass('parada-ruta').attr('data-index', index); // Crear un nuevo elemento de lista y establecer el índice del evento como atributo de datos

            const divLeft = $('<div>').addClass("left-museo-ruta"); // Crear un div para la parte izquierda

            const horaInicioSplit = evento.horaInicio.split('T')[1].slice(0, 5); // Obtener la hora de inicio
            const horaFinSplit = evento.horaFin.split('T')[1].slice(0, 5); // Obtener la hora de fin

            // Calcular la hora de fin en función de la hora de inicio y la duración
            const horasSeleccionadas = horaInicioSplit.split(':');
            const duracionSeleccionada = duracion.split(' ');
            let horaFinCalculada = (parseInt(horasSeleccionadas[0]) + parseInt(duracionSeleccionada[0]))
            let minutosFinCalculado = (parseInt(horasSeleccionadas[1]) + parseInt(duracionSeleccionada[1]))
            if(minutosFinCalculado == 60){
                minutosFinCalculado = 0;
                horaFinCalculada++;

            }
            const horaFinC = horaFinCalculada.toString().padStart(2,"0");
            const minutosFinC = minutosFinCalculado.toString().padStart(2,"0");

            const horaFin = horaFinC + ':' + minutosFinC;

            // Crear el elemento de texto con la hora de inicio y fin
            const horasText = `${horaInicioSplit} - ${horaFin}`;
            const horasElement = $('<p>').addClass("horas").text(horasText);

            // Crear un span para el círculo
            const circSpan = $('<span>').addClass('circ');

            // Agregar el texto y el círculo al div izquierdo
            divLeft.append(horasElement);
            divLeft.append(circSpan);

            // Agregar el div izquierdo al elemento de lista
            li.append(divLeft);

            // Crear el div para la parte derecha
            const divRight = $('<div>').addClass("right-museo-ruta");

            // Crear el div para el nombre del museo y el botón de eliminar
            const h5Container = $('<div>').addClass("parada-ruta museo-container");
            const h5 = $('<h5>').text(evento.lugar); // Crear el nombre del museo
            const botonEliminar = $('<button>').addClass('no-style-button cruz-ruta'); // Crear el botón de eliminar
            botonEliminar.attr('onclick', `eliminarMuseoRuta(${index})`); // Agregar el evento onclick al botón de eliminar
            const imgCruz = $('<img>').attr('src', 'img/svg/cruz.svg').attr('alt', 'Símbolo de cruz para tachar un museo de la ruta'); // Crear la imagen de la cruz
            botonEliminar.append(imgCruz); // Agregar la imagen de la cruz al botón de eliminar

            // Agregar el nombre del museo y el botón de eliminar al contenedor
            h5Container.append(h5);
            h5Container.append(botonEliminar);

            // Agregar el contenedor al div derecho
            divRight.append(h5Container);

            // Crear el formulario para la duración
            const formulario = $('<form>').addClass("formulario-ruta");

            // Crear el div para la hora de inicio
            const divInicio = $('<div>');
            const labelInicio = $('<label>').text("Inicio"); // Crear la etiqueta para la hora de inicio
            const selectInicio = $('<select>').addClass("inicio"); // Crear el select para la hora de inicio

            // Llenar el select con las opciones de hora de inicio
            for (let i = 0; i < 24; i++) {
                const hora = i.toString().padStart(2, '0');
                const optionInicio = $('<option>').text(`${hora}:00`).attr('value', hora + ':00').prop('selected', horaInicioSplit.split(':')[0] === hora && horaInicioSplit.split(':')[1] === '00');
                selectInicio.append(optionInicio);
                const optionInicio30 = $('<option>').text(`${hora}:30`).attr('value', hora + ':30').prop('selected', horaInicioSplit.split(':')[0] === hora && horaInicioSplit.split(':')[1] === '30');
                selectInicio.append(optionInicio30);
            }
            
            // Agregar la etiqueta y el select al div de inicio
            divInicio.append(labelInicio);
            divInicio.append(selectInicio);

            // Agregar el div de inicio al formulario
            formulario.append(divInicio);

            // Crear el div para la duración
            const divDuracion = $('<div>');
            const labelDuracion = $('<label>').text('Duración'); // Crear la etiqueta para la duración
            const selectDuracion = $('<select>').addClass("duracion"); // Crear el select para la duración

            // Llenar el select con las opciones de duración
            
            // Comprobar que la duración no sobrepase el día
            const horaInicioSplitHoras = parseInt(horaInicioSplit.split(':')[0]); // Obtener las horas de la hora de inicio
            const horaInicioSplitMinutos = parseInt(horaInicioSplit.split(':')[1]); // Obtener los minutos de la hora de inicio
            for (let i = 15; i <= 360; i += 15) {
                const horas = Math.floor(i / 60);
                const minutos = i % 60;
            
                if (
                    horaInicioSplitHoras + horas < 24 && // Verificar que la suma de las horas de inicio y las horas de duración no exceda las 24 horas
                    (horaInicioSplitHoras + horas < 23 || horaInicioSplitMinutos + minutos < 60) // Verificar que la suma de las horas de inicio y las horas de duración no exceda las 23:59 (última hora del día
                ) {
                    const duracionText = `${horas}h ${minutos}min`;
                    const duracionValue = horas.toString().padStart(2, '0') + ':' + minutos.toString().padStart(2, '0');
                    const optionDuracion = $('<option>').text(duracionText).attr('value', duracionValue);
                    if (duracionText === duracion) {
                        optionDuracion.prop('selected', true);
                    }
                    selectDuracion.append(optionDuracion);
                } else {
                    break;
                }
            }

            // Agregar la etiqueta y el select al div de duración
            divDuracion.append(labelDuracion);
            divDuracion.append(selectDuracion);

            // Agregar el div de duración al formulario
            formulario.append(divDuracion);

            // Agregar el formulario al div derecho
            divRight.append(formulario);

            // Agregar el div derecho al elemento de lista
            li.append(divRight);

            // Agregar el elemento de lista al contenedor de la ruta
            contenedorRuta.append(li);

            // Agregar el descanso al contenedor de la ruta
            contenedorRuta.append(descanso);

            // Evento change para los selects de inicio y duración
            selectInicio.on('change', function() {
                const horaInicio = $(this).val();
                const duracionSeleccionada = selectDuracion.val().split(':');
                let horaFinCalculada = (parseInt(horaInicio.split(':')[0]) + parseInt(duracionSeleccionada[0]))
                let minutosFinCalculado = (parseInt(horaInicio.split(':')[1]) + parseInt(duracionSeleccionada[1]))
                if(minutosFinCalculado == 60){
                    minutosFinCalculado = 0;
                    horaFinCalculada++;

                }
                const horaFinC = horaFinCalculada.toString().padStart(2,"0");
                const minutosFinC = minutosFinCalculado.toString().padStart(2,"0");

                const horaFin = horaFinC + ':' + minutosFinC;

                // Obtener el índice del evento correspondiente
                const index = $(this).closest('li').data('index');

                actualizarEventosMostrarRuta(index, horaInicio, horaFin);
            });

            selectDuracion.on('change', function() {
                const duracion = $(this).val();
                const horaInicio = selectInicio.val();
                const duracionSeleccionada = duracion.split(':');
                let horaFinCalculada = (parseInt(horaInicio.split(':')[0]) + parseInt(duracionSeleccionada[0]));
                let minutosFinCalculado = (parseInt(horaInicio.split(':')[1]) + parseInt(duracionSeleccionada[1]));
                if(minutosFinCalculado == 60){
                    minutosFinCalculado = 0;
                    horaFinCalculada++;

                }
                const horaFinC = horaFinCalculada.toString().padStart(2,"0");
                const minutosFinC = minutosFinCalculado.toString().padStart(2,"0");

                const horaFin = horaFinC + ':' + minutosFinC;

                // Obtener el índice del evento correspondiente
                const index = $(this).closest('li').data('index');

                actualizarEventosMostrarRuta(index, null, horaFin);

                divLeft.find('.horas').text(`${horaInicio} - ${horaFin}`);
            });
        });

        // Verificar si el botón de guardar no está presente y añadirlo si no lo está
        var botonGuardar = $('.guardar-calendar button');
        if(botonGuardar.length === 0){
            const contenedorBoton = $('.guardar-calendar');

            botonGuardar = $('<button></button>').text('Añadir a calendar').addClass('add-to-calendar-button boton boton-verde');
            botonGuardar.attr('onclick', 'handleAuthClick()');

            // Insertar el botón después de la lista de eventos
            contenedorBoton.append(botonGuardar);
        }
    }
}

// Función para eliminar un museo de la ruta
function eliminarMuseoRuta(index) {
    const eventos = recuperarVisitas();
    eventos.splice(index, 1); // Eliminar el evento correspondiente al índice
    localStorage.setItem('visitas', JSON.stringify(eventos)); // Actualizar el localStorage
    mostrarRuta(); // Mostrar la ruta actualizada
}

// Función para recuperar las visitas guardadas en el localStorage
function recuperarVisitas() {
    const visitas = localStorage.getItem('visitas');
    return visitas ? JSON.parse(visitas) : [];
}

// Función para guardar la ruta en el calendario
function guardarRuta(){
    alert("CHECKPOINT 1, se ha autorizado el uso de Google Calendar");
    crearEventosCalendario();
    alert("CHECKPOINT 2, se han creado los eventos en Google Calendar");
}