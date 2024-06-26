const centroMallorca = {lat: 39.61809784502291, lng: 2.9967532462301167};
const museosPorPagina = 9;

let speechSynthesisActivado = false;
let paginaActual;

/**
 * Función que se encarga de llamar a las funciones para generar el contenido 
 * dinámicamente de la web a partir de la URL
 */
function cargarContenido() {
    let url = window.location.pathname;
    switch(url) {
        case "/":
        case "/index":
            crearDondeVisitar();
            break;
        case "/queVisitar":
            let pueblo = decodeURIComponent(window.location.search.substring(1));
            if (pueblo) {
                crearUbicacionesPueblo(pueblo);
            } else {
                crearPantallaUbicaciones();
            }
            break;
        case "/museo":
            let museo = decodeURIComponent(window.location.search.substring(1));
            crearPantallaUbicacion(museo);
            break;
        case "/tuRuta":
            crearTuRuta(null);
            break;
        case "/contacto":
            crearContacto();
            break;
        default:
            crearPagina404();
    }
}

function crearPagina404() {
    // Hacer que la página suba al principio
    window.scrollTo(0, 0);
    // Elimina el contenido del header y añade el nuevo
    $("header").remove();
    // Añade el contenido de la página 404
    $("main").empty().append(
        crearDiv("error-404")
            .append($("<h1>").text("Página no encontrada"))
            .append(crearP({texto: "Lo sentimos, la página que estás buscando no existe."}))
    );
}

// Manejar los enlaces en caso de que se de click a los botones de la barra de navegación
window.addEventListener('popstate', cargarContenido);

/**
 * Función que se encarga de crear la pantalla principal de la web
 */
function crearDondeVisitar() {
    // Hacer que la página suba al principio
    window.scrollTo(0, 0);
    // Elimina el contenido del header y añade el nuevo. Esto se hace para que, en caso de estar el mapa de otra página,
    // se elimine y no se quede en la página principal
    if ($(".overlay").length === 0) {
        console.log("No hay overlay");
        $("header > div").remove();
        $("header").append(crearDiv("overlay header-image")
            .append(crearImg("img/main.webp","Fotografía de dos monumentos de Es Baluard","imagen-overlay")
                .attr("sizes", "100vw")
                .attr("fetchpriority", "high")
                .attr("srcset", "img/main.webp 2560w, img/main-2290.webp 2290w, img/main-1990.webp 1990w, img/main-1640.webp 1640w, img/main-1180.webp 1180w, img/main-300.webp 300w"))
            .append(crearDiv("texto-main-page texto-overlay m-0")
                .append($("<h1>").addClass("mu-0 mb-4").html("MallorkCultura"))
                .append(crearP({texto: "Planifica tu ruta ya", clases: "subtitulo-main"}))
            )
        );
    }

    $("main").empty();
    $("main").attr("class","contenedor-principal index");
    $("main").append(crearH2("¿Dónde visitar?"));
    $("main").append(crearHr());
    let section = crearSection ();
    let div = crearContenedorPueblos();
    $(section).append(div);
    $("main").append(section);
    cargarPueblos();
    $("main").append(crearHr());
}

/**
 * Función que se encarga de crear el footer de la página
 */
function crearFooter() {
    $("body").append(
        $("<footer>")
            .addClass("pie-pagina")
            .append(crearHr())
            .append(
                $("<div>").addClass("contenido-footer")
                    .append(
                        $("<div>").addClass("texto-footer")
                            .append(crearA("/privacy", "", "Privacidad"))
                            .append($("<p>").html("Todos los derechos reservados"))
                    )
                    .append($("<a>").attr("href", "/contacto").attr("id","Contacto").html("Contacto"))
            )
        );
    // @ts-ignore
    añadirEventListenerSPA($("#Contacto").get(0));
}

/**
 * función de la api de speech que lee el ``titulo`` y la ``descripción`` de una ubicación
 * @param {String} titulo nombre de la ubicación a leer
 * @param {String} descripcion descripción de la ubicación a leer
 */
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

/* --- --- */

/* --- Funciones específicas --- */

/**
 * función que devuelve un elemento div con las clases concretas para crear el contenedor de pueblos
 * @returns {JQuery<HTMLElement>} contenedor de pueblos
 */
function crearContenedorPueblos() {
    return $("<div>").attr("class", "contenedor-pueblos");
}

/**
 * Función que se encarga de crear un botón de un pueblo de la página principal ¿Dónde visitar?
 * @param {Object} pueblo Objeto con la información del pueblo
 * @returns {JQuery<HTMLElement>} Un elemento button con la información del pueblo
 */
function crearBotonPueblo (pueblo) {
    let nuevoBotonPueblo = $("<a>")
    .addClass("pueblo overlay")
    .attr("href", "/queVisitar?" + pueblo.name);
    $(nuevoBotonPueblo)
        .append(
            crearImg(pueblo.photo.contentUrl, pueblo.photo.description,"imagen-overlay")
            .attr({
                "property":"photo",
                "typeof":"ImageObject"
            })
        )
        .append(
            crearP({clases: "texto-overlay", texto: pueblo.name})
            .attr("property","name")
        );
    // @ts-ignore
    añadirEventListenerSPA(nuevoBotonPueblo.get(0));
    return nuevoBotonPueblo;
}

/**
 * Función que se encarga de añadir los pueblos restantes a la página principal ¿Dónde visitar?
 */
function añadirPueblosRestantes() {
    for(let i = 9; i < pueblosConUbicaciones.length; i++) {
        $("main .contenedor-pueblos").append(crearBotonPueblo(pueblosConUbicaciones[i]));
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
function crearBotonAtras(enlace, texto = "Atrás") {
    let boton = $("<button>")
            .html(texto)
            .addClass("boton-atras")
            .prepend(crearImg("img/svg/flecha-atras.svg","Botón de volver atrás", "back-arrow"))
            .attr("href", enlace);
    // @ts-ignore
    añadirEventListenerSPA(boton.get(0));
    return boton;
}

/**
 * función que devuelve un div para contener el selector de páginas
 * @returns {JQuery<HTMLElement>} contenedor con las clases especificas para contener la paginación
 */
function crearSelectorPagina() {
    return crearDiv("paginas","paginacion");
}



/**
 * función que guarda una ubicación como parada de ruta
 * @param {String} lugar nombre de la ubicación
 * @param {String} direccion dirección de la ubicación
 * @param {String} tipo tipo de ubicación
 */
function almacenarVisita(lugar, direccion, tipo) {
    const evento = { lugar, direccion, horaInicio: "09:00:00", horaFin: "10:00:00", tipo };
    actualizarVisitas(evento);
}

/**
 * función que reemplaza las comillas simples en un texto por \' para que el texto no contenga errores
 * @param {String} texto texto a cambair las comillas
 * @returns {String} texto con las comillas reemplazadas
 */
function escaparComillas(texto) {
    return texto.replace(/'/g, "\\'");
}

/* ----- */