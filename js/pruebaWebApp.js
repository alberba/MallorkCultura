const jsonUrlMuseos = "json/museosMallorkCultura.json";
const jsonUrlPueblos = "json/pueblos.json";
const jsonUrlComponentes = "json/componentes.json";
const centroMallorca = {lat: 39.61809784502291, lng: 2.9967532462301167};
const museosPorPagina = 9;
let museos;
let pueblos;
let componentes;
let speechSynthesisActivado = false;
let paginaActual;

// leer json de pueblos
fetch(jsonUrlPueblos)
    .then(response => response.json())
    .then(data => {
        pueblos = data.cities;
        // Se llama a la función desde aquí para no tener que esperar a que se cargue el JSON
        crearDondeVisitar();
    })
    .catch(error => console.error("Error al cargar los datos del JSON:", error));

// leer json de museos
fetch(jsonUrlMuseos)
    .then(response => response.json())
    .then(data => {
        museos = data.servicios;
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
$(() => {
    $("#logo").on("click", crearDondeVisitar);
    $("#queVisitar").on("click", crearPantallaUbicaciones);
    $("#tuRuta").on("click", crearTuRuta);
    $("#Contacto").on("click", crearContacto);
});

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
        .append(crearImg("img/main.webp","Fotografía de dos monumentos de Es Baluard","imagen-overlay")
            .attr("sizes", "100vw")
            .attr("srcset", "img/main.webp 2560w, img/main-2290.webp 2290w, img/main-1990.webp 1990w, img/main-1640.webp 1640w, img/main-1180.webp 1180w, img/main-300.webp 300w"))
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
 * Función que ordena los eventos en función de la hora de inicio
 */
function actualizarEventosMostrarRuta(index, horaInicio, horaFin){
    const visitas = recuperarVisitas();

    // Actualizar el evento correspondiente
    visitas[index].horaFin = visitas[index].horaFin.split('T')[0] + "T" + horaFin + ':00';
    if(horaInicio != null){
        visitas[index].horaInicio = visitas[index].horaInicio.split('T')[0] + "T" + horaInicio + ':00';
        //ordenar los eventos
        visitas.sort((a, b) => {
            const horaInicioA = new Date(a.horaInicio);
            const horaInicioB = new Date(b.horaInicio);
            return horaInicioA.getTime() - horaInicioB.getTime();
        });
    }
    localStorage.setItem('visitas', JSON.stringify(visitas));
    if(horaInicio != null) mostrarRuta();
    return visitas;
}

//función específica - ¿Dónde visitar? --> Pensar en sustituirla
function crearContenedorPueblos() {
    return $("<div>").attr("class", "contenedor-pueblos");
}

/**
 * Función que se encarga de crear un botón de un pueblo de la página principal ¿Dónde visitar?
 * @param {Object} pueblo Objeto con la información del pueblo
 * @returns {JQuery<HTMLElement>} Un elemento button con la información del pueblo
 */
function crearBotonPueblo (pueblo) {
    let nuevoBotonPueblo = $("<button>")
    .addClass("pueblo overlay")
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
                     .on("click", () => crearPantallaMuseo(museo.areaServed.name, funcionAnterior))
                 )        
             );
}

// función específica - Lista de ubicaciones
// esta habrá que cambiarla
function crearSelectorPagina() {
    return crearDiv("paginas","paginacion")
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



// Función para almacenar la visita con los detalles del museo
function almacenarVisita(lugar, direccion, tipo) {
    const evento = { lugar, direccion, horaInicio: "2024-06-01T09:00:00", horaFin: "2024-06-01T10:00:00", tipo };
    actualizarVisitas(evento);
}

// Función para escapar las comillas simples en un texto
function escaparComillas(texto) {
    return texto.replace(/'/g, "\\'");
}

function comprobarExposicionActual(expo) {
    const p = $("<p>").addClass("fecha-exp");
    
    if(expo.eventSchedule.startDate <= new Date().toISOString() && expo.eventSchedule.endDate >= new Date().toISOString()) {
        p.addClass("fecha-verde").text("Hasta el " + convertirFormatoFechaExposicion(expo.eventSchedule.endDate))
    } else {
        p.text(convertirFormatoFechaExposicion(expo.eventSchedule.startDate) + " - " + convertirFormatoFechaExposicion(expo.eventSchedule.endDate));
    }

    return p;
}

/* ----- */