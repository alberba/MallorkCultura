// TODO: Hacer que funcionen
/**
 *  Función que se encarga de crear el Filtro de la pantalla de búsqueda. También
 *  manejará los eventos de los filtros
 * @returns {JQuery<HTMLElement>} Un elemento div con los filtros
 */
function crearFiltros() {
    let filtros = crearDiv("contenedor-filtros")
        .append(crearBoton("Filtros", "boton-filtros", "boton-filtros")
            .append(crearImg("img/svg/flecha-menu-down.svg"))
            .attr({
                "data-bs-toggle":"collapse",
                "data-bs-target":"#campos-filtro"
            })
        );
    
    let camposFiltros = crearDiv("campos-filtro-museos mt-3 collapse show","campos-filtro")
        .append(crearDiv("elemento-filtro-museo")   // Input texto nombre
            .append(crearLabel("busqueda-nombre","Búsqueda por nombre"))
            .append(crearInput("search","nombre","busqueda-nombre","","Buscar museo")
                .on("change", () => cambiarUbicacionesPorNombre($("#busqueda-nombre").val())))
        )
        .append(crearDiv("elemento-filtro-museo")   // Input texto dirección
            .append(crearLabel("","Búsqueda por cercanía a"))
            .append(crearInput("search","","busqueda-cercania","","Dirección")
                .on("change", () => cambiarUbicacionesPorCercania(String($("#busqueda-cercania").val()), Number($("#busqueda-radio").val()))))
        )
        .append(crearDiv("elemento-filtro-museo")   // Input radio de búsqueda
            .append(crearLabel("","Radio de búsqueda"))
            .append(crearDiv("contenedor-range")
                .append(crearInput("range","","busqueda-radio")
                    .on("mouseup", () => cambiarUbicacionesPorCercania(String($("#busqueda-cercania").val()), Number($("#busqueda-radio").val())))
                    .on("input", function() {
                        let valor = $(this).val();
                        $(".texto-range").text(valor + "Km");
                     })
                )
                .append(crearP({
                    clases: "texto-range",
                    texto: "50Km"
                })) // Esto me imagino que tendrá que cambiar a medida que se mueve el range
            )
        )
        .append(crearDiv("elemento-filtro-museo")   // Input texto nombre
                .append(crearLabel("dia-visita","Día de visita"))
                .append(crearInput("date","","dia-visita")
                    .on("change", () => cambiarUbicacionesPorDiaDeVisita($("#dia_visita").val())))
        )
        .append(crearDiv("elemento-filtro-museo")
            .attr("id","tipo-entrada") // Pocos divs necesitan un id, no veo necesidad de tener que incluir el id en la función para crear div's
            .append(crearP({
                clases:"",
                texto:"Tipo de entrada"
            }))
            .append(crearDiv("opciones-check")
                .append(crearLabel("gratuito","Gratuito")
                    .prepend(crearInput("checkbox","tipo_entrada[]","gratuito")
                        .on("change", () => cambiarUbicacionesPorTipoDeEntrada($("#gratuito").val(), $("#entrada").val())))
                )
                .append(crearLabel("entrada","Entrada")
                    .prepend(crearInput("checkbox","tipo_entrada[]","entrada")
                        .on("change", () => cambiarUbicacionesPorTipoDeEntrada($("#gratuito").val(), $("#entrada").val())))
                )
            )
        )
        .append(crearDiv("elemento-filtro-museo")
                    .append(crearBoton("Buscar cerca de mí","buscarCercaDeMi","boton boton-verde")
                                .on("click",() => cambiarUbicacionesCercaUsuario())
                            ) 
                );
    filtros.append(camposFiltros);
    
    return filtros;
}

// búsqueda por nombre
function cambiarUbicacionesPorNombre(nombre) {
    console.log("llamada cambiarUbicacionesPorNombre");

    let contenedorUbicaciones = $(".contenedor-museos");
    contenedorUbicaciones.empty();
    museos.forEach(museo => { if (nombre == "" || museo.areaServed.name === nombre)
        contenedorUbicaciones.append(crearTarjetaUbicacion(crearDondeVisitar,museo));
    });
}


