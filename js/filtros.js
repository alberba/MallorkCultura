let tipoBusqueda;
let posicionUsuario;
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
                // @ts-ignore
                .on("change", () => cambiarUbicacionesPorNombre($("#busqueda-nombre").val())))
        )
        .append(crearDiv("elemento-filtro-museo")   // Input texto dirección
            .append(crearLabel("","Búsqueda por cercanía a"))
            .append(crearInput("search","","busqueda-cercania","","Dirección")
                .on("change", () => {
                    tipoBusqueda = 0;
                    cambiarUbicacionesPorCercania(String($("#busqueda-cercania").val()), Number($("#busqueda-radio").val()))
                }))
        )
        .append(crearDiv("elemento-filtro-museo")   // Input radio de búsqueda
            .append(crearLabel("","Radio de búsqueda"))
            .append(crearDiv("contenedor-range")
                .append(crearInput("range","","busqueda-radio")
                    .on("mouseup", () => {
                        if(tipoBusqueda == 0) {
                            cambiarUbicacionesPorCercania(String($("#busqueda-cercania").val()), Number($("#busqueda-radio").val()));
                        } else if(tipoBusqueda == 1) {
                            success(posicionUsuario, Number($("#busqueda-radio").val()));
                        }
                    })
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
                    // @ts-ignore
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
                                .on("click",() => {
                                    tipoBusqueda = 1;
                                    cambiarUbicacionesCercaUsuario(Number($("#busqueda-radio").val()))
                                })
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
    let ubicacionesNuevas = [];
    ubicaciones.forEach(ubicacion => { 
        switch(ubicacion["@type"]) {
            case "CivicStructure":
            case "MovieTheater":
                if (nombre === "" || ubicacion.name.toLowerCase().includes(nombre.toLowerCase())) {
                    ubicacionesNuevas.push(ubicacion);
                    museosNuevos.push(recuperarLatLongMuseo(ubicacion));
                }
                break;
            case "Service":
                if (nombre === "" || ubicacion.areaServed.name.toLowerCase().includes(nombre.toLowerCase())) {
                    ubicacionesNuevas.push(ubicacion);
                    museosNuevos.push(recuperarLatLongMuseo(ubicacion));
                }
                break;
        }
    });

    crearTarjetasUbicacionesPaginaActual(ubicacionesNuevas);

    if(museosNuevos.length >= 0) {
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
        let ubiGeo;
        contenedorUbicaciones.empty();
        ubicaciones.forEach(ubicacion => { 
            switch(ubicacion["@type"]) {
                case "CivicStructure":
                case "MovieTheater":
                    ubiGeo = ubicacion.geo;
                    coordsMuseo = {
                        lat: ubicacion.geo.latitude,
                        lng: ubicacion.geo.longitude
                    };
                    break;
                case "Service":
                    ubiGeo = ubicacion.areaServed.geo;
                    coordsMuseo = {
                        lat: ubicacion.areaServed.geo.latitude,
                        lng: ubicacion.areaServed.geo.longitude
                    };
                    break;
            }
            if (calcularDistancia(coordsDireccion, coordsMuseo) <= rango) {
                contenedorUbicaciones.append(crearTarjetaUbicacion(ubicacion));
                museosNuevos.push({lat: parseFloat(ubiGeo.latitude), lng: parseFloat(ubiGeo.longitude)});
            }
            
        });

        if(museosNuevos.length >= 0) {
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
    let ubiNuevos = [];
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

    ubicaciones.forEach(ubicacion => { 
        if (contiene(dia, ubicacion)) {
            contenedorUbicaciones.append(crearTarjetaUbicacion(ubicacion));
            switch(ubicacion["@type"]) {
                case "CivicStructure":
                case "MovieTheater":
                    ubiNuevos.push({lat: parseFloat(ubicacion.geo.latitude), lng: parseFloat(ubicacion.geo.longitude)});
                    break;
                case "Service":
                    ubiNuevos.push({lat: parseFloat(ubicacion.areaServed.geo.latitude), lng: parseFloat(ubicacion.areaServed.geo.longitude)});
                    break;
            }
        }
        
    });

    if(ubiNuevos.length >= 0) {
        actualizarMarkerMaps(ubiNuevos);
    }
}

/**
 * Función que comprueba si se puede acceder en el **día** pasado por parametro al museo **m**
 * @param {String} dia Día de la semana en formato de 2 letras en inglés
 * @param {object} ubicacion Objeto ubicacion perteneciente al array de museos
 * @returns Boolean indicando si la fecha indicada **dia** se puede acceder al museo **m**
 */
function contiene(dia, ubicacion) {
    let diasSemana = ["Mo","Tu","We","Th","Fr","Sa","Su"];
    let horarioApertura;
    switch(ubicacion["@type"]) {
        case "CivicStructure":
        case "MovieTheater":
            horarioApertura = ubicacion.openingHours;
            break;
        case "Service":
            horarioApertura = ubicacion.areaServed.openingHours;
            break;
    }
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
    let ubicacionesNuevas = [];
    contenedorUbicaciones.empty();
    if (!gratuito && !entrada) {
        ubicaciones.forEach(museo => {
            museosNuevos.push({lat: parseFloat(museo.areaServed.geo.latitude), lng: parseFloat(museo.areaServed.geo.longitude)});
        });

        paginaActual = 0;
        crearTarjetasUbicacionesPaginaActual(ubicaciones);
        
        if(museosNuevos.length >= 0) {
            actualizarMarkerMaps(museosNuevos);
        }

        return;
    }

    ubicaciones.forEach(museo => { 
        if ((museo.areaServed.isAccessibleForFree && gratuito) || (!museo.areaServed.isAccessibleForFree && entrada)) {
            ubicacionesNuevas.push(museo);
            museosNuevos.push({lat: parseFloat(museo.areaServed.geo.latitude), lng: parseFloat(museo.areaServed.geo.longitude)});
        }
    });

    paginaActual = 0;
    crearTarjetasUbicacionesPaginaActual(ubicacionesNuevas);

    if(museosNuevos.length >= 0) {
        actualizarMarkerMaps(museosNuevos);
    }
}

/**
 * Función que muestra aquellas ubicaciones en un rango respecto al usuario usando la geolocalización del navegador
 * @param {Number} rango valor numérico que indica la distáncia del rango de búsqueda
 */
function cambiarUbicacionesCercaUsuario(rango) {
    let geoLocator = navigator.geolocation;
    geoLocator.getCurrentPosition(function(position) {
        posicionUsuario = position
        success(position, rango);
    });
}

/**
 * función que se llama en caso de éxito al recuperar la ubicación del usuario. Actualiza las ubicaciones que se muestran.
 * @param {Object} pos parámetro generado por la función ``getCurrentPosition()`` que contiene la latitud y la longitud de la ubicación del navegador
 * @param {Number} rango valor numérico que indica la distancia del rango de búsqueda
 */
function success(pos, rango) {
    let coordsAux = pos.coords;
    let coords = {
        lat: coordsAux.latitude,
        lng: coordsAux.longitude
    };
    let coordsMuseo;
    let ubicacionesCercanas = [];
    let museosNuevos = [];
    let contenedorUbicaciones = $(".contenedor-museos");
    contenedorUbicaciones.empty();
    ubicaciones.forEach(museo => { 
        coordsMuseo = recuperarLatLongMuseo(museo);
        if (calcularDistancia(coords, coordsMuseo) <= rango) {
            ubicacionesCercanas.push(museo);
            museosNuevos.push(coordsMuseo);
        }
    });
    paginaActual = 0;
    crearTarjetasUbicacionesPaginaActual(ubicacionesCercanas);

    if(museosNuevos.length >= 0) {
        actualizarMarkerMaps(museosNuevos);
    }
}

/**
 * función que devuelve las coordenadas del museo pasado por parámetro
 * @param {jQuery<HTMLElement>} museo museo del que recuperar las coords
 * @returns {Object} objeto con lat y lng del museo
 */
function recuperarLatLongMuseo(museo) {
    if(!museo.hasOwnProperty("origen")) {
        return {
            lat: museo.areaServed.geo.latitude,
            lng: museo.areaServed.geo.longitude
        };
    } else {
        switch(museo.origen) {
            case "MR":
            case "DT":
                return {
                    lat: museo.geo.latitude,
                    lng: museo.geo.longitude
                };
                break;
        }
    }
}