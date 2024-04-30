/**
 * Función que genera el contenido de la sección tiempo de la página ruta
 * @param {String} pueblo Pueblo del que se quiere obtener el tiempo
 * @returns {JQuery<HTMLElement>} Elemento HTML con el contenido de la sección tiempo
 */
function mostrarTiempo(pueblo) {
    let section = crearSection().addClass("contenedor-tiempo");
    fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' + pueblo + '?unitGroup=metric&include=days&key=RZGP4QS4N8RAJ7CEQ4UYWVEYQ&contentType=json', {
    "method": "GET",
    "headers": {
        "Content-Type": "application/json"
    }
    })
    .then(response => response.json())
    .then(data => {
        let dias = data.days;

        for(let i = 0; i < 5; i++) {
            let dia = dias[i];
            let div = crearDiv("contenedor-tiempo-dia p-4");

            div.append(crearImg("img/weather/" + dia.icon + ".svg", "", "imagen-tiempo"))
            .append(crearP({texto: obtenerDiaSemana(dia.datetime)}))
            .append(crearP({texto: Math.floor(dia.temp).toString() + "°C"}));
            section.append(div);
        }
    })
    return section;
}

/**
 * Función que obtiene el nombre del día de la semana correspondiente a una fecha
 * @param {String} fechaString Fecha con el formato "YYYY-MM-DD"
 * @returns {String} Nombre del día de la semana correspondiente a la fecha (Ejemplo: "Lun")
 */
function obtenerDiaSemana(fechaString) {
    // Dividir la cadena de fecha en año, mes y día
    let partesFecha = fechaString.split("-");
    let año = parseInt(partesFecha[0]);
    let mes = parseInt(partesFecha[1]) - 1; // Los meses en JavaScript son indexados desde 0 (enero = 0)
    let dia = parseInt(partesFecha[2]);

    // Crear un objeto Date con la fecha especificada
    let fecha = new Date(año, mes, dia);

    // Array con los nombres de los días de la semana
    let diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    // Obtener el día de la semana y devolverlo
    let diaSemana = fecha.getDay();
    return diasSemana[diaSemana];
}