
function eliminarMuseoRuta(boton){
    // Encuentra el elemento li que contiene el botón
    var elementoLI = boton.closest('.parada-ruta');
    // Encuentra el siguiente div
    var siguienteDiv = elementoLI.nextElementSibling;

    // Elimina el elemento li y el siguiente div
    elementoLI.remove();
    if (siguienteDiv) {
        siguienteDiv.remove();
    }
}

function eliminarMuseoFiltro(){
    // Encuentra el elemento li que contiene el botón
    var chGratuito = document.getElementById("gratuito");
    // Encuentra el siguiente div
    var chEntrada = document.getElementById("entrada");

    if(chGratuito.checked && chEntrada.checked || !chGratuito.checked && chEntrada.checked) {
        location.reload();
    } else if (chGratuito.checked) {
        divMuseos = document.getElementsByClassName("contenedor-museos");
        museos = divMuseos[0].querySelectorAll(".museo");
        for (var i = 0; i < 4; i++) {
            museos[i].remove();
        }

    }
}

// Método para el funcionamiento del botón de leer más en pantalla-museo
function leerMas(boton) {
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
    return primerParrafo.offset().top >= $(window).scrollTop();
}