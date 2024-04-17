$("#logo").on("click",function() {
    nombres = ["Palma", "Manacor", "Sóller", "Valldemossa","Inca", "Calvià", "Alcúdia", "Santanyí", "Porreres"];
    nombresSinTilde = ["Palma", "Manacor", "Soller", "Valldemossa","Inca", "Calvia", "Alcudia", "Santanyi", "Porreres"];
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
        "alt" : "Foto de " + name
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