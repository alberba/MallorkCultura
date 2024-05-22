/**
 * Función que se encarga de crear la pantalla de la ruta
 */
function crearTuRuta(funcionAnterior){
    // funcionAnterior será null si se ha querido guardar la ruta en Google Calendar
    if(funcionAnterior !== null){
        // @ts-ignore
        Swal.fire({
            title: '¡Ruta guardada!',
            text: 'Se han guardado los eventos en Google Calendar',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    }
    // Desplaza la vista al inicio
    window.scrollTo(0, 0);
    // Elimina el contenido del header y añade el nuevo. Esto se hace para que, en caso de estar la imagen 
    // de portada de la pantalla principal, se elimine
    $("header > div").remove();
    $("header").append(crearDiv("mapa-museo map-container")
        .append(crearDiv("ubi-header").attr("id","map"))
    );
    
    $("main").empty();
    $("main").attr("class","contenedor-principal ruta");
    $("main").append(crearBotonAtras("/", "Inicio"));
    $("main").append(crearH2("Tu ruta"))
        .append(crearHr);

    // Recoge los eventos guardados en el localStorage
    let eventos = recuperarVisitas();
    // Comprueba si hay eventos guardados
    if(eventos.length > 0){
        // Si hay eventos, se obtiene la fecha más futura. 
        // En caso de que no haya ninguna guardada, se pondrá la fecha de mañana
        let fechaMasFutura;
        let mañana = new Date();
        mañana.setDate(mañana.getDate() + 1);
        let fechaVisita = localStorage.getItem('fechaVisita');
        if(fechaVisita === null || new Date(fechaVisita).getTime() < new Date().getTime()){
            // Obtener la fecha del día siguiente
            fechaMasFutura = mañana.toISOString().split('T')[0];
            localStorage.setItem('fechaVisita', mañana.toISOString().split('T')[0]);
        } else {
            fechaMasFutura = fechaVisita;
        }

        // Crear input de fecha
        const divFecha = crearDiv("contenedor-fecha");
        const inputFecha = crearInput("date", "fecha-visita", "fecha-visita", "input-fecha");
        inputFecha.val(fechaMasFutura)
            .on('change', () => {
                const fecha = inputFecha.val()?.toString(); // Convert the value to a string
                // @ts-ignore
                localStorage.setItem('fechaVisita', fecha);
            });

        divFecha.append(inputFecha);
        $("main").append(divFecha);

        // Mostrar el tiempo en la ubicación de la primera visita
        let ubicacion = ubicaciones.find(ubicacion => {
            switch(eventos[0].tipo) {
                case "CivicStructure":
                case "MovieTheater":
                    return ubicacion.name === eventos[0].lugar;
                case "Service":
                    return ubicacion.areaServed.name === eventos[0].lugar;
            }
        });
        switch(eventos[0].tipo){
            case "CivicStructure":
            case "MovieTheater":
                $("main").append(mostrarTiempo(ubicacion.geo));
                break;
            case "Service":
                $("main").append(mostrarTiempo(ubicacion.areaServed.geo));
                break;
        }
    }

    // Crear el contenedor de la ruta
    $("main").append(crearDiv("contenedor-ruta-general mt-5", "ctdRuta")
        .append(crearDiv("vl"))
        .append($("<ul>").addClass("section-ruta"))    
    ).append(crearDiv("guardar-calendar"));

    mostrarRuta();

    // Prepara el mapa con los eventos de la ruta
    prepararMapaRuta(eventos);
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
        let botonGuardar = $('.guardar-calendar button');
        if(botonGuardar.length !== 0){
            botonGuardar.remove();
        }
        $("#fecha-visita").remove();
    } else {

        if(eventos.length > 1){
            if(comprobarSolapamiento(eventos))
                // @ts-ignore
                Swal.fire({
                    title: '¡Atención!',
                    text: 'Hay eventos que se solapan, por favor, modifica la duración de los eventos para que no se solapen',
                    icon: 'warning',
                    confirmButtonText: 'Aceptar'
                });
        }

        // Si hay eventos, mostrar cada uno en la lista
        eventos.forEach((evento, index) => {
            const duracion = calcularDuracionRuta(evento.horaInicio, evento.horaFin); // Calcular la duración del evento

            const li = $('<li>').addClass('parada-ruta').attr('data-index', index); // Crear un nuevo elemento de lista y establecer el índice del evento como atributo de datos

            const divLeft = $('<div>').addClass("left-museo-ruta"); // Crear un div para la parte izquierda

            const horaInicioSplit = evento.horaInicio.slice(0, 5); // Obtener la hora de inicio

            insertarRangoHorasTexto(divLeft, horaInicioSplit, duracion); // Insertar el rango de horas en el div izquierdo

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
                                // @ts-ignore
                                Swal.fire({
                                    title: "¿Estás seguro?",
                                    text: "No podrás recuperar revertir esta acción",
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#00B532",
                                    cancelButtonColor: "#d33",
                                    confirmButtonText: "Sí"
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        eliminarMuseoRuta(index);
                                        // @ts-ignore
                                        Swal.fire({
                                            title: "¡Eliminado!",
                                            text: "",
                                            icon: "success"
                                        });
                                    }
                                });
                                
                            })
                        )
                );

            // Crear el formulario para la duración
            const formulario = crearForm("", "formulario-ruta");

            
            const inputInicio = crearInput("time", "hora-inicio", "hora-inicio", "input-fecha")
            .val(horaInicioSplit);

            // Agregar el div de inicio al formulario
            formulario.append(crearDiv()
                .addClass("input-ubi-ruta")
                .append(crearLabel("", "Inicio"))
                .append(inputInicio));

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
                    formulario.append(crearDiv()
                        .addClass("input-ubi-ruta")
                        .append(crearLabel("", "Duración"))
                        .append(selectDuracion)
                    )
                )
            ));

            // Evento change para los selects de inicio y duración
            inputInicio.on('blur', () => {
                //Ha cambiado la hora de inicio

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
                    let museo = ubicaciones.find(museo => museo.areaServed.name === evento.lugar);
                    return {lat: parseFloat(museo.areaServed.geo.latitude), lng: parseFloat(museo.areaServed.geo.longitude)};
                });
                // Actualiza la ruta en caso de que sea necesario
                actualizarRouteMaps(eventosGeo);
                mostrarRuta();
                
            });

            // El valor de la duración ha cambiado, habrá que actualizar la hora de fin y la ruta en caso de que sea necesario
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

