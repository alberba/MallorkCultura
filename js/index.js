function cargarEsencial(){
    let body = document.body;

    let header = document.createElement('header');

    let nav = document.createElement('nav');
    nav.id = 'nav-header';
    nav.className = 'my-1';

    let div = document.createElement('div');

    let aLogo = document.createElement('a');
    aLogo.href = '/';
    aLogo.className = 'no-style-button logo';
    aLogo.id = 'logo';

    let imgLogo = document.createElement('img');
    imgLogo.src = 'img/svg/logo.svg';
    imgLogo.alt = 'Logo de MallorkCultura';
    imgLogo.className = 'logo-imagen';

    aLogo.appendChild(imgLogo);

    let button = document.createElement('button');
    button.className = 'menu_icon no-style-button';

    let imgMenu = document.createElement('img');
    imgMenu.src = 'img/svg/menu.svg';
    imgMenu.alt = 'Botón de menú';

    button.appendChild(imgMenu);

    let divLinks = document.createElement('div');
    divLinks.className = 'nav-links-header';

    let aVisitar = document.createElement('a');
    aVisitar.href = '/queVisitar';
    aVisitar.id = 'queVisitar';
    aVisitar.className = 'no-style-button';
    aVisitar.textContent = '¿Qué visitar?';

    let aRuta = document.createElement('a');
    aRuta.href = '/tuRuta';
    aRuta.id = 'tuRuta';
    aRuta.textContent = 'Tu ruta';

    divLinks.appendChild(aVisitar);
    divLinks.appendChild(aRuta);

    div.appendChild(aLogo);
    div.appendChild(button);
    div.appendChild(divLinks);

    nav.appendChild(div);

    header.appendChild(nav);

    let main = document.createElement('main');
    main.className = 'contenedor-principal index';

    body.appendChild(header);
    body.appendChild(main);
    cargarLCP();
}

function cargarLCP(){
    let url = window.location.pathname;
    switch(url) {
        case "/":
            crearLCPDondeVisitar();
            break;
    }
}

function crearLCPDondeVisitar() {
    // Elimina el contenido del header y añade el nuevo. Esto se hace para que, en caso de estar el mapa de otra página,
    // se elimine y no se quede en la página principal
    let header = document.querySelector('header');
    while (header && header.firstChild) {
        header.removeChild(header.firstChild);
    }

    let overlayDiv = document.createElement('div');
    overlayDiv.className = 'overlay header-image';

    let img = document.createElement('img');
    img.src = 'img/main.webp';
    img.alt = 'Fotografía de dos monumentos de Es Baluard';
    img.className = 'imagen-overlay';
    img.setAttribute('sizes', '100vw');
    img.setAttribute('fetchpriority', 'high');
    img.setAttribute('srcset', 'img/main.webp 2560w, img/main-2290.webp 2290w, img/main-1990.webp 1990w, img/main-1640.webp 1640w, img/main-1180.webp 1180w, img/main-300.webp 300w');
    overlayDiv.appendChild(img);

    let textoDiv = document.createElement('div');
    textoDiv.className = 'texto-main-page texto-overlay m-0';

    let h1 = document.createElement('h1');
    h1.className = 'mu-0 mb-4';
    h1.innerHTML = 'MallorkCultura';
    textoDiv.appendChild(h1);

    let p = document.createElement('p');
    p.className = 'subtitulo-main';
    p.textContent = 'Planifica tu ruta ya';
    textoDiv.appendChild(p);

    overlayDiv.appendChild(textoDiv);
    header?.appendChild(overlayDiv);
}