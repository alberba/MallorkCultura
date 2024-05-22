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
    if(clases === "") {
        return $("<header>");
    } else {
        return $("<header>").addClass(clases);
    }
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
    if(id === "") {
        return $("<div>").addClass(clases);
    } else {
        return $("<div>").addClass(clases).attr("id",id);
    }
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
 * @param {number|string} valor El valor del option
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

/**
 * Función encargada de cambiar el evento de los botones necesarios para un SPA
 * @param {HTMLElement} anchor Anchor al que se le quiere añadir el evento
 */
function añadirEventListenerSPA(anchor) {
    anchor.addEventListener('click', function(event) {
        event.preventDefault(); // Evitar que el enlace funcione normalmente
        let url = this.getAttribute('href'); // Obtener la URL del enlace // Cargar el contenido de la subpágina
        history.pushState(null, document.title, url); // Cambiar la URL en la barra de direcciones del navegador
        cargarContenido();
    });
}

// Manejar los enlaces haciendo que carguen el contenido dinámicamente
document.addEventListener('DOMContentLoaded', function() {
    let enlaces = document.querySelectorAll('a');
    enlaces.forEach(function(enlace) {
        añadirEventListenerSPA(enlace);
    });
});
/* --- --- */