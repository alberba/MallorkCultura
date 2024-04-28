// búsqueda por nombre
function cambiarUbicacionesPorNombre(nombre) {
    let contenedorUbicaciones = $(".contenedor-museos");
    contenedorUbicaciones.empty();
    museos.forEach(museo => { if (nombre == "" || museo.areaServed.name == nombre)
        contenedorUbicaciones.append(crearTarjetaUbicacion(crearDondeVisitar,museo));
    });
}







// búsqueda por cercanía a una dirección
// Revisar??
function cambiarUbicacionesPorCercania(direccion, rango) {  // rango está en km
    let coordsDireccion = recuperarLatLng(direccion);       // devuelve un objeto LatLng de google con la latitud y longitu de la ubicación
    let coordsMuseo;
    let contenedorUbicaciones = $(".contenedor-museos");
    contenedorUbicaciones.empty();
    museos.forEach(museo => { 
        coordsMuseo = {
            lat: museo.areaServed.geo.latitude,
            lng: museo.areaServed.geo.longitude
        };
        if ( parseFloat(recuperarDistancia(coordsDireccion,coordsMuseo)) <= rango*1000) {
            contenedorUbicaciones.append(crearTarjetaUbicacion(crearDondeVisitar,museo));
        }
    });
}

function recuperarLatLng(direccion) {
    let geocoder = new google.maps.Geocoder();
    return geocoder
        .geocode({address:direccion})
        .then((response) => {
            if (response.results[0]) {
                    return response.results.geometry.location;
                }
        })
        .catch((e) => window.alert("Geocoder falló debido a: " + e));
}

/**
 * 
 * @param {*} coords 
 * @param {*} coordsMuseo 
 */
function recuperarDistancia(coordsDireccion,coordsMuseo){
    let service = new google.maps.DistanceMatrixService();
    return service
        .getDistanceMatrix(
            {
                origins: [coordsDireccion],
                destinations: [coordsMuseo],
                unitSystem: google.maps.UnitSystem.METRIC
            })
        .then((response) => {
            return response.rows[0].distance.value; // devuelve metros
        })
        .catch((e) => window.alert("DistanceMatrix falló debido a: " + e));
}









// búsqueda por día
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
            return diasSemanaAbierto.includes(dia);
        }
    });

    return false;
}








/* Tipo de entrada */
function cambiarUbicacionesPorTipoDeEntrada(gratuito, entrada) {
    let contenedorUbicaciones = $(".contenedor-museos");
    contenedorUbicaciones.empty();
    museos.forEach(museo => { if ((museo.areaServed.isAccessibleForFree && gratuito) || (!museo.areaServed.isAccessibleForFree && entrada))
        contenedorUbicaciones.append(crearTarjetaUbicacion(crearDondeVisitar,museo));
    });
}