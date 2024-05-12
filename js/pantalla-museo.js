/**
 * Función que se encarga de crear la pantalla de información de un lugar en concreto
 * @param {String} nombreLugar Nombre del lugar del que se quiere mostrar la información
 * @param {Function} funcionAnterior Función que se ejecutará al pulsar el botón de atrás
 */
function crearPantallaMuseo(nombreLugar, funcionAnterior){
    const lugar = museos.find(museo => museo.areaServed.name === nombreLugar);
    // Hacer que la página suba al principio
    window.scrollTo(0, 0);
    // Elimina el contenido del header y añade el nuevo. Esto se hace para que, en caso de estar la imagen 
    // de portada de la pantalla principal, se elimine
    $("header > div").remove();
    $("header").append(crearDiv("mapa-museo map-container")
        .append(crearDiv("ubi-header").attr("id","map"))
        .append(crearDiv("contenedor-titulo-museo")
            .append($("<h2>")
                .addClass("m-0 titulo-museo")
                .attr("id", "titulo-museo")
                .attr("property","name")
                .html(lugar.areaServed.name))
        )
    );

    // Inicializa el mapa con la posición del lugar
    let posicion = {lat: parseFloat(lugar.areaServed.geo.latitude), lng: parseFloat(lugar.areaServed.geo.longitude)};
    initMap({
        position: posicion, 
        zoom: 14,
        arrPositionMarkers: [posicion]
    });

    $("main").empty()
        .attr("class","contenedor-principal info-museo")
        .append(crearBotonAtras(funcionAnterior));
    
    $("body").prepend(crearDiv()
        .attr("vocab","http://schema.org/")
        .attr("typeof", lugar["@type"])
        .append($("header"))
        .append($("main"))
    );

    // Creación del slider de imágenes
    $("main").append(crearDiv("swiper mySwiper slider-imagen-museo")
        .append(generarCarrousselFotos(lugar.areaServed.photo))
        .append(crearDiv("swiper-button-next"))
        .append(crearDiv("swiper-button-prev"))
        .append(crearDiv("swiper-pagination"))
    );

    // Creación de la información del museo
    $("main").append(crearDiv("section-museo")
        .append(crearArticuloMuseo(lugar)
            .append(crearDiv("botones-descripcion")
                .append(crearBoton("Leer más", "leer-mas-btn", "boton boton-verde")
                    .on("click", leerMas)
                )
                .append(crearBoton("", "escuchar-btn", "boton-verde btn-volume")
                    .on("click", () => speechDescription(lugar.areaServed.name, lugar.areaServed.description))
                    .append(crearImg("img/svg/volume.svg","Icono de volumen para escuchar el titulo y la descripcion","volume-icon")))
            )
            .append((generarDivExposiciones(lugar.areaServed.event)))
            .append(crearDiv("contenedor-botones-museo")
                .append($("<a>")
                    .addClass("boton boton-verde")
                    .html("Añadir a la ruta")
                    .on("click", () => almacenarVisita(lugar.areaServed.name, lugar.areaServed.address.streetAddress, lugar.areaServed["@type"][1]))
                )
                .append($("<a>")
                    .addClass("boton boton-gris boton-comp-entrada")
                    .attr({
                        "href":lugar.areaServed.tourBookingPage ?? lugar.areaServed.url,    // Si tiene web de entradas, redirige allí, sinó, redirige a la web inicial
                        "target":"_blank"
                    })
                    .html("Comprar entrada")
                    .append(crearImg("img/svg/boton-añadir-carrito.svg","Icono de redireccion"))
                )
            )
        )
        .append(crearDiv("vl").attr("id","separador-vertical-museo"))
        .append(crearHr().attr("id","separador-horizontal-museo"))
        .append(generarAsideMuseo(lugar))
    );
    activarSwipersImagenes();

    // Activar el swiper de exposiciones si hay exposiciones
    if (lugar.areaServed.event.length > 0) {
        activarExposicionSwiper();
    }
    
}

/**
 * Función que se encarga de crear una tarjeta de componente
 * @param {Array<Object>} fotos Array de objetos con las fotos del componente
 * @returns {JQuery<HTMLElement>} Un elemento div con el swipper de imagenes
 */
