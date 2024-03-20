
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
        alert("hola");
        location.reload();
    } else if (chGratuito.checked) {
        alert("hola");
    }
}