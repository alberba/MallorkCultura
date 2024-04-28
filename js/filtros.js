$("#busqueda-nombre").change(cambiarUbicacionesPorNombre(this.val()));
$("#busqueda-cercania").change(cambiarUbicacionesPorCercanía(this.val(), $("#busqueda-radio").val()));
$("#busqueda-radio").change(cambiarUbicacionesPorCercanía($("#busqueda-cercania").val(), this.val()));
$("#dia_visita").change(cambiarUbicacionesPorDiaDeVisita(this.val()));
$("#gratuito").change(cambiarUbicacionesPorTipoDeEntrada(this.val(), $("#entrada").val()));
$("#entrada").change(cambiarUbicacionesPorTipoDeEntrada($("#gratuito").val(), this.val()));

function cambiarUbicacionesPorNombre(nombre) {
    let contenedorUbicaciones = $(".contenedor-museos");
    contenedorUbicaciones.empty();
    museos.forEach(museo => { if (nombre == "" || museo.areaServed.name == nombre)
        contenedorUbicaciones.append(crearTarjetaUbicacion(crearDondeVisitar,museo));
    });
}

// búsqueda por cercanía a una dirección
// Acabar
function cambiarUbicacionesPorCercanía(direccion, rango) {
    let contenedorUbicaciones = $(".contenedor-museos");
    contenedorUbicaciones.empty();
    museos.forEach(museo => { if (museo.areaServed.name == valor)
        contenedorUbicaciones.append(crearTarjetaUbicacion(crearDondeVisitar,museo));
    });
}

function cambiarUbicacionesPorDiaDeVisita(fecha) {
    let contenedorUbicaciones = $(".contenedor-museos");
    contenedorUbicaciones.empty();
    let dia;
    switch((new Date(fecha)).getDay()){
        case 1:
            dia = "Mo";
            break;
        case 2:
            dia = "Tu";
            break;
        case 3:
            dia = "We";
            break;
        case 4:
            dia = "Th";
            break;
        case 5:
            dia = "Fr";
            break;
        case 6:
            dia = "Sa";
            break;
        case 7:
            dia = "Su";
            break;
    }

    museos.forEach(museo => { if (contiene(dia, museo))
        contenedorUbicaciones.append(crearTarjetaUbicacion(crearDondeVisitar,museo));
    });
}

function contiene(dia, m) {
    let diasSemana = ["Mo","Tu","We","Th","Fr","Sa","Su"];
    let horarioApertura = m.areaServed.openingHours;
    let diasSemanaAbierto;
    let diaAbierto1;
    let diaAbierto2;
    let aux = [];
    horarioApertura.forEach(x => {
        aux.push(x.split(" ",1)[0]);
    });
    console.log("Primera pausa: " + aux)
    aux.forEach(aux2 => {
        if (aux2.length == 2) {
            if (dia == aux2) {
                return true;
            }
        } else {
            diaAbierto1 = aux2.slice(0,2);
            diaAbierto2 = aux2.slice(3,5);
            diasSemanaAbierto = diasSemana.slice(diasSemana.indexOf(diaAbierto1),diasSemana.indexOf(diaAbierto2)+1);
            return true;
        }
    });

    return false;
}

function cambiarUbicacionesPorTipoDeEntrada(gratuito, entrada) {
    let contenedorUbicaciones = $(".contenedor-museos");
    contenedorUbicaciones.empty();
    museos.forEach(museo => { if ((museo.areaServed.isAccessibleForFree && gratuito) || (!museo.areaServed.isAccessibleForFree && entrada))
        contenedorUbicaciones.append(crearTarjetaUbicacion(crearDondeVisitar,museo));
    });
}