function generarCarrousselFotos(fotos) {
    let carrousselFotos = crearDiv("swiper-wrapper").attr("property","photos");
    fotos.forEach(foto => {
        carrousselFotos.append(crearDiv("swiper-slide")
            .append(crearImg(foto.contentUrl, foto.description, "imagen-museo")
                .attr("property","photo")
                .attr("typeof","ImageObject"))
        );
    });
    return carrousselFotos;
}

/**
 * Función que se encarga de crear el articulo del lugar junto con la descripción
 * @param {Object} lugar Lugar del que se quiere mostrar la información
 * @returns {JQuery<HTMLElement>} Un elemento article con la información del lugar
 */
function crearArticuloMuseo(lugar) {
    let articulo = crearArticle("main-museo").attr("property", "description");
    lugar.areaServed.description.split("\n").forEach((parrafo, index) => {
        if(index === 0) {
            articulo.append(crearP({
                clases: "desc-museum first-desc-museum-mobile",
                id: "first-desc-museum",
                texto: parrafo
            }));
        } else {
            articulo.append(crearP({
                clases: "desc-museum leer-mas",
                texto: parrafo
            }));
        }
    });
    return articulo;
}


/**
 * Función que se encarga de crear el swipper de exposiciones
 * @param {Object} exposiciones Exposiciones del museo
 * @returns {JQuery<HTMLElement>|string} Un elemento section con el swipper de exposiciones
 */
function generarDivExposiciones(exposiciones) {
    
    if (exposiciones !== "") {
        
        let expos = crearDiv("swiper-wrapper");
        exposiciones.forEach(expo => {
            expos.append($("<li>")
                .addClass("exposicion swiper-slide")
                .attr("property", "event")
                .attr("typeof", "Event")
                .append(crearImg(expo.image.contentUrl, expo.image.description)
                    .attr("property", "image"))
                .append(
                    crearP({
                        clases: "nombre",
                        texto: expo.name
                    })
                    .attr("property", "name")
                )
                .append(comprobarExposicionActual(expo))
            );
        });
        let exposDiv = crearSection()
        .append(crearH3("EXPOSICIONES", "mb-4"))
        .append($("<ol>")
            .addClass("exposiciones swiper")
            .append(expos));
        return exposDiv;
    } else {
        return "";
    
    }

}

/**
 * Función que se encarga de generar el aside del museo, con la información de horarios, dirección y precios
 * @param {object} lugar Lugar del que se quiere mostrar la información
 * @returns {JQuery<HTMLElement>} Un elemento aside con la información del museo
 */
function generarAsideMuseo(lugar) {
    let aside = $("<aside>");
    aside.append(crearDiv()
        .attr("property", "openingHours")
        .append($("<h5>").html("Horario"))
        .append(crearFechasHorarioLugar(lugar.areaServed.openingHours))
    )
    .append(crearTextoDirecciónLugar(lugar))
    .append(crearTextoPreciosLugar(lugar.hasOfferCatalog));

    return aside;
}

/**
 * Función que formatea el horario de un lugar del JSON a un formato indicado para la página web
 * @param {Array<string>|string} horario 
 * @returns {JQuery<HTMLElement>} Un elemento div con el horario del lugar
 */
function crearFechasHorarioLugar(horario) {
    let contenedor = crearDiv();
    let rangoDias = normalizarFormatoHorarioMuseoJSON(horario);
    let horarioEspañol = rangoDias.map(rango => {
        if(rango.rangoDias.diaFin.nombre) {
            return `${rango.rangoDias.diaInicio.nombre} a ${rango.rangoDias.diaFin.nombre}: ${rango.rangoHoras.horaInicio} - ${rango.rangoHoras.horaFin}`;
        } else {
            return `${rango.rangoDias.diaInicio.nombre}: ${rango.rangoHoras.horaInicio} - ${rango.rangoHoras.horaFin}`;
        }
    });

    if(horarioEspañol.length > 1) {
        for(let i = 0; i < horarioEspañol.length; i++) {
            contenedor.append($("<p>").html(horarioEspañol[i])
                .attr("content", horario[i]));
        }
        return contenedor;
    } else {
        return $("<p>").html(horarioEspañol[0])
            // @ts-ignore
            .attr("content", horario);
    }
}

