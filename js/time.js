/**
 * Función que genera el contenido de la sección tiempo de la página ruta
 * @param {Object} geo Objeto geo con las coordenadas de la ubicación actual
 * @returns {JQuery<HTMLElement>} Elemento HTML con el contenido de la sección tiempo
 */
function mostrarTiempo(geo) {
    let section = crearSection().addClass("contenedor-tiempo");
    //TODO: Cambiar la URL de la API para obtener el tiempo de un pueblo concreto
    fetch('https://api.openweathermap.org/data/3.0/onecall?lat=' + geo.latitude + '&lon=' + geo.longitude + '&appid=d00526824e078f1f8c17eb9b337f1dab&exclude=minutely,hourly,alerts&units=metric', {
    "method": "GET",
    "headers": {
        "Content-Type": "application/json"
    }
})
    .then(response => response.json())
    .then(data => {
        let dias = data.daily;

        for(let i = 0; i < 5; i++) {
            let dia = dias[i];
            let temp;
            let nombreDia;
            if(i == 0) {
                dia = data.current;
                temp = Math.round(data.current.temp).toString()+ "°C";
                nombreDia = "Hoy";
            } else {
                temp = Math.round(dia.temp.min).toString() + "-" + Math.round(dia.temp.max).toString() + "°C";
                nombreDia = obtenerDiaSemana(dia.dt);
            }
            
            let div = crearDiv("contenedor-tiempo-dia p-4");
            let icon = dia.weather[0].icon;

            if (icon.substring(0, 2) == "01" || icon.substring(0, 2) == "02") {
                div.append(crearImg("img/weather/" + icon + ".svg", "", "imagen-tiempo"));
            } else if (icon.substring(0, 2) == "09" || icon.substring(0, 2) == "10") {
                div.append(crearImg("img/weather/09.svg", "", "imagen-tiempo"));
            } else {
                div.append(crearImg("img/weather/"+ icon.substring(0, 2) + ".svg", "", "imagen-tiempo"));
            }
            div.append(crearP({texto: nombreDia}))
            .append(crearP({texto: temp}));
            section.append(div);
        }
    })
    .catch(err => {
        console.error(err);
    });
    return section;
}

/**
 * Función que obtiene el nombre del día de la semana correspondiente a una fecha
 * @param {String} fechaString Fecha con el formato "YYYY-MM-DD"
 * @returns {String} Nombre del día de la semana correspondiente a la fecha (Ejemplo: "Lun")
 */
function obtenerDiaSemana(fechaString) {

    // Convert the fechaString to a number
    let fecha = new Date(Number(fechaString) * 1000);

    // Array con los nombres de los días de la semana
    let diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    // Obtener el día de la semana y devolverlo
    let diaSemana = fecha.getDay();
    return diasSemana[diaSemana];
}