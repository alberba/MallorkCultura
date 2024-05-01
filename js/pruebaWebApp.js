const jsonUrlMuseos = "json/museosMallorkCultura.json";
const jsonUrlPueblos = "json/pueblos.json";
const jsonUrlComponentes = "json/componentes.json";
const centroMallorca = {lat: 39.61809784502291, lng: 2.9967532462301167};
let museos;
let pueblos;
let componentes;
let speechSynthesisActivado = false;

// leer json de museos
fetch(jsonUrlMuseos)
    .then(response => response.json())
    .then(data => {
        museos = data.servicios;
    })
    .catch(error => console.error("Error al cargar los datos del JSON:", error));

// leer json de pueblos
fetch(jsonUrlPueblos)
    .then(response => response.json())
    .then(data => {
        pueblos = data.cities;
        // Se llama a la función desde aquí para no tener que esperar a que se cargue el JSON
        crearDondeVisitar();
    })
    .catch(error => console.error("Error al cargar los datos del JSON:", error));

// leer json de componentes
fetch(jsonUrlComponentes)
    .then(response => response.json())
    .then(data => {
        componentes = data.personas;
    })
    .catch(error => console.error("Error al cargar los datos del JSON:", error));

/* --- Eventos de botones --- */
// Rehacer la página principal
$("#logo").on("click", crearDondeVisitar);

$("#queVisitar").on("click", crearPantallaUbicaciones);

$("#tuRuta").on("click", crearTuRuta);

$("#Contacto").on("click", crearContacto);

/* --- --- */


/* --- Funciones "creadoras" --- */
/**
 * Función que se encarga de crear la pantalla principal de la web
 */
function crearDondeVisitar() {
    // Hacer que la página suba al principio
    window.scrollTo(0, 0);
    // Elimina el contenido del header y añade el nuevo. Esto se hace para que, en caso de estar el mapa de otra página,
    // se elimine y no se quede en la página principal
    $("header > div").remove();
    $("header").append(crearDiv("overlay header-image")
        .append(crearImg("img/main.webp","Fotografía de dos monumentos de Es Baluard","imagen-overlay"))
        .append(crearDiv("texto-main-page texto-overlay m-0")
            .append($("<h1>").addClass("mu-0 mb-4").html("MallorkCultura"))
            .append(crearP({texto: "Planifica tu ruta ya"}))
        )
    );

    $("main").empty();
    $("main").attr("class","contenedor-principal index");
    $("main").append(crearH2("¿Dónde visitar?"));
    $("main").append(crearHr());
    let section = crearSection ();
    let div = crearContenedorPueblos();
    $(section).append(div);
    for(let i = 0; i < 9; i++) {
        div.append(crearBotonPueblo(pueblos[i]));
    }
    $("main").append(section);
    $("main").append(crearBotonVerMas_Pueblos());
    $("main").append(crearHr());
}


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

    // Inicializa el mapa con el centro de Mallorca y los marcadores de todos los museos
    initMap({
        position: centroMallorca, 
        zoom: 9,
        arrPositionMarkers: museos.map(museo => ({lat: parseFloat(museo.areaServed.geo.latitude), lng: parseFloat(museo.areaServed.geo.longitude)}))
    });

    $("main").empty()
    $("main").attr("class","contenedor-principal lista-museos")
        .append(crearBotonAtras(crearDondeVisitar, "Inicio"))
        .append(crearFiltros());

    let contenedorMuseo = crearDiv("contenedor-museos");
    // Añade las tarjetas de los museos
    museos.forEach(museo => {
        contenedorMuseo.append(crearTarjetaUbicacion(museo, crearPantallaUbicaciones)
        )
    });

    $("main").append(crearSection().append(contenedorMuseo));
    $("main").append(crearSelectorPagina());
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
    let museosPueblo = museos.filter(museo => museo.areaServed.address.addressLocality === pueblo);
    iniciarMapaPueblo(pueblos.find(p => p.name === pueblo), museosPueblo);

    $("main").empty()
    $("main").attr("class","contenedor-principal lista-museos");
    $("main").append(crearBotonAtras(crearDondeVisitar, "Inicio"));
    $("main").append(crearH2(pueblo));
    $("main").append(crearHr());
    $("main").append(crearFiltros());

    let contenedorMuseos = crearDiv("contenedor-museos");
    museosPueblo.forEach(museo => {
        contenedorMuseos.append(crearTarjetaUbicacion(museo, () => crearUbicacionesPueblo(pueblo)));
    });
    $("main").append(crearSection().append(contenedorMuseos));

    $("main").append(crearSelectorPagina());
}