// búsqueda por cercanía a una dirección
// Revisar??
async function cambiarUbicacionesPorCercania(direccion = "Palma", rango = 0) {  // rango está en km
    console.log("llamada cambiarUbicacionesPorCercania");
    console.log(rango)
    
    // Esto sucederá en caso de cambiar el rango antes de poner una dirección
    if(direccion == "") {
        return;
    }

    recuperarLatLng(direccion).then(coordsDireccion => {
        console.log(coordsDireccion);
        let coordsMuseo;
        let contenedorUbicaciones = $(".contenedor-museos");
        contenedorUbicaciones.empty();
        museos.forEach(museo => { 
            coordsMuseo = {
                lat: museo.areaServed.geo.latitude,
                lng: museo.areaServed.geo.longitude
            };
            console.log("Distancia: " + calcularDistancia(coordsDireccion, coordsMuseo) + " km");
            if (calcularDistancia(coordsDireccion, coordsMuseo) <= rango) {
                contenedorUbicaciones.append(crearTarjetaUbicacion(museo, crearDondeVisitar));
            }
        });
    });
    
}

function recuperarLatLng(direccion) {
    let geo;
    return fetch("https://geocode.maps.co/search?q="+direccion+"&api_key=662f95ede90a4385758387pkl2dc4fb")
        .then(response => response.json())
        .then(data => {
            geo = {lat: data[0].lat, lng: data[0].lon};
            console.log(geo);
            return geo;
        })
        .catch(error => console.error(error));
}

function calcularDistancia(coordsDireccion, coordsMuseo) {
    const radioTierra = 6371; // Radio de la Tierra en kilómetros
    const dLat = toRadians(coordsMuseo.lat - coordsDireccion.lat);
    const dLon = toRadians(coordsMuseo.lng - coordsDireccion.lng);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(coordsDireccion.lat)) * Math.cos(toRadians(coordsMuseo.lat)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distancia = radioTierra * c; // Distancia en kilómetros
    return distancia;
}

function toRadians(grados) {
    return grados * Math.PI / 180;
}

// búsqueda por día
function cambiarUbicacionesPorDiaDeVisita(fecha) {
    console.log("llamada cambiarUbicacionesPorDiaDeVisita");

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
    console.log("llamada cambiarUbicacionesPorTipoDeEntrada");

    let contenedorUbicaciones = $(".contenedor-museos");
    contenedorUbicaciones.empty();
    museos.forEach(museo => { if ((museo.areaServed.isAccessibleForFree && gratuito) || (!museo.areaServed.isAccessibleForFree && entrada))
        contenedorUbicaciones.append(crearTarjetaUbicacion(crearDondeVisitar,museo));
    });
}

/* Cercanía al usuario */
function cambiarUbicacionesCercaUsuario() {
    let geoLocator = navigator.geolocation;
    geoLocator.getCurrentPosition(success);
}

function success(pos) {
    $("#busqueda-radio").val(10);
    $(".texto-range").html("10Km");
    let coordsAux = pos.coords;
    let coords = {
        lat: coordsAux.latitude,
        lng: coordsAux.longitude
    };
    let coordsMuseo;
    let contenedorUbicaciones = $(".contenedor-museos");
        contenedorUbicaciones.empty();
        museos.forEach(museo => { 
            coordsMuseo = {
                lat: museo.areaServed.geo.latitude,
                lng: museo.areaServed.geo.longitude
            };
            console.log("Distancia: " + calcularDistancia(coords, coordsMuseo) + " km");
            if (calcularDistancia(coords, coordsMuseo) <= 10) {
                contenedorUbicaciones.append(crearTarjetaUbicacion(museo, crearDondeVisitar));
            }
        });
}