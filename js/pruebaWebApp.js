// Rehacer la página principal
$("#logo").on("click",function() {
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
});

function crearSection () {
    return $("<section></section>");
}

function crearContenedorPueblos() {
    return $("<div>").attr("class", "contenedor-pueblos my-5");
}

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

function crearH2(titulo) {
    return $("<h2>").addClass("mt-5").html(titulo);
}

function crearHr() {
    return $("<hr>");
}

function añadirPueblosRestantes() {
    pueblos =           ["Palma","Manacor","Valldemossa","Sóller","Fornalux","Deià","Sant Joan","Banyalbufar","Maria de la Salut","Artà","Porreres","Santa Eugènia","Alcúdia","Inca","Sencelles","Sant Lorenç des Cardassar","Santa Margalida","Petra","Lloseta","Mancor de la Vall","Montuïri","Ses Salines","Santa Maria del Camí","Capdepera","Alaró","Ariany","Bunyola","Estellencs","Costitx","Santanyí","Llucmajor","Pollença","Puigpunyent","Campanet","Felanitx","Algaida","Llubí","Sineu","Búger","Calvià","Esporles","Binissalem","Escorca","Sa Pobla","Andratx","Son Servera","Campos","Marratxí","Consell","Lloret de Vistalegre","Vilafranca de Bonany"];
    pueblosSinTilde =   ["Palma","Manacor","Valldemossa","Soller","Fornalux","Deia","Sant Joan","Banyalbufar","Maria de la Salut","Arta","Porreres","Santa Eugenia","Alcudia","Inca","Sencelles","Sant Lorenç des Cardassar","Santa Margalida","Petra","Lloseta","Mancor de la Vall","Montuiri","Ses Salines","Santa Maria del Cami","Capdepera","Alaro","Ariany","Bunyola","Estellencs","Costitx","Santanyi","Llucmajor","Pollença","Puigpunyent","Campanet","Felanitx","Algaida","Llubi","Sineu","Buger","Calvia","Esporles","Binissalem","Escorca","Sa Pobla","Andratx","Son Servera","Campos","Marratxi","Consell","Lloret de Vistalegre","Vilafranca de Bonany"];
    
    // for(let i = 0; i < 9; i++) {
    //     $("main section .contenedor-pueblos").append(crearBotonPueblo(nombres[i],nombresSinTilde[i]));
    // } 
}

function crearBotonVerMas_Pueblos() {
    return $("<button>")
            .addClass("boton boton-vermas-index boton-verde")
            .text("Ver más")
            .attr("id","verMasPueblos")
            .on("click",function(){añadirPueblosRestantes()});

}