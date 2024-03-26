function mostrarMenuMovilHeader(){
	let menu = document.querySelector('.menu_icon');
    menu.addEventListener('click', function(){
        const nav = document.querySelector("nav");
        const menu = document.querySelector(".menu");
        if (nav.querySelector("div").contains(menu)) {
            nav.querySelector("div").removeChild(menu)
            nav.appendChild(menu);
            menu.classList.add('menu-mobile');
        } else {
            nav.removeChild(menu);
            nav.querySelector("div").insertBefore(menu, document.querySelector('#google-signin'));
            menu.classList.remove('menu-mobile');
        }
       
    });
};

mostrarMenuMovilHeader();