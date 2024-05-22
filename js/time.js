$("#copy-text").html("CopyRight &copy; " + (new Date()).getFullYear().toString());

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

/** 
 * Función para calcular la duración entre dos horas
 */ 
function calcularDuracionRuta(horaInicio, horaFin) {
    const inicio = new Date("1970-01-01T"+horaInicio);
    const fin = new Date("1970-01-01T"+horaFin);
    const duracionMinutos = Math.round((fin.getTime() - inicio.getTime()) / (1000 * 60)); // Convertir milisegundos a minutos y redondear
    return `${Math.floor(duracionMinutos / 60)}h ${duracionMinutos % 60}min`; // Mostrar duración con horas y minutos
}

/**
 * Función encargada de convertir una fecha en formato "YYYY-MM-DD" a un formato "DD/MM/YY"
 * @param {String} fecha Fecha en formato "YYYY-MM-DD"
 * @returns {String} Fecha en formato "DD/MM/YY"
 */
function convertirFormatoFechaExposicion(fecha) {
    let fechaObj = new Date(fecha);
    let dia = String(fechaObj.getDate()).padStart(2, '0');
    let mes = String(fechaObj.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript empiezan desde 0
    let año = fechaObj.getFullYear().toString().substr(-2); // Obtiene los últimos dos dígitos del año
    return `${dia}/${mes}/${año}`;
}

/**
 * Función genérica para poder transformar un horario de un museo en un objeto facil de manejar
 * @param {Array<string>|string} horario Horario en formato "Tu-Su 10:00-18:00"
 * @returns {Object} Objeto con el horario normalizado
 */
function normalizarFormatoHorarioMuseoJSON(horario) {
    let dias = {
        "Mo": "Lunes",
        "Tu": "Martes",
        "We": "Miércoles",
        "Th": "Jueves",
        "Fr": "Viernes",
        "Sa": "Sábado",
        "Su": "Domingo"
    };
    // Comprueba si tiene varios horarios
    if (!Array.isArray(horario)) {
        let [diasIngles, horas] = horario.split(" ");
        let [horaInicio, horaFin] = horas.split("-");
        let [diaInicio, diaFin] = diasIngles.split("-");
        return [{
            rangoDias: {
                diaInicio: {
                    nombre: dias[diaInicio],
                    día: diaInicio
                },
                diaFin: {
                    nombre: dias[diaFin],
                    día: diaFin
                }
            },
            rangoHoras: {
                horaInicio: horaInicio,
                horaFin: horaFin
            }
        }];
            
    } else {
        let rango =  horario.map(horario => {
            let [diasIngles, horas] = horario.split(" ");
            let [diaInicio, diaFin] = diasIngles.split("-");
            return {
                rangoDias: {
                    diaInicio: {
                        nombre: dias[diaInicio],
                        día: diaInicio
                    },
                    diaFin: {
                        nombre: dias[diaFin],
                        día: diaFin
                    }
                },
                rangoHoras: {
                    horaInicio: horas.split("-")[0],
                    horaFin: horas.split("-")[1]
                }
            };
        });

        return rango;
            
    }
}