/**
 * Función que se encarga de crear la pantalla de información de un lugar en concreto
 * @param {String} nombreLugar Nombre del lugar del que se quiere mostrar la información
 * @param {Function} funcionAnterior Función que se ejecutará al pulsar el botón de atrás
 */
function crearInfoUbi(nombreLugar, funcionAnterior){
    const lugar = museos.find(museo => museo.areaServed.name === nombreLugar);
    // Hacer que la página suba al principio
    window.scrollTo(0, 0);
    // Elimina el contenido del header y añade el nuevo. Esto se hace para que, en caso de estar la imagen 
    // de portada de la pantalla principal, se elimine
    $("header > div").remove();
    $("header").append(crearDiv("mapa-museo map-container")
        .append(crearDiv("ubi-header").attr("id","map"))
        .append(crearDiv("contenedor-titulo-museo")
            .append($("<h2>").addClass("m-0 titulo-museo").attr("id", "titulo-museo").html(lugar.areaServed.name))
        )
    );

    // Inicializa el mapa con la posición del lugar
    let posicion = {lat: parseFloat(lugar.areaServed.geo.latitude), lng: parseFloat(lugar.areaServed.geo.longitude)};
    initMap({
        position: posicion, 
        zoom: 14,
        arrPositionMarkers: [posicion]
    });

    $("main").empty();
    $("main").attr("class","contenedor-principal info-museo");
    $("main").append(crearBotonAtras(funcionAnterior));

    // Creación del slider de imágenes
    $("main").append(crearDiv("swiper mySwiper slider-imagen-museo")
        .append(generarCarrousselFotos(lugar.areaServed.photo))
        .append(crearDiv("swiper-button-next"))
        .append(crearDiv("swiper-button-prev"))
        .append(crearDiv("swiper-pagination"))
    );

    // Creación de la información del museo
    $("main").append(crearDiv("section-museo")
        .append(generarArticuloLugarYDescripcion(lugar)
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
                    //TODO: Cambiar esto
                    .html("Añadir a la ruta")
                )
                .append($("<a>")
                    .addClass("boton boton-gris boton-comp-entrada")
                    .attr({
                        "href":lugar.areaServed.tourBookingPage ?? lugar.areaServed.url,    // Si tiene web de entradas, redirige allí, sinó, redirige a la web inicial
                        "target":"_blank"
                    })
                    //TODO: Cambiar esto
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

function speechDescription(titulo, descripcion) {
    if (speechSynthesisActivado) {
        window.speechSynthesis.cancel();
        speechSynthesisActivado = false;
    } else {
        speechSynthesisActivado = true;
        const mensajeTitulo = new SpeechSynthesisUtterance(titulo);
        window.speechSynthesis.speak(mensajeTitulo);
        const mensajeTexto = new SpeechSynthesisUtterance(descripcion);
        window.speechSynthesis.speak(mensajeTexto);
        
    }
    
}

/**
 * Función que se encarga de crear la pantalla de la ruta
 */
function crearTuRuta(){
    window.scrollTo(0, 0);
    // Elimina el contenido del header y añade el nuevo. Esto se hace para que, en caso de estar la imagen 
    // de portada de la pantalla principal, se elimine
    $("header > div").remove();
    $("header").append(crearDiv("mapa-museo map-container")
        .append(crearDiv("ubi-header").attr("id","map"))
    );
    
    $("main").empty();
    $("main").attr("class","contenedor-principal ruta");
    $("main").append(crearBotonAtras(crearDondeVisitar, "Inicio"));
    $("main").append(crearH2("Tu ruta"))
        .append(crearHr);

    $("main").append(mostrarTiempo("Palma"));

    $("main").append(crearDiv("contenedor-ruta-general mt-5", "ctdRuta")
        .append(crearDiv("vl"))
        .append($("<ul>").addClass("section-ruta"))    
    ).append(crearDiv("guardar-calendar"));

    // TODO: Añadir el apartado de Carlos de WEBSTORAGE
    mostrarRuta();

    // TODO: Añadir el mapa con la ruta
    let eventos = recuperarVisitas();
    let eventosGeo = eventos.map(evento => {
        let museo = museos.find(museo => museo.areaServed.name === evento.lugar);
        console.log(museo);
        return {lat: parseFloat(museo.areaServed.geo.latitude), lng: parseFloat(museo.areaServed.geo.longitude)};
    });
    console.log(eventosGeo);
    initMap({position: centroMallorca,
        zoom: 9,
        arrPositionRoutes: eventosGeo
    })
}

/**
 * Función que se encarga de crear la pantalla de contacto
 */
function crearContacto() {
    window.scrollTo(0, 0);
    $("header > div").remove();
    $("header").append(crearDiv("overlay header-image")
        .append(crearImg("img/main.webp","Fotografía de dos monumentos de Es Baluard","imagen-overlay"))
        .append(crearDiv("texto-main-page texto-overlay m-0")
            .append($("<h1>").addClass("mu-0 mb-4").html("MallorkCultura"))
            .append(crearP({texto: "Planifica tu ruta ya"}))
        )
    );
    $("main").empty();
    $("main").attr("class","contenedor-principal contacto");
    $("main").append(crearH2("¿Quiénes somos?"))
            .append(crearHr);
    let div = crearDiv("contenedor-contacto my-5");
    componentes.forEach(componente => {
        let comp = crearTarjetaContacto(componente);
        comp.find("img:first").addClass("imagen-contacto");
        div.append(comp);
    });
    $("main").append(div);
    $("main").append(crearDiv("contenedor-logo-uib my-5")
                        .append(crearH2(" como estudiantes de "))
                        .append(crearImg("img/logo_UIB.webp", "Logo de la UIB","my-5")
                                .on("click",function(){window.open("https://uib.cat")})
                            )
                );
}
/* --- --- */

/* --- Funciones específicas --- */
/**
 * Función que se encarga de leer del webStorage y crea las componentes para mostrar la ruta al usuario
 * 
 */
function mostrarRuta() {
    const eventos = recuperarVisitas();
    const contenedorRuta = $('.section-ruta');
    
    // Limpiar el contenido existente del contenedor
    contenedorRuta.innerHTML = '';

    // Verificar si hay eventos
    if (eventos.length === 0) {
        // Si no hay eventos, mostrar un mensaje
        contenedorRuta.innerHTML = '<p>Todavía no has empezado a diseñar tu ruta</p>';
        var botonGuardar = $('.guardar-calendar button');
        if(botonGuardar != null){
            botonGuardar.remove();
        }
    } else {
        // Si hay eventos, mostrar cada uno en la lista
        eventos.forEach((evento, index) => {
            const duracion = calcularDuracion(evento.horaInicio, evento.horaFin);
            const descanso = index === eventos.length - 1 ? '' : '<div><p class="descanso">Descanso: 1h</p></div>';

            const li = document.createElement('li');
            li.classList.add('parada-ruta');

            const divLeft = crearDiv("left-museo-ruta");

            divLeft.appendChild(crearP({clases: "horas", texto: `${evento.horaInicio.split('T')[1].slice(0, 5)} - ${evento.horaFin.split('T')[1].slice(0, 5)}`}));

            divLeft.appendChild(crearSpan('circ',""));

            li.appendChild(divLeft);

            const divRight = crearDiv("right-museo-ruta");

            const h5Container = crearDiv("parada-ruta museo-container");

            const h5 = document.createElement('h5');
            h5.textContent = evento.lugar;

            const botonEliminar = crearBoton("","",'no-style-button cruz-ruta');
            botonEliminar.setAttribute('onclick', `eliminarMuseoRuta(${index})`);
            const imgCruz = crearImg('img/svg/cruz.svg', 'Símbolo de cruz para tachar un museo de la ruta');
            botonEliminar.appendChild(imgCruz);

            h5Container.appendChild(h5);
            h5Container.appendChild(botonEliminar);

            divRight.appendChild(h5Container);

            const formulario = crearForm("","formulario-ruta");

            const divInicio = crearDiv();
            const labelInicio = crearLabel("","Inicio");
            labelInicio.setAttribute('for', 'inicio');
            const selectInicio = crearSelect("inicio","","");
            
            const textoInicio = evento.horaInicio.split('T')[1].slice(0, 5); // Mostrar solo hora y minutos
            //TODO ARREGLAR EL DESPLEGABLE DE INICIO
            const optionInicio = crearOption(textoInicio,0,true);
            selectInicio.appendChild(optionInicio);
            divInicio.appendChild(labelInicio);
            divInicio.appendChild(selectInicio);

            formulario.appendChild(divInicio);

            const divDuracion = crearDiv();
            const labelDuracion = crearLabel("",'Duración');
            labelDuracion.setAttribute('for', 'duracion');
            const selectDuracion = crearSelect("duracion","","");
            //TODO ARREGLAR EL DESPLEGABLE DE DURACION
            const optionDuracion = crearOption(duracion,0,true);
            selectDuracion.appendChild(optionDuracion);
            divDuracion.appendChild(labelDuracion);
            divDuracion.appendChild(selectDuracion);

            formulario.appendChild(divDuracion);
            divRight.appendChild(formulario);

            

            li.appendChild(divRight);
            contenedorRuta.appendChild(li);
            contenedorRuta.innerHTML += descanso;
        });
        var botonGuardar = $('.guardar-calendar button');
        if(botonGuardar == null){
            const contenedorBoton = $('.guardar-calendar');

            botonGuardar = crearBoton('Añadir a calendar','add-to-calendar-button',"boton boton-verde");
            botonGuardar.setAttribute('onclick', 'handleAuthClick()');

            // Insertar el botón después de la lista de eventos
            contenedorBoton.appendChild(botonGuardar);
        }
    }
}

/** 
 * Función para calcular la duración entre dos horas
 * @param horaInicio Date con la fecha a la que empieza un evento
 * @param horaFin Date con la fecha a la que termina el mismo evento
 * @return Un string con la hora y minutos que hay de diferencia
 */
function calcularDuracion(horaInicio, horaFin) {
    const inicio = new Date(horaInicio);
    const fin = new Date(horaFin);
    const duracionMinutos = Math.round((fin.getTime() - inicio.getTime()) / (1000 * 60)); // Convertir milisegundos a minutos y redondear
    return `${Math.floor(duracionMinutos / 60)}h ${duracionMinutos % 60}min`; // Mostrar duración con horas y minutos
}

/**
 * Funcion que elimina un evento de la ruta
 * @param index indice del evento a eliminar 
 */
function eliminarMuseoRuta(index) {
    const eventos = recuperarVisitas();
    eventos.splice(index, 1); // Eliminar el evento correspondiente al índice
    localStorage.setItem('visitas', JSON.stringify(eventos)); // Actualizar el localStorage
    mostrarRuta(); // Mostrar la ruta actualizada
}

/**
 * Función que recupera el array de objetos evento si existe, sino devuelve un array vacío
 * @returns devuelve un array de objetos evento
 */
function recuperarVisitas() {
    const visitas = localStorage.getItem('visitas');
    return visitas ? JSON.parse(visitas) : [];
}

/**
 * Función que se encarga de crear una tarjeta de componente
 * @param {Array<Object>} fotos Array de objetos con las fotos del componente
 * @returns {JQuery<HTMLElement>} Un elemento div con el swipper de imagenes
 */
function generarCarrousselFotos(fotos) {
    let carrousselFotos = crearDiv("swiper-wrapper");
    fotos.forEach(foto => {
        carrousselFotos.append(crearDiv("swiper-slide")
            .append(crearImg(foto.contentUrl, foto.description, "imagen-museo"))
        );
    });
    return carrousselFotos;
}

/**
 * Función que se encarga de crear el articulo del lugar junto con la descripción
 * @param {Object} lugar Lugar del que se quiere mostrar la información
 * @returns {JQuery<HTMLElement>} Un elemento article con la información del lugar
 */
function generarArticuloLugarYDescripcion(lugar) {
    let articulo = crearArticle("main-museo");
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
                .append(crearImg(expo.image.contentUrl, expo.image.description))
                .append(crearP({
                    clases: "nombre",
                    texto: expo.name
                }))
                .append(crearP({
                    clases: "fecha-exp",
                    texto: expo.eventSchedule.startDate + " - " + expo.eventSchedule.endDate
                }))
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
        .append($("<h5>").html("Horario"))
        .append(crearP({
            clases: "",
            texto: crearFechasHorarioLugar(lugar.areaServed.openingHours)
        }))
    )
    .append(crearDiv()
        .append($("<h5>").html("Dirección"))
        .append(crearP({
            clases: "",
            texto: crearTextoDirecciónLugar(lugar)
        }))
    )
    .append(crearDiv()
        .append($("<h5>").html("Precios"))
        .append(crearP({
            clases: "",
            texto: crearTextoPreciosLugar(lugar.hasOfferCatalog)
        }))
    );

    return aside;
}

/**
 * Función que formatea el horario de un lugar del JSON a un formato indicado para la página web
 * @param {Array<string>|string} horario 
 * @returns {string} El horario formateado
 */
function crearFechasHorarioLugar(horario) {
    let dias = {
        "Mo": "Lunes",
        "Tu": "Martes",
        "We": "Miércoles",
        "Th": "Jueves",
        "Fr": "Viernes",
        "Sa": "Sábado",
        "Su": "Domingo"
    };
    if (!Array.isArray(horario)) {
        let [diasIngles, horas] = horario.split(" ");
        let [diaInicio, diaFin] = diasIngles.split("-");
        return diaFin ? `${dias[diaInicio]} a ${dias[diaFin]}: ${horas}` : `${dias[diaInicio]}: ${horas}`;
    } else {
        let horarioEspañol =  horario.map(horario => {
            let [diasIngles, horas] = horario.split(" ");
            let [diaInicio, diaFin] = diasIngles.split("-");
            return diaFin ? `${dias[diaInicio]} a ${dias[diaFin]}: ${horas}` : `${dias[diaInicio]}: ${horas}`;
        });
    
        return horarioEspañol.join("<br>");
    }
}

/**
 * Función genérica para crear el texto con el formato correcto de la dirección de un lugar
 * @param {Object} lugar 
 * @returns 
 */
function crearTextoDirecciónLugar(lugar) {
    let direccion = lugar.areaServed.address;
    return `${direccion.streetAddress} <br>
            ${direccion.postalCode} ${direccion.addressLocality} <br>
            ${lugar.areaServed.telephone.replace("+34", "").replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4")} <br>
            ${direccion.email}`;
}

/**
 * Función genérica para crear el texto con el formato correcto de los precios de un lugar
 * @param {Object} catalogoOfertas Objeto con las ofertas del lugar
 * @returns 
 */
function crearTextoPreciosLugar(catalogoOfertas) {
    if (!catalogoOfertas) {
        return "Entrada general: Gratuito"
    }
    let ofertas = catalogoOfertas.itemListElement.map(offer => {
        let precio = parseFloat(offer.price);
        if (precio === 0) {
            return `${offer.itemOffered.name}: Gratuito`;
        } else if (Number.isInteger(precio)) {
            return `${offer.itemOffered.name}: ${precio}€`;
        } else {
            return `${offer.itemOffered.name}: ${precio.toFixed(2)}€`;
        }
        
    });
    // Une el array de String a un único String con saltos de línea
    return ofertas.join("<br>");
}

//función específica - ¿Dónde visitar? --> Pensar en sustituirla
function crearContenedorPueblos() {
    return $("<div>").attr("class", "contenedor-pueblos my-5");
}

/**
 * Función que se encarga de crear un botón de un pueblo de la página principal ¿Dónde visitar?
 * @param {Object} pueblo Objeto con la información del pueblo
 * @returns {JQuery<HTMLElement>} Un elemento button con la información del pueblo
 */
function crearBotonPueblo (pueblo) {
    let nuevoBotonPueblo = $("<button>")
    .addClass("pueblo overlay col-lg-4")
    .on("click",() => crearUbicacionesPueblo(pueblo.name));
    $(nuevoBotonPueblo)
        .append(
            crearImg(pueblo.photo.contentUrl, pueblo.photo.description,"imagen-overlay")
        )
        .append(
            crearP({clases: "texto-overlay", texto: pueblo.name})
        );
    return nuevoBotonPueblo;
}

/**
 * Función que se encarga de añadir los pueblos restantes a la página principal ¿Dónde visitar?
 */
function añadirPueblosRestantes() {
    for(let i = 9; i < pueblos.length; i++) {
        $("main .contenedor-pueblos").append(crearBotonPueblo(pueblos[i]));
    } 
    $("#verMasPueblos").remove();
}

/**
 * Función que se encarga de crear el botón "Ver más" de la página principal ¿Dónde visitar?. 
 * Al darle al botón, se llamará a la función añadirPueblosRestantes
 * @returns {JQuery<HTMLElement>} Un elemento button con el botón "Ver más"
 */
function crearBotonVerMas_Pueblos() {
    return $("<button>")
            .addClass("boton boton-vermas-index boton-verde")
            .text("Ver más")
            .attr("id","verMasPueblos")
            .on("click", añadirPueblosRestantes);
}

/**
 * Función que se encarga de crear una tarjeta de componente
 * @param funcionADirigir La función a la que se dirigirá al pulsar el botón. 
 *                        Deberá ser la función que se encarga de crear la pantalla anterior
 * @param {String=} texto Texto que se le quiere añadir al botón. Por defecto es "Atrás"
 * @returns {JQuery<HTMLElement>} Un elemento button con el botón de volver atrás
 */
function crearBotonAtras(funcionADirigir, texto = "Atrás") {
    return $("<button>")
            .html(texto)
            .addClass("boton-atras")
            .prepend(crearImg("img/svg/flecha-atras.svg","Botón de volver atrás","back-arrow"))
            .on("click", funcionADirigir);
}

/**
 * Función que se encarga de crear la tarjeta de los lugares de la lista de ubicaciones
 * @param {Object} museo Museo del que se quiere crear la tarjeta
 * @param funcionAnterior Función actual. Servirá para crear posteriormente el botón Atrás
 * @returns {JQuery<HTMLElement>} Un elemento article con la información del museo
 */
function crearTarjetaUbicacion(museo, funcionAnterior) {
    return crearArticle("museo")
             .append(crearImg(museo.areaServed.photo[0].contentUrl, museo.areaServed.photo[0].description))
             .append(crearHeader("titulo-museo-card").append(crearH4(museo.areaServed.name)))
             .append(crearP({
                 clases: "mb-4 descripcion-museo",
                 texto: museo.areaServed.description        
             }))
             .append(crearDiv("botones-museo")
                 .append(crearBoton("Añadir", "", "boton boton-card-museo boton-verde")
                     .on("click", () => almacenarVisita(escaparComillas(museo.areaServed.name), escaparComillas(museo.areaServed.address.streetAddress), museo.areaServed["@type"][1]))   // Aquí hay que añadir la función para añadir a la ruta
                 )
                 .append(crearBoton("Ver más", "Y", "boton boton-card-museo boton-gris")
                     .on("click", () => crearInfoUbi(museo.areaServed.name, funcionAnterior))
                 )        
             );
}

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

// función específica - Lista de ubicaciones
// esta habrá que cambiarla
function crearSelectorPagina() {
    return crearDiv("paginas")
        .append(crearImg("img/svg/prev-page-arr.svg","Página anterior"))
        .append(crearP({
                clases:"",
                texto:".."
            })
            .prepend(crearSpan("pagina-actual","1"))
            .append(crearSpan("","2"))
        )
        .append(crearImg("img/svg/next-page-arr.svg","Página siguiente"));
}

/**
 * Función que se encarga de crear una tarjeta de contacto
 * @param {Object} componente Objeto JSON con la información del contacto
 * @returns {JQuery<HTMLElement>} Un elemento article con la información del contacto
 */
function crearTarjetaContacto(componente) {
    return crearArticle("componente")
        .append(crearImg(componente.image.contentUrl,componente.image.description))
        .append(crearHeader("titulo-componente-card")
                .append(crearH4(" " + componente.familyName)
                            .prepend(crearSpan("apellidos-contacto", componente.givenName))
                )
            )
        .append(crearDiv()
                    .append(crearA("mailto:"+componente.email, "enlace-contacto", "")
                        .append(crearImg("img/svg/icono-correo.svg","Icono de correo"))
                    )
            );
}

// Función para almacenar la visita con los detalles del museo
function almacenarVisita(lugar, direccion, tipo) {
    console.log("ALMACENAR VISITA");
    const evento = { lugar, direccion, horaInicio: "2024-06-01T09:00:00", horaFin: "2024-06-01T10:00:00", tipo };
    console.log("EVENTO CREADO:", evento);
    actualizarVisitas(evento);
    console.log("VISITA AÑADIDA");
}

// Función para escapar las comillas simples en un texto
function escaparComillas(texto) {
    return texto.replace(/'/g, "\\'");
}

/* --- FUNCIONES GENÉRICAS --- */

/**
 * Función genérica para generar un section
 * @returns {JQuery<HTMLElement>} Un elemento section
 */
function crearSection () {
    return $("<section></section>");
}

/**
 * Función genérica para generar un article
 * @param {String=} clases Optional. Clases que se le quieren añadir al article
 * @returns {JQuery<HTMLElement>} Un elemento article
 */
function crearArticle(clases = "") {
    return $("<article>").addClass(clases);
}

/**
 * Función genérica para generar un Header
 * @param {String=} clases Clases que se le quieren añadir al header
 * @returns {JQuery<HTMLElement>} Un elemento header
 */
function crearHeader(clases = "") {
    return $("<header>").addClass(clases);
}

/**
 * Función genérica para generar un H2
 * @param {String} titulo Titulo del H2 
 * @returns {JQuery<HTMLElement>} Un elemento h2
 */
function crearH2(titulo) {
    return $("<h2>").addClass("mt-5").html(titulo);
}

/**
 * Función genérica para generar un H3
 * @param {String} titulo Titulo del H3
 * @param {String=} clases Optional. Clases que se le quieren añadir al h3
 * @returns {JQuery<HTMLElement>} Un elemento h3
 */
function crearH3(titulo, clases="") {
    return $("<h3>").addClass(clases).html(titulo);
}

/**
 * Función genérica para generar un H4
 * @param {String} titulo 
 * @returns {JQuery<HTMLElement>} Un elemento h4
 */
function crearH4(titulo) {
    return $("<h4>").addClass("mb-2 mt-3").html(titulo);
}

/**
 * Función genérica para generar un Hr
 * @returns {JQuery<HTMLElement>} Un elemento hr
 */
function crearHr() {
    return $("<hr>");
}

/**
 * Función genérica para generar un div
 * @param {String=} clases Optional. Clases que se le quieren añadir al div
 * @param {String=} id Optional. Id del div
 * @returns {JQuery<HTMLElement>} Un elemento div
 */
function crearDiv(clases = "", id="") {
    return $("<div>").addClass(clases).attr("id",id);
}

/**
 * Función genérica para generar un img
 * @param {String} direc Dirección de la imagen
 * @param {String=} textAl Optional. Texto alternativo de la imagen
 * @param {String=} clases Optional. Clases que se le quieren añadir a la imagen
 */
function crearImg(direc, textAl = "", clases = "") {
    return $("<img>")
        .attr({
            "src":direc,
            "alt":textAl,
            "class": clases
        });
}

/**
 * Crea un elemento de párrafo (p) con las clases, el texto y el id especificados.
 * @param {Object} param0 - Un objeto que contiene las propiedades del párrafo.
 * @param {string=} param0.clases - Las clases CSS que se aplicarán al párrafo. Por defecto es una cadena vacía.
 * @param {string} param0.texto - El texto que se mostrará en el párrafo.
 * @param {string=} param0.id - El id que se asignará al párrafo. Por defecto es una cadena vacía.
 * @returns {JQuery<HTMLElement>} Un elemento de párrafo (p) de jQuery con las propiedades especificadas.
 */
function crearP({clases = "", texto, id = ""}) {
    return $("<p>").
        attr({
            "id":id,
            "class":clases
        }).html(texto);
}

/**
 * Función genérica para generar un botón
 * @param {String} texto Texto que se le quiere añadir al botón
 * @param {String=} id Optional. Id del botón
 * @param {String=} clases Clases que se le quieren añadir al botón
 * @returns {JQuery<HTMLElement>} Un elemento button
 */
function crearBoton(texto, id = "", clases = "") {
    return $("<button>").
        attr({
            "id":id,
            "class":clases
        })
        .html(texto);
}

/**
 * Función genérica para generar un formulario
 * @param {String} id Id del formulario
 * @param {String=} clases Optional. Clases que se le quieren añadir al formulario
 * @returns {JQuery<HTMLElement>} Un elemento form
 */
function crearForm(id, clases = "") {
    return $("<form>")
        .attr({
            "id":id,
            "class":clases
        });
}

/**
 * Función genérica para generar un label
 * @param {String} inputName input al que adherirse
 * @param {String} text Texto del label
 * @returns {JQuery<HTMLElement>} Un elemento label
 */
function crearLabel(inputName, text){
    return $("<label>")
        .attr("for",inputName)
        .html(text);
}

/**
 * Función genérica para generar un input
 * @param {String} tipo Tipo de input
 * @param {String} nombre Nombre del input
 * @param {String=} id Optional. Id del input
 * @param {String=} clase Optional. Clases que se le quieren añadir al input
 * @param {String=} plcHold Optional. Placeholder del input
 * @returns {JQuery<HTMLElement>} Un elemento input
 */
function crearInput(tipo, nombre, id = "", clase ="", plcHold = "") {
    return $("<input>")
        .attr({
            "type":tipo,
            "name":nombre,
            "id":id,
            "class": clase,
            "placeholder":plcHold
        });
}

/**
 * Función genérica para generar un select
 * @param {string} nombre Nombre del select
 * @param {string} id Id del select
 * @param {string} clases Clases que se le quieren añadir al select 
 * @returns {JQuery<HTMLElement>} Un elemento select
 */
function crearSelect(nombre, id, clases){
    return $("<select>")
        .attr({
            "name": nombre,
            "id" : id,
            "class": clases
        });
}

/**
 * Función genérica para generar un option
 * @param {string} texto El texto del option
 * @param {number} valor El valor del option
 * @param {boolean=} seleccionado 
 * @returns {JQuery<HTMLElement>} Un elemento option
 */
function crearOption(texto, valor, seleccionado = false) {
    let opt = $("<option>")
        .attr("value", valor)
        .html(texto);
    if(seleccionado) {
        opt.prop("selected", true);
    }
    return opt;
}

/**
 * Función genérica para generar un span
 * @param {String} clases Clases que se le quieren añadir al span
 * @param {string} texto Texto que se le quiere añadir al span
 * @returns {JQuery<HTMLElement>} Un elemento span
 */
function crearSpan(clases, texto) {
    return $("<span>").addClass(clases).html(texto);
}

/**
 * Función genérica para generar un anchor
 * @param {string} direccionamiento El enlace al que se redirigirá el anchor
 * @param {string} clases Las clases que se le quieren añadir al anchor 
 * @param {string} texto El texto que se le quiere añadir al anchor
 * @returns {JQuery<HTMLElement>} Un elemento anchor
 */
function crearA(direccionamiento, clases, texto) {
    return $("<a>")
            .attr({
                "href" : direccionamiento,
                "class" : clases
            })
            .html(texto)
}
/* --- --- */

/* --- --- */