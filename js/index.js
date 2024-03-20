
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