/**
 * Función genérica para crear el texto con el formato correcto de la dirección de un lugar
 * @param {Object} lugar 
 * @returns 
 */
function crearTextoDirecciónLugar(lugar) {
    let direccion = lugar.areaServed.address;
    return crearDiv()
        .attr("property", "address")
        .attr("typeof", "PostalAddress")
        .append($("<h5>").html("Dirección"))
        .append($("<p>").html(direccion.streetAddress)).attr("property", "streetAddress")
        .append(crearDiv().html(`${direccion.postalCode} ${direccion.addressLocality}`)
            .attr("property", "addressLocality")
            .append($("<meta>").attr("property", "postalCode").attr("content", direccion.postalCode))
            .append($("<meta>").attr("property", "addressLocality").attr("content", direccion.addressLocality)));
}

/**
 * Función genérica para crear el texto con el formato correcto de los precios de un lugar
 * @param {Object} catalogoOfertas Objeto con las ofertas del lugar
 * @returns 
 */
function crearTextoPreciosLugar(catalogoOfertas) {
    const contenedor = $("<div>")
        .append($("<h5>").html("Precios"));
    if (!catalogoOfertas) {
        contenedor.append($("<p>").html("Entrada general: Gratuito"));
        return contenedor;
    }
    contenedor.attr("property", "hasOfferCatalog").attr("typeof", "OfferCatalog");
    contenedor.append($("<div>").attr("property", "itemListElement"));
    let ofertas = catalogoOfertas.itemListElement.forEach(offer => {
        let precio = parseFloat(offer.price);
        let contenedorPrecio = $("<p>").attr("typeof", "Offer");
        if (precio === 0) {
            contenedorPrecio.html(`${offer.itemOffered.name}: Gratuito`);
        } else if (Number.isInteger(precio)) {
            contenedorPrecio.html(`${offer.itemOffered.name}: ${precio}€`);
        } else {
            contenedorPrecio.html(`${offer.itemOffered.name}: ${precio.toFixed(2)}€`);
        }
        contenedorPrecio
            .append($("<meta>").attr("property", "price").attr("content", offer.price))
            .append($("<div>").attr("property", "itemOffered").attr("typeof", "Product")
                .append($("<meta>").attr("property", "name").attr("content", offer.itemOffered.name)));
        contenedor.append(contenedorPrecio);
    });
    // Une el array de String a un único String con saltos de línea
    return contenedor;
}

// Método para el funcionamiento del botón de leer más en pantalla-museo
function leerMas() {
    const parrafosAdicionales = $(".leer-mas").toggle();
    $("#first-desc-museum").toggleClass("first-desc-museum-mobile");

    if (parrafosAdicionales.is(":hidden")) {
        if (!primerParrafoVisible()) {
            $("#first-desc-museum")[0].scrollIntoView({ behavior: 'smooth', block: 'start' }); // Desplazar hacia el inicio del primer párrafo
        }
        $("#leer-mas-btn").html("Leer más");
    } else {
        $("#leer-mas-btn").html("Leer menos");
    }
}

function primerParrafoVisible() {
    const primerParrafo = $("#first-desc-museum");
    //@ts-ignore
    return primerParrafo.offset().top >= $(window).scrollTop();
}

function comprobarExposicionActual(expo) {
    const contenedor = $("<div>").attr("property", "eventSchedule").attr("typeof", "Schedule");
    const p = $("<p>").addClass("fecha-exp").attr("property", "eventSchedule");
    
    
    if(expo.eventSchedule.startDate <= new Date().toISOString() && expo.eventSchedule.endDate >= new Date().toISOString()) {
        p.addClass("fecha-verde").text("Hasta el " + convertirFormatoFechaExposicion(expo.eventSchedule.endDate))
    } else {
        p.text(convertirFormatoFechaExposicion(expo.eventSchedule.startDate) + " - " + convertirFormatoFechaExposicion(expo.eventSchedule.endDate));
    }
    contenedor.append(p)
    .append($("<meta>").attr("property", "startDate").attr("content", expo.eventSchedule.startDate))
    .append($("<meta>").attr("property", "endDate").attr("content", expo.eventSchedule.endDate));

    return contenedor;
}