/**
 * Función que ordena los eventos en función de la hora de inicio
 */
function actualizarEventosMostrarRuta(index, horaInicio, horaFin){
    const visitas = recuperarVisitas();

    // Actualizar el evento correspondiente
    visitas[index].horaFin = horaFin + ':00';
    if(horaInicio != null){
        visitas[index].horaInicio = horaInicio + ':00';
        //ordenar los eventos
        visitas.sort((a, b) => {
            const horaInicioA = new Date(`1970-01-01T${a.horaInicio}`);
            const horaInicioB = new Date(`1970-01-01T${b.horaInicio}`);
            return horaInicioA.getTime() - horaInicioB.getTime();
        });
    }
    localStorage.setItem('visitas', JSON.stringify(visitas));
    return visitas;
}

/**
 * Función encargada de comprobar que no exista un solapamiento entre 2 eventos de la ruta. En tal caso, muestra un mensaje de advertencia
 * @param {Array<Object>} eventos Array de eventos de la ruta
 * @returns {Boolean} Devuelve true si hay solapamiento, false en caso contrario
 */
function comprobarSolapamiento(eventos){
    let eventosOrdenados = eventos.sort((a, b) => {
        const horaInicioA = new Date("1970-01-01T"+a.horaInicio);
        const horaInicioB = new Date("1970-01-01T"+b.horaInicio);
        return horaInicioA.getTime() - horaInicioB.getTime();
    });

    localStorage.setItem('visitas', JSON.stringify(eventosOrdenados));

    for(let i=1; i<eventosOrdenados.length; i++){
        let horaFinAnterior = new Date("1970-01-01T"+eventosOrdenados[i-1].horaFin);
        let horaInicioActual = new Date("1970-01-01T"+eventosOrdenados[i].horaInicio);

        if(horaFinAnterior.getTime() > horaInicioActual.getTime()){
            return true;
        }
    }

    return false;

}

/**
 * Función que se encarga de eliminar un museo de la ruta
 * @param {number} index 
 */
function eliminarMuseoRuta(index) {
    const eventos = recuperarVisitas();
    eventos.splice(index, 1); // Eliminar el evento correspondiente al índice
    localStorage.setItem('visitas', JSON.stringify(eventos)); // Actualizar el localStorage

    // Actualizar la ruta
    let eventosGeo = eventos.map(evento => {
        let ubicacion;
        switch(evento["tipo"]){
            case "CivicStructure":
            case "MovieTheater":
                ubicacion = ubicaciones.find(ubiAux => ubiAux.name === evento.lugar);
                return {lat: parseFloat(ubicacion.geo.latitude), lng: parseFloat(ubicacion.geo.longitude)};
            case "Service":
                ubicacion = ubicaciones.find(ubiAux => ubiAux.areaServed.name === evento.lugar);
                return {lat: parseFloat(ubicacion.areaServed.geo.latitude), lng: parseFloat(ubicacion.areaServed.geo.longitude)};
        }
    });
    actualizarRouteMaps(eventosGeo);
    mostrarRuta(); // Mostrar la ruta actualizada
}

/**
 *  Función para recuperar las visitas guardadas en el localStorage
 */ 
function recuperarVisitas() {
    const visitas = localStorage.getItem('visitas');
    return visitas ? JSON.parse(visitas) : [];
}

/**
 * Función encargada de calcular la hora inicio y la hora fin de un evento a partir de la hora de inicio y la duración
 * @param {JQuery<HTMLElement>} divLeft Contenedor donde se insertará el rango de horas
 * @param {String} horaInicioSplit Hora de inicio del evento
 * @param {String} duracion Duración del evento
 */
function insertarRangoHorasTexto(divLeft, horaInicioSplit, duracion) {
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

    // Agregar el texto y el círculo al div izquierdo
    divLeft.append(
        crearP({
            clases: "horas",
            texto: horasText
        }))
        .append(crearSpan("circ", ""));
}