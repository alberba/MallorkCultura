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
                    .on("change", () => cambiarUbicacionesPorDiaDeVisita($("#dia-visita").val())))
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
                        .on("change", () => cambiarUbicacionesPorTipoDeEntrada($("#gratuito").prop("checked"), $("#entrada").prop("checked"))))
                )
                .append(crearLabel("entrada","Entrada")
                    .prepend(crearInput("checkbox","tipo_entrada[]","entrada")
                        .on("change", () => cambiarUbicacionesPorTipoDeEntrada($("#gratuito").prop("checked"), $("#entrada").prop("checked"))))
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

/**
 * Función que muestra aquellas ubicaciones cuyo nombre contenga coincidencias con el input de texto de los filtros
 * @param {String} nombre Valor del input de texto de los filtros: nombre del museo a buscar
 */
function cambiarUbicacionesPorNombre(nombre) {
    let contenedorUbicaciones = $(".contenedor-museos");
    contenedorUbicaciones.empty();
    let museosNuevos = [];
    museos.forEach(museo => { 
        if (nombre === "" || museo.areaServed.name.toLowerCase().includes(nombre.toLowerCase())) {
            contenedorUbicaciones.append(crearTarjetaUbicacion(museo, crearDondeVisitar));
            museosNuevos.push({lat: parseFloat(museo.areaServed.geo.latitude), lng: parseFloat(museo.areaServed.geo.longitude)});
        }
    });

    if(museosNuevos.length >= 0) {
        console.log(museosNuevos);
        actualizarMarkerMaps(museosNuevos);
    }
}


/**
 * Función que muestra aquellas ubicaciones que se encuentren en el radio especificado por **rango** alrededor de **direccion**
 * @param {String} direccion Dirección sobre la cual se efectua la búsqueda de ubicaciones por cercanía
 * @param {number} rango Radio del area de búsqueda alrededor de dirección en kms
 */
async function cambiarUbicacionesPorCercania(direccion = "Palma", rango = 0) {  // rango está en km
    // Esto sucederá en caso de cambiar el rango antes de poner una dirección
    if(direccion == "") {
        return;
    }

    recuperarLatLng(direccion).then(coordsDireccion => {
        let coordsMuseo;
        let contenedorUbicaciones = $(".contenedor-museos");
        let museosNuevos = [];
        contenedorUbicaciones.empty();
        museos.forEach(museo => { 
            coordsMuseo = {
                lat: museo.areaServed.geo.latitude,
                lng: museo.areaServed.geo.longitude
            };
            if (calcularDistancia(coordsDireccion, coordsMuseo) <= rango) {
                contenedorUbicaciones.append(crearTarjetaUbicacion(museo, crearDondeVisitar));
                museosNuevos.push({lat: parseFloat(museo.areaServed.geo.latitude), lng: parseFloat(museo.areaServed.geo.longitude)});
            }
            
        });

        if(museosNuevos.length >= 0) {
            console.log(museosNuevos);
            actualizarMarkerMaps(museosNuevos);
        }
    });
    
}

/**
 * Función que recupera la latitud y longitud de la dirección introducida en el innput de dirección de los filtros
 * @param {String} direccion Dirección introducida en el input de dirección de los filtros
 * @returns Objeto que contiene la latitud y la longitud de la dirección
 */
function recuperarLatLng(direccion) {
    let geo;
    return fetch("https://geocode.maps.co/search?q="+direccion+"&api_key=662f95ede90a4385758387pkl2dc4fb")
        .then(response => response.json())
        .then(data => {
            geo = {lat: data[0].lat, lng: data[0].lon};
            return geo;
        })
        .catch(error => console.error(error));
}

/**
 * Función que calcula la distancia en km entre la dirección introducida en los filtros y un museo
 * @param {object} coordsDireccion Objeto que contiene la latitud y longitud de la ubicación de la dirección introducida en los filtros
 * @param {object} coordsMuseo Objeto que contiene la latitud y longitud de la ubicación del museo
 * @returns Number con la distancia en km entre la dirección introducida y la ubicación del museo
 */
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

/**
 * Función que muestra aquellas ubicaciones a las que se puede acceder el día especificado en los filtros
 * @param {String} fecha Fecha en formato String devuelto por el input de fecha de búsqueda de los filtros
 */
function cambiarUbicacionesPorDiaDeVisita(fecha) {
    let contenedorUbicaciones = $(".contenedor-museos");
    contenedorUbicaciones.empty();
    let dia;
    let museosNuevos = [];
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

    museos.forEach(museo => { 
        if (contiene(dia, museo)) {
            contenedorUbicaciones.append(crearTarjetaUbicacion(museo, crearDondeVisitar));
            museosNuevos.push({lat: parseFloat(museo.areaServed.geo.latitude), lng: parseFloat(museo.areaServed.geo.longitude)});
        }
        
    });

    if(museosNuevos.length >= 0) {
        console.log(museosNuevos);
        actualizarMarkerMaps(museosNuevos);
    }
}

/**
 * Función que comprueba si se puede acceder en el **día** pasado por parametro al museo **m**
 * @param {String} dia Día de la semana en formato de 2 letras en inglés
 * @param {object} m Objeto museo perteneciente al array de museos
 * @returns Boolean indicando si la fecha indicada **dia** se puede acceder al museo **m**
 */
function contiene(dia, m) {
    let diasSemana = ["Mo","Tu","We","Th","Fr","Sa","Su"];
    let horarioApertura = m.areaServed.openingHours;
    let diasSemanaAbierto;
    let diaAbierto1;
    let diaAbierto2;
    let aux = [];

    if(Array.isArray(horarioApertura)) {
        horarioApertura.forEach(x => {
            aux.push(x.split(" ",1)[0]);
        });
    } else {
        aux.push(horarioApertura.split(" ",1)[0]);
    }
    for (let aux2 of aux) {
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
    }

    return false;
}

/**
 * Función que muestra aquellas ubicaciones cuyo acceso coincida con el tipo indicado en los checkboxes de los filtros
 * @param {boolean} gratuito Booleano indicando si la acceso es gratuito
 * @param {boolean} entrada Booleano indicando si el acceso es mediante entrada
 */
function cambiarUbicacionesPorTipoDeEntrada(gratuito, entrada) {
    let contenedorUbicaciones = $(".contenedor-museos");
    let museosNuevos = [];
    contenedorUbicaciones.empty();
    if (!gratuito && !entrada) {
        museos.forEach(museo => { 
            contenedorUbicaciones.append(crearTarjetaUbicacion(museo, crearDondeVisitar));
            museosNuevos.push({lat: parseFloat(museo.areaServed.geo.latitude), lng: parseFloat(museo.areaServed.geo.longitude)});
        });

        if(museosNuevos.length >= 0) {
            actualizarMarkerMaps(museosNuevos);
        }

        return;
    }

    museos.forEach(museo => { 
        if ((museo.areaServed.isAccessibleForFree && gratuito) || (!museo.areaServed.isAccessibleForFree && entrada)) {
            contenedorUbicaciones.append(crearTarjetaUbicacion(museo, crearDondeVisitar));
            museosNuevos.push({lat: parseFloat(museo.areaServed.geo.latitude), lng: parseFloat(museo.areaServed.geo.longitude)});
        }
    });

    if(museosNuevos.length >= 0) {
        actualizarMarkerMaps(museosNuevos);
    }
}

/**
 * Función que muestra aquellas ubicaciones en un rango de 10 km respecto al usuario usando la geolocalización del navegador
 */
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
    let museosNuevos = [];
    let contenedorUbicaciones = $(".contenedor-museos");
    contenedorUbicaciones.empty();
    museos.forEach(museo => { 
        coordsMuseo = {
            lat: museo.areaServed.geo.latitude,
            lng: museo.areaServed.geo.longitude
        };
        if (calcularDistancia(coords, coordsMuseo) <= 10) {
            contenedorUbicaciones.append(crearTarjetaUbicacion(museo, crearDondeVisitar));
            museosNuevos.push({lat: parseFloat(museo.areaServed.geo.latitude), lng: parseFloat(museo.areaServed.geo.longitude)});
        }
    });

    if(museosNuevos.length >= 0) {
        console.log(museosNuevos);
        actualizarMarkerMaps(museosNuevos);
    }
}