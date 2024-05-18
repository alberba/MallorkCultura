/**
 * Función que se encarga de crear la pantalla de los museos de todos los pueblos.
 *  A esta se accede a partir del botón del header "¿Qué visitar?"
 */
function crearPantallaUbicaciones() {
    // Hacer que la página suba al principio
    window.scrollTo(0, 0);
    // Elimina el contenido del header y añade el nuevo. Esto se hace para que, en caso de estar la imagen 
    // de portada de la pantalla principal, se elimine
    $("header > div").remove();
    $("header").append(crearDiv("mapa-museo map-container")
        .append(crearDiv("ubi-header").attr("id","map"))
    );

    //Cuando Entramos en la pantalla de Museos ponemos que estamos en la primera pagina
    paginaActual = 0;

    // Inicializa el mapa con el centro de Mallorca y los marcadores de todos los museos
    initMap({
        position: centroMallorca, 
        zoom: 9,
        arrPositionMarkers: ubicaciones.map(museo => ({lat: parseFloat(museo.areaServed.geo.latitude), lng: parseFloat(museo.areaServed.geo.longitude)}))
    });

    $("main").empty()
    $("main").attr("class","contenedor-principal lista-museos")
        .append(crearBotonAtras("/", "Inicio"))
        .append(crearFiltros());

    let contenedorMuseo = crearDiv("contenedor-museos");
    leerJSONMallorcaRoute();
    // Añade las tarjetas de los museos de la primera pagina
    for(let i=0; i < ubicaciones.length && i < museosPorPagina; i++){
        contenedorMuseo.append(anadirUbicacion(ubicaciones[i]));
    }    

    $("main").append(crearSection().append(contenedorMuseo));
    $("main").append(crearSelectorPagina());
    modificarPaginacion();
}

/**
 * Función que llama a la función correspondiente para generar las tarjetas de ubicación con la función correcta
 * @param {Object} ubi Ubicación individual del array de ubicaciones: la que se va a añadir a la lista de ubicaciones 
 * @returns 
 */
function anadirUbicacion(ubi) {
    if (!ubi.hasOwnProperty()) {
        return crearTarjetaUbicacion(ubi);
    } else {
        switch(ubi.origen) {
            case "MR":
                console.log("ubi de MR")
                return crearTarjetaUbicacionMR(ubi);
            default:
                console.error("La ubicación",ubi,"tiene un origen incorrecto, no se puede procesar")
                return;
        }
    }
}


/**
 * Función que se encarga de crear la pantalla de los museos de un pueblo en concreto
 * @param {String} pueblo Nombre del pueblo del que se quieren mostrar los museos
 */
function crearUbicacionesPueblo(pueblo) {
    // Hacer que la página suba al principio
    window.scrollTo(0, 0);
    // Elimina el contenido del header y añade el nuevo. Esto se hace para que, en caso de estar la imagen 
    // de portada de la pantalla principal, se elimine
    $("header > div").remove();
    $("header").append(crearDiv("mapa-museo map-container")
        .append(crearDiv("ubi-header").attr("id","map"))
    );

    // Inicializa el mapa con el centro del pueblo y los marcadores de los museos de ese pueblo
    let ubicacionesPueblo = ubicaciones.filter(museo => museo.areaServed.address.addressLocality === pueblo);
    iniciarMapaPueblo(pueblosConUbicaciones.find(p => p.name === pueblo), ubicacionesPueblo);

    $("main").empty()
    $("main").attr("class","contenedor-principal lista-museos");
    $("main").append(crearBotonAtras("/", "Inicio"));
    $("main").append(crearH2(pueblo));
    $("main").append(crearHr());
    $("main").append(crearFiltros());

    let contenedorMuseos = crearDiv("contenedor-museos");
    ubicacionesPueblo.forEach(ubi => {
        contenedorMuseos.append(anadirUbicacion(ubi));
    });
    $("main").append(crearSection().append(contenedorMuseos));

    $("main").append(crearSelectorPagina());
}

