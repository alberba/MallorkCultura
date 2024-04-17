$("#logo").on("click",function() {
    nombres = ["Palma", "Manacor", "Soller"];
    $("main").empty();
    sec = crearSection ();
    div = crearContenedorPueblos();
    $(sec).append(div);
    for(let i = 0; i < 3; i++) {
        $(div).append(crearBotonPueblo(nombres[i]));
    }
    $("main").append(sec);
});

function crearSection () {
    return $("<section></section>");
}

function crearContenedorPueblos() {
    return $("<div>").attr("class", "contenedor-pueblos my-5");
}

function crearBotonPueblo (name) {
    let nuevoBotonPueblo = $("<a>")
    .attr({
        "href":"pantalla-museosCiudad.html",
        "class":"pueblo overlay col-lg-4"
    });
    let imagenPrueblo = $("<img>")
    .attr({
        "src" : "img/pueblos/"+name+".webp",
        "alt" : "Foto de " + name
    });
    let nombrePueblo = $("<p>")
    .addClass("texto-overlay")
    .html(name);

    $(nuevoBotonPueblo).append(imagenPrueblo).append(nombrePueblo);
    return nuevoBotonPueblo;
}