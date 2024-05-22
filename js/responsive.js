// Contenedor que contiene los enlaces del header "¿Que visitar? | "Tu ruta"
const navLinksHeader = $('.nav-links-header');
// Contenedor que contiene el botón del menú
const menu_button = $('.menu_icon');
const nav = $("#nav-header");

/**
 * Función que realiza la gestión de eventos para mostrar el menú en dispositivos móviles cuando el usuario presione el botón
 */
menu_button.on('click', (event) => {
    event.stopPropagation();
    navLinksHeader.toggleClass('nav-links-header-mobile');

    // Si el menú está desplegado, añade el controlador de eventos al documento
    if (navLinksHeader.hasClass('nav-links-header-mobile')) {
        $('click', hideMenu);
    } else {
        // Si el menú no está desplegado, elimina el controlador de eventos del documento
        // @ts-ignore
        $(document).off('click', hideMenu);
    }
});

/**
 * Función que esconde el menú 
 */
const hideMenu = function(event) {
    // Comprueba si se ha hecho clic fuera del menú
    if (!$(event.target).closest('.nav-links-header-mobile').length) {
        // Oculta el menú
        navLinksHeader.removeClass('nav-links-header-mobile');
        // Elimina el controlador de eventos
        $(document).off('click', hideMenu);
    }
};

/**
 * Función que genera el menú desplegable si la pantalla mide 768px o menos, y genera el menú original si la pantalla mide más de 768px 
 */
const max768px = () => {
    
    const div = nav.find("div").first();
    if (window.innerWidth <= 768) {
        if ($.contains(div[0], navLinksHeader[0])) {
            // Elimina el contenedor del div y lo añade en el nav del header
            $(navLinksHeader).detach().appendTo(nav);
        }
    } else {
        if (!$.contains(div[0], navLinksHeader[0])) {
            // Eliminamos la clase para evitar errores
            navLinksHeader.removeClass("nav-links-header-mobile");
            $(navLinksHeader).detach().insertAfter('#logo');
        }
    }
}

// Añadir eventos de carga de página y modificación de tamaño
window.addEventListener('resize', max768px);
window.addEventListener('load', max768px);