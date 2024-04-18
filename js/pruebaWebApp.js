/* --- Eventos de botones --- */
// Rehacer la página principal
$("#logo").on("click",function() {
    crearDondeVisitar();
});

/* --- --- */

/* --- Funciones "creadoras" --- */
//esta función se encarga de "Crear" el apartado de título "¿Dónde visitar?"
function crearDondeVisitar() {
    nombres =           ["Palma", "Manacor", "Sóller", "Valldemossa","Inca", "Calvià", "Alcúdia", "Santanyí", "Porreres"];
    nombresSinTilde =   ["Palma", "Manacor", "Soller", "Valldemossa","Inca", "Calvia", "Alcudia", "Santanyi", "Porreres"];
    $("main").empty();
    $("main").append(crearH2("¿Dónde visitar?"));
    $("main").append(crearHr());
    sec = crearSection ();
    div = crearContenedorPueblos();
    $(sec).append(div);
    for(let i = 0; i < 9; i++) {
        $(div).append(crearBotonPueblo(nombres[i],nombresSinTilde[i]));
    }
    $("main").append(sec);
    $("main").append(crearBotonVerMas_Pueblos());
    $("main").append(crearHr());
}

function crearUbicacionesPueblo() {
    $("main").empty();
    $("main").append(crearH2("¿Dónde visitar?"));
}
/* --- --- */

/* --- Funciones genéricas --- */
// función genérica
function crearSection () {
    return $("<section></section>");
}

// función genérica
function crearH2(titulo) {
    return $("<h2>").addClass("mt-5").html(titulo);
}

// función genérica ??
function crearHr() {
    return $("<hr>");
}

/* --- --- */

/* --- Funciones específicas --- */

//función específica - ¿Dónde visitar?
function crearContenedorPueblos() {
    return $("<div>").attr("class", "contenedor-pueblos my-5");
}

// función específica - ¿Dónde visitar?
function crearBotonPueblo (name, nameST) {
    let nuevoBotonPueblo = $("<a>")
    .attr({
        "href":"pantalla-museosCiudad.html",
        "class":"pueblo overlay col-lg-4"
    });
    let imagenPrueblo = $("<img>")
    .attr({
        "src" : "img/pueblos/"+nameST+".webp",
        "alt" : "Foto de " + name,
        "class": "imagen-overlay"
    });
    let nombrePueblo = $("<p>")
    .addClass("texto-overlay")
    .html(name);

    $(nuevoBotonPueblo).append(imagenPrueblo).append(nombrePueblo);
    return nuevoBotonPueblo;
}

// función específica - ¿Dónde visitar?
function añadirPueblosRestantes() {
    pueblos =           ["Fornalutx","Deià","Sant Joan","Banyalbufar","Maria de la Salut","Artà","Santa Eugènia","Sencelles","Sant Llorenç des Cardassar","Santa Margalida","Petra","Lloseta","Mancor de la Vall","Montuïri","Ses Salines","Santa Maria del Camí","Capdepera","Alaró","Ariany","Bunyola","Estellencs","Costitx","Llucmajor","Pollença","Puigpunyent","Campanet","Felanitx","Algaida","Llubí","Sineu","Búger","Esporles","Binissalem","Escorca","Sa Pobla","Andratx","Son Servera","Campos","Marratxí","Consell","Lloret de Vistalegre","Vilafranca de Bonany"];
    pueblosSinTilde =   ["Fornalutx","Deia","Sant Joan","Banyalbufar","Maria de la Salut","Arta","Santa Eugenia","Sencelles","Sant Llorenç des Cardassar","Santa Margalida","Petra","Lloseta","Mancor de la Vall","Montuiri","Ses Salines","Santa Maria del Cami","Capdepera","Alaro","Ariany","Bunyola","Estellencs","Costitx","Llucmajor","Pollença","Puigpunyent","Campanet","Felanitx","Algaida","Llubi","Sineu","Buger","Esporles","Binissalem","Escorca","Sa Pobla","Andratx","Son Servera","Campos","Marratxi","Consell","Lloret de Vistalegre","Vilafranca de Bonany"];
    for(let i = 0; i<pueblos.length; i++) {
        $("main section .contenedor-pueblos").append(crearBotonPueblo(pueblos[i],pueblosSinTilde[i]));
    } 
    $("#verMasPueblos").remove();
}

// función específica - ¿Dónde visitar?
function crearBotonVerMas_Pueblos() {
    return $("<button>")
            .addClass("boton boton-vermas-index boton-verde")
            .text("Ver más")
            .attr("id","verMasPueblos")
            .on("click",function(){añadirPueblosRestantes()});
}



/* --- --- */