/**
 * Función que se encarga de crear la pantalla de la ruta
 */
function crearTuRuta(funcionAnterior){
    if(funcionAnterior !== null){
        // @ts-ignore
        Swal.fire({
            title: '¡Ruta guardada!',
            text: 'Se han guardado los eventos en Google Calendar',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    }
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
    if(eventos.length !== 0){
        let museo = museos.find(museo => museo.areaServed.name === eventos[0].lugar);
        $("main").append(mostrarTiempo(museo.areaServed.geo));
    }

    $("main").append(crearDiv("contenedor-ruta-general mt-5", "ctdRuta")
        .append(crearDiv("vl"))
        .append($("<ul>").addClass("section-ruta"))    
    ).append(crearDiv("guardar-calendar"));

    mostrarRuta();
    
    let eventosGeo = eventos.map(evento => {
        let museo = museos.find(museo => museo.areaServed.name === evento.lugar);
        return {lat: parseFloat(museo.areaServed.geo.latitude), lng: parseFloat(museo.areaServed.geo.longitude)};
    });
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

            // Calcular la hora de fin en función de la hora de inicio y la duración
            const horasSeleccionadas = horaInicioSplit.split(':');
            const duracionSeleccionada = duracion.split(' ');
            let horaFinCalculada = (parseInt(horasSeleccionadas[0]) + parseInt(duracionSeleccionada[0]))
            let minutosFinCalculado = (parseInt(horasSeleccionadas[1]) + parseInt(duracionSeleccionada[1]))
            if(minutosFinCalculado >= 60){
                minutosFinCalculado %= 60;
                horaFinCalculada++;

            }
            const horaFinC = horaFinCalculada.toString().padStart(2,"0");
            const minutosFinC = minutosFinCalculado.toString().padStart(2,"0");

            const horaFin = horaFinC + ':' + minutosFinC;

            // Crear el elemento de texto con la hora de inicio y fin
            const horasText = `${horaInicioSplit} - ${horaFin}`;
            // @ts-ignore
            const horasElement = crearP({
                clases: "horas",
                texto: horasText
            });

            // Agregar el texto y el círculo al div izquierdo
            divLeft.append(
                crearP({
                    clases: "horas",
                    texto: horasText
                }))
                .append(crearSpan("circ", ""));

            // Agregar el div izquierdo al elemento de lista
            li.append(divLeft);

            // Crear el div para la parte derecha
            const divRight = crearDiv("right-museo-ruta")
                .append(
                    crearDiv("parada-ruta museo-container")
                        .append($('<h5>').text(evento.lugar))
                        .append(crearBoton("", "", "no-style-button cruz-ruta")
                            .append(crearImg("img/svg/cruz.svg", "Símbolo de cruz para tachar un museo de la ruta", ""))
                            .on("click", () => {
                                eliminarMuseoRuta(index);
                                let eventosActualizado = recuperarVisitas();
                                let eventosGeo = eventosActualizado.map(evento => {
                                    let museo = museos.find(museo => museo.areaServed.name === evento.lugar);
                                    return {lat: parseFloat(museo.areaServed.geo.latitude), lng: parseFloat(museo.areaServed.geo.longitude)};
                                });
                                console.log(eventosGeo);
                                actualizarRouteMaps(eventosGeo);
                            })
                        )
                );

            // Crear el formulario para la duración
            const formulario = crearForm("", "formulario-ruta");

            // Crear el div para la hora de inicio
            const divInicio = crearDiv();
            const labelInicio = crearLabel("", "Inicio");
            const inputInicio = crearInput("time", "hora-inicio", "hora-inicio", horaInicioSplit, "hidden")
            .val(horaInicioSplit);

            // Agregar la etiqueta y el select al div de inicio
            divInicio.append(labelInicio);
            divInicio.append(inputInicio);

            // Agregar el div de inicio al formulario
            formulario.append(divInicio);

            // Crear el div para la duración
            const divDuracion = crearDiv();
            const labelDuracion = crearLabel("", "Duración"); // Crear la etiqueta para la duración
            const selectDuracion = crearSelect("", "", "duracion");
            
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
                    selectDuracion.append(
                        crearOption(
                            duracionText, 
                            duracionValue, 
                            duracionText === duracion
                        )
                    );
                } else {
                    break;
                }
            }

            contenedorRuta.append(li.append(
                    divRight.append(
                        formulario.append(
                            divDuracion.append(labelDuracion)
                            .append(selectDuracion)
                        )
                    )
                )
            ).append(descanso);

            // Evento change para los selects de inicio y duración
            inputInicio.on('blur', () => {
                const horaInicio = inputInicio.val();
                // @ts-ignore
                const duracionSeleccionada = selectDuracion.val().split(':');
                // @ts-ignore
                let horaFinCalculada = (parseInt(horaInicio.split(':')[0]) + parseInt(duracionSeleccionada[0]));
                // @ts-ignore
                let minutosFinCalculado = (parseInt(horaInicio.split(':')[1]) + parseInt(duracionSeleccionada[1]));
                if(minutosFinCalculado >= 60){
                    minutosFinCalculado %= 60;
                    horaFinCalculada++;

                }
                const horaFinC = horaFinCalculada.toString().padStart(2,"0");
                const minutosFinC = minutosFinCalculado.toString().padStart(2,"0");

                const horaFin = horaFinC + ':' + minutosFinC;
                // Obtener el índice del evento correspondiente
                const index = inputInicio.closest('li').data('index');

                let eventosActualizado = actualizarEventosMostrarRuta(index, horaInicio, horaFin);
                let eventosGeo = eventosActualizado.map(evento => {
                    let museo = museos.find(museo => museo.areaServed.name === evento.lugar);
                    return {lat: parseFloat(museo.areaServed.geo.latitude), lng: parseFloat(museo.areaServed.geo.longitude)};
                });
                actualizarRouteMaps(eventosGeo);
                
            });

            selectDuracion.on('change', () => {
                const duracion = selectDuracion.val();
                const horaInicio = inputInicio.val();
                // @ts-ignore
                const duracionSeleccionada = duracion.split(':');
                // @ts-ignore
                let horaFinCalculada = (parseInt(horaInicio.split(':')[0]) + parseInt(duracionSeleccionada[0]));
                // @ts-ignore
                let minutosFinCalculado = (parseInt(horaInicio.split(':')[1]) + parseInt(duracionSeleccionada[1]));
                if(minutosFinCalculado >= 60){
                    minutosFinCalculado %= 60;
                    horaFinCalculada++;

                }
                const horaFinC = horaFinCalculada.toString().padStart(2,"0");
                const minutosFinC = minutosFinCalculado.toString().padStart(2,"0");

                const horaFin = horaFinC + ':' + minutosFinC;

                // Obtener el índice del evento correspondiente
                const index = selectDuracion.closest('li').data('index');

                actualizarEventosMostrarRuta(index, null, horaFin);

                divLeft.find('.horas').text(`${horaInicio} - ${horaFin}`);
            });
        });

        // Verificar si el botón de guardar no está presente y añadirlo si no lo está
        let botonGuardar = $('.guardar-calendar button');
        if(botonGuardar.length === 0){
            const contenedorBoton = $('.guardar-calendar');

            // Insertar el botón después de la lista de eventos
            contenedorBoton.append(
                crearBoton("Añadir a calendar", "", "add-to-calendar-button boton boton-verde")
                    .on('click', handleAuthClick)
            );
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