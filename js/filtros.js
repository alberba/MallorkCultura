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
        contenedorUbicaciones.append(crearTarjetaUbicacion(museo));
    });
}

// búsqueda por cercanía a una dirección
// Acabar
function cambiarUbicacionesPorCercanía(direccion, rango) {
    let contenedorUbicaciones = $(".contenedor-museos");
    contenedorUbicaciones.empty();
    museos.forEach(museo => { if (museo.areaServed.name == valor)
        contenedorUbicaciones.append(crearTarjetaUbicacion(museo));
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
        contenedorUbicaciones.append(crearTarjetaUbicacion(museo));
    });
}

function contiene(dia, m) {
    let dias = ["Mo","Tu","We","Th","Fr","Sa","Su"]
    let horarioApertura = m.areaServed.openingHours;
    return false;
}

function cambiarUbicacionesPorTipoDeEntrada(gratuito, entrada) {
    let contenedorUbicaciones = $(".contenedor-museos");
    contenedorUbicaciones.empty();
    museos.forEach(museo => { if ((museo.areaServed.isAccessibleForFree && gratuito) || (!museo.areaServed.isAccessibleForFree && entrada))
        contenedorUbicaciones.append(crearTarjetaUbicacion(museo));
    });
}