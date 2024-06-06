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
                .append(crearInput("range","","busqueda-radio").val(15)
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
                    texto: "15Km"
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
 * @param {String} nombre Valor del input de texto de los filtros: nombre de la ubicación a buscar
 */
function cambiarUbicacionesPorNombre(nombre) {
    $(".contenedor-museos").empty();
    let ubicacionesNuevas = [];
    let ubicacionesNuevasMapa = [];
    ubicaciones.forEach(ubicacion => { 
        switch(ubicacion["@type"]) {
            case "CivicStructure":
            case "MovieTheater":
                if (nombre === "" || ubicacion.name.toLowerCase().includes(nombre.toLowerCase())) {
                    ubicacionesNuevas.push(ubicacion);
                    ubicacionesNuevasMapa.push(recuperarLatLongUbicacion(ubicacion));
                }
                break;
            case "Service":
                if (nombre === "" || ubicacion.areaServed.name.toLowerCase().includes(nombre.toLowerCase())) {
                    ubicacionesNuevas.push(ubicacion);
                    ubicacionesNuevasMapa.push(recuperarLatLongUbicacion(ubicacion));
                }
                break;
        }
    });

    crearTarjetasUbicacionesPaginaActual(ubicacionesNuevas);

    if(ubicacionesNuevasMapa.length >= 0) {
        actualizarMarkerMaps(ubicacionesNuevasMapa);
    }
}


/**
 * Función que muestra aquellas ubicaciones que se encuentren en el radio especificado por ``rango`` alrededor de ``direccion``
 * @param {String} direccion Dirección sobre la cual se efectua la búsqueda de ubicaciones por cercanía
 * @param {number} rango Radio del area de búsqueda alrededor de dirección en kms
 */
async function cambiarUbicacionesPorCercania(direccion = "Palma", rango = 0) {  // rango está en km
    // Esto sucederá en caso de cambiar el rango antes de poner una dirección
    if(direccion == "") {
        return;
    }

    recuperarLatLng(direccion).then(coordsDireccion => {
        $(".contenedor-museos").empty()
        let coordsUbicacion;
        let ubicacionesNuevas = [];
        let ubicacionesNuevasMapa = [];
        ubicaciones.forEach(ubicacion => { 
            coordsUbicacion = recuperarLatLongUbicacion(ubicacion);
            if (calcularDistancia(coordsDireccion, coordsUbicacion) <= rango) {
                ubicacionesNuevas.push(ubicacion);
                ubicacionesNuevasMapa.push(coordsUbicacion);
            }
            
        });

        crearTarjetasUbicacionesPaginaActual(ubicacionesNuevas);

        if(ubicacionesNuevasMapa.length >= 0) {
            actualizarMarkerMaps(ubicacionesNuevasMapa);
        }
    });
    
}

/**
 * Función que recupera la latitud y longitud de la dirección introducida en el input de ``direccion`` de los filtros
 * @param {String} direccion Dirección introducida en el input de dirección de los filtros
 * @returns {Object} Objeto que contiene la latitud y la longitud de la ``direccion``
 */
function recuperarLatLng(direccion) {
    let geo;
    return fetch("https://geocode.maps.co/search?q=" + direccion + "&api_key=" + config.GEOCODE_API_KEY)
        .then(response => response.json())
        .then(data => {
            geo = {lat: data[0].lat, lng: data[0].lon};
            return geo;
        })
        .catch(error => console.error(error));
}

/**
 * Función que calcula la distancia en km entre la dirección introducida en los filtros y una ubicación
 * @param {object} coordsDireccion Objeto que contiene la latitud y longitud de la ubicación de la dirección introducida en los filtros
 * @param {object} coordsUbicacion Objeto que contiene la latitud y longitud de la ubicación
 * @returns Number con la distancia en km entre la dirección introducida y la ubicación
 */
function calcularDistancia(coordsDireccion, coordsUbicacion) {
    const radioTierra = 6371; // Radio de la Tierra en kilómetros
    const dLat = toRadians(coordsUbicacion.lat - coordsDireccion.lat);
    const dLon = toRadians(coordsUbicacion.lng - coordsDireccion.lng);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(coordsDireccion.lat)) * Math.cos(toRadians(coordsUbicacion.lat)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distancia = radioTierra * c; // Distancia en kilómetros
    return distancia;
}

/**
 * función que transforma los ``grados`` pasados por parámetro a radianes
 * @param {Number} grados grados a pasar a radianes
 * @returns {Number} valor en radianes
 */
function toRadians(grados) {
    return grados * Math.PI / 180;
}

/**
 * Función que muestra aquellas ubicaciones a las que se puede acceder el día especificado en los filtros
 * @param {String} fecha Fecha en formato String devuelto por el input de fecha de búsqueda de los filtros
 */
function cambiarUbicacionesPorDiaDeVisita(fecha) {
    $(".contenedor-museos").empty();
    let dia;
    let ubicacionesNuevas = [];
    let ubicacionesNuevasMapa = [];
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

    ubicaciones.forEach(ubi => { 
        if (contiene(dia, ubi)) {
            ubicacionesNuevas.push(ubi);
            ubicacionesNuevasMapa.push(recuperarLatLongUbicacion(ubi));
        }
        
    });
    console.log(ubicacionesNuevas);

    paginaActual = 0;
    crearTarjetasUbicacionesPaginaActual(ubicacionesNuevas);

    if(ubicacionesNuevasMapa.length >= 0) {
        actualizarMarkerMaps(ubicacionesNuevasMapa);
    }
}

/**
 * Función que comprueba si se puede acceder en el ``día`` pasado por parametro a la ``ubicacion`` pasada
 * @param {String} dia Día de la semana en formato de 2 letras en inglés
 * @param {object} ubicacion Objeto ubicacion perteneciente al array de ubicaciones
 * @returns Boolean indicando si la fecha indicada ``dia`` se puede acceder a la ``ubicacion``
 */
function contiene(dia, ubicacion) {
    let diasSemana = ["Mo","Tu","We","Th","Fr","Sa","Su"];
    let horarioApertura;
    switch(ubicacion["@type"]) {
        case "MovieTheater":
            return false;
        case "CivicStructure":
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
        if (!horarioApertura) {
            return true;
        }
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
    let ubicacionesNuevas = [];
    let ubicacionesNuevasMapa = [];
    contenedorUbicaciones.empty();
    if (!gratuito && !entrada) {
        ubicaciones.forEach(ubi => {
            ubicacionesNuevas.push(ubi);
            ubicacionesNuevasMapa.push(recuperarLatLongUbicacion(ubi));
        });

        paginaActual = 0;
        crearTarjetasUbicacionesPaginaActual(ubicacionesNuevas);
        
        if(ubicacionesNuevasMapa.length >= 0) {
            actualizarMarkerMaps(ubicacionesNuevasMapa);
        }

        return;
    }

    ubicaciones.forEach(ubi => { 
        if(!ubi.hasOwnProperty("origen")) {
            if ((ubi.areaServed.isAccessibleForFree && gratuito) || (!ubi.areaServed.isAccessibleForFree && entrada)) {
                ubicacionesNuevas.push(ubi);
                ubicacionesNuevasMapa.push(recuperarLatLongUbicacion(ubi));
            }
        } else {
            switch(ubi.origen) {
                case "MR":
                    if ((ubi.isAccessibleForFree && gratuito) || (!ubi.isAccessibleForFree && entrada)) {
                        ubicacionesNuevas.push(ubi);
                        ubicacionesNuevasMapa.push(recuperarLatLongUbicacion(ubi));
                    }
                    break;
                case "DT":
                    if(entrada) {
                        ubicacionesNuevas.push(ubi);
                        ubicacionesNuevasMapa.push(recuperarLatLongUbicacion(ubi));
                    }
                    break;
            }
        }
        
    });

    paginaActual = 0;
    crearTarjetasUbicacionesPaginaActual(ubicacionesNuevas);

    if(ubicacionesNuevasMapa.length >= 0) {
        actualizarMarkerMaps(ubicacionesNuevasMapa);
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
    let coordsUbicacion;
    let ubicacionesNuevas = [];
    let ubicacionesNuevasMapa = [];
    let contenedorUbicaciones = $(".contenedor-museos");
    contenedorUbicaciones.empty();
    ubicaciones.forEach(ubi => { 
        coordsUbicacion = recuperarLatLongUbicacion(ubi);
        if (calcularDistancia(coords, coordsUbicacion) <= rango) {
            ubicacionesNuevas.push(ubi);
            ubicacionesNuevasMapa.push(coordsUbicacion);
        }
    });
    paginaActual = 0;
    crearTarjetasUbicacionesPaginaActual(ubicacionesNuevas);

    if(ubicacionesNuevasMapa.length >= 0) {
        actualizarMarkerMaps(ubicacionesNuevasMapa);
    }
}

/**
 * función que devuelve las coordenadas de la ubicación pasada por parámetro
 * @param {Object} ubicacion ubicación de la que recuperar las coords
 * @returns {Object} objeto con lat y lng de la ubicación
 */
function recuperarLatLongUbicacion(ubicacion) {
    if(!ubicacion.hasOwnProperty("origen")) {
        return {
            lat: parseFloat(ubicacion.areaServed.geo.latitude),
            lng: parseFloat(ubicacion.areaServed.geo.longitude)
        };
    } else {
        switch(ubicacion.origen) {
            case "MR":
                return {
                    lat: ubicacion.geo.latitude,
                    lng: ubicacion.geo.longitude
                };
            case "DT":
                return {
                    lat: parseFloat(ubicacion.geo.latitude),
                    lng: parseFloat(ubicacion.geo.longitude)
                };
        }
    }
}