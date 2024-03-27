// Contenedor que contiene los enlaces del header "¿Que visitar? | "Tu ruta"
const navLinksHeader = document.querySelector('.nav-links-header');
// Contenedor que contiene el botón del menú
const menu_button = document.querySelector('.menu_icon');
const nav = document.querySelector("#nav-header");

// Gestión de eventos para mostrar el menú en dispositivos móviles cuando el usuario presione el botón
menu_button.addEventListener('click', () => {
    navLinksHeader.classList.toggle('nav-links-header-mobile');
});

const max768px = () => {
    
    const div = nav.querySelector("div");
    if (window.innerWidth <= 768) {
        if (div.contains(navLinksHeader)) {
            // Elimina el contenedor del div y lo añade en el nav del header
            div.removeChild(navLinksHeader);
            nav.appendChild(navLinksHeader);
        }
    } else {
        if (!div.contains(navLinksHeader)) {
            // Eliminamos la clase para evitar errores
            navLinksHeader.classList.remove("nav-links-header-mobile");
            nav.removeChild(navLinksHeader);
            div.insertBefore(navLinksHeader, document.querySelector('#google-signin'));
        }
    }
}

window.addEventListener('resize', max768px);
window.addEventListener('load', max768px);