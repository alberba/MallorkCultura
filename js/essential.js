// Contenedor que contiene los enlaces del header "¿Que visitar? | "Tu ruta"
const navLinksHeader = $('.nav-links-header');
// Contenedor que contiene el botón del menú
const menu_button = $('.menu_icon');
const nav = $("#nav-header");

// Gestión de eventos para mostrar el menú en dispositivos móviles cuando el usuario presione el botón
menu_button.on('click', () => {
    navLinksHeader.toggleClass('nav-links-header-mobile');
});

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
            $(navLinksHeader).detach().insertBefore('#google-signin');
        }
    }
}

window.addEventListener('resize', max768px);
window.addEventListener('load', max768px);