function crearTarjetasUbicacionesPaginaActual(){
    let contenedorMuseo = $(".contenedor-museos");
    contenedorMuseo.empty();
    for(let i=paginaActual*museosPorPagina; i < ubicaciones.length && i < (paginaActual+1)*museosPorPagina; i++){
        contenedorMuseo.append(crearTarjetaUbicacion(ubicaciones[i]));
    }
}

function filtrarUbicacionesPueblo(pueblo) {
    let arrayFiltrado = [];
    ubicaciones.forEach(ubi => {
        if (!ubi.hasOwnProperty()) {
            if (ubi.areaServed.address.addressLocality === pueblo)
        } else {
            switch(ubi.origen) {
                case "MR":
                    
                default:
                    console.error("La ubicación",ubi,"tiene un origen incorrecto, no se puede procesar")
                    return;
            }
        }
    });
}

/**
 * Función que se encarga de crear la tarjeta de los lugares de la lista de ubicaciones
 * @param {Object} museo Museo del que se quiere crear la tarjeta
 * @returns {JQuery<HTMLElement>} Un elemento article con la información del museo
 */
function crearTarjetaUbicacion(museo) {
    let botonVerMas = crearBoton("Ver más", "Y", "boton boton-card-museo boton-gris")
        .attr("href", "/museo?" + museo.areaServed.name);

    añadirEventListenerSPA(botonVerMas.get(0));

    return crearArticle("museo")
            .append(crearImg(museo.areaServed.photo[0].contentUrl, museo.areaServed.photo[0].description))
            .append(crearHeader("titulo-museo-card").append(crearH4(museo.areaServed.name)))
            .append(crearP({
                clases: "mb-4 descripcion-museo",
                texto: museo.areaServed.description        
            }))
            .append(crearDiv("botones-museo")
                .append(crearBoton("Añadir", "", "boton boton-card-museo boton-verde")
                    .on("click", () => {
                        almacenarVisita(escaparComillas(museo.areaServed.name), escaparComillas(museo.areaServed.address.streetAddress), museo.areaServed["@type"][1]);
                        // @ts-ignore
                        Swal.fire({
                            title: "Añadido a la ruta",
                            text: "",
                            icon: "success"
                        });
                    })
                )
                .append(botonVerMas)
            );
}

function modificarPaginacion() {
    // Obtener el elemento paginacion
    var paginacion = $("#paginacion");

    if (Math.ceil(ubicaciones.length / museosPorPagina) < 2) {
        paginacion.remove();
        return;
    }

    paginacion.empty();

    // Obtener los botones de página anterior y página siguiente
    var prevButton = crearBoton("");
    prevButton.append(crearImg("img/svg/prev-page-arr.svg", "Página anterior"));
    var nextButton = crearBoton("");
    nextButton.append(crearImg("img/svg/next-page-arr.svg", "Página siguiente"));

    // Añadir evento onclick a los botones
    prevButton.on('click', function () {
        alert("Has clicado anterior");
        if (paginaActual > 0) {
            paginaActual--;
            crearTarjetasUbicacionesPaginaActual();
        }
    });

    nextButton.on('click', function () {
        if (paginaActual < Math.ceil(ubicaciones.length / museosPorPagina) - 1) {
            paginaActual++;
            crearTarjetasUbicacionesPaginaActual();
        }
    });

    paginacion.append(prevButton);

    var totalPaginas = Math.ceil(ubicaciones.length / museosPorPagina);

    if (totalPaginas <= 4) {
        for (let i = 1; i <= totalPaginas; i++) {
            var span = crearSpan("", i.toString()).on('click', function () {
                paginaActual = i - 1;
                crearTarjetasUbicacionesPaginaActual();
            });
            paginacion.append(span);
        }
    } else {
        for (let i = 1; i <= 3; i++) {
            var span = crearSpan("", i.toString()).on('click', function () {
                paginaActual = i - 1;
                crearTarjetasUbicacionesPaginaActual();
            });
            paginacion.append(span);
        }
        paginacion.append(crearP({
            clases: "",
            texto: ".."
        }));
        var lastPage = crearSpan("", totalPaginas.toString()).on('click', function () {
            paginaActual = totalPaginas - 1;
            crearPantallaUbicaciones();
        });
        paginacion.append(lastPage);
    }

    paginacion.append(nextButton);
}

