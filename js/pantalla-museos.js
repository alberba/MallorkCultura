/**
 * Función que se encarga de crear la pantalla de los museos de todos los pueblos.
 *  A esta se accede a partir del botón del header "¿Qué visitar?"
 */
function crearPantallaUbicaciones() {
    // Hacer que la página suba al principio
    window.scrollTo(0, 0);
    // Elimina el contenido del header y añade el nuevo. Esto se hace para que, en caso de estar la imagen 
    // de portada de la pantalla principal, se elimine
    $("header > div").remove();
    $("header").append(crearDiv("mapa-museo map-container")
        .append(crearDiv("ubi-header").attr("id","map"))
    );

    //Cuando Entramos en la pantalla de Museos ponemos que estamos en la primera pagina
    paginaActual = 0;

    // Inicializa el mapa con el centro de Mallorca y los marcadores de todos los museos
    initMap({
        position: centroMallorca, 
        zoom: 9,
        arrPositionMarkers: museos.map(museo => ({lat: parseFloat(museo.areaServed.geo.latitude), lng: parseFloat(museo.areaServed.geo.longitude)}))
    });

    $("main").empty()
    $("main").attr("class","contenedor-principal lista-museos")
        .append(crearBotonAtras(crearDondeVisitar, "Inicio"))
        .append(crearFiltros());

    let contenedorMuseo = crearDiv("contenedor-museos");
    // Añade las tarjetas de los museos de la primera pagina
    for(let i=0; i < museos.length && i < museosPorPagina; i++){
        contenedorMuseo.append(crearTarjetaUbicacion(museos[i], crearPantallaUbicaciones)
        )
    }

    $("main").append(crearSection().append(contenedorMuseo));
    $("main").append(crearSelectorPagina());
    modificarPaginacion();
}


/**
 * Función que se encarga de crear la pantalla de los museos de un pueblo en concreto
 * @param {String} pueblo Nombre del pueblo del que se quieren mostrar los museos
 */
function crearUbicacionesPueblo(pueblo) {
    // Hacer que la página suba al principio
    window.scrollTo(0, 0);
    // Elimina el contenido del header y añade el nuevo. Esto se hace para que, en caso de estar la imagen 
    // de portada de la pantalla principal, se elimine
    $("header > div").remove();
    $("header").append(crearDiv("mapa-museo map-container")
        .append(crearDiv("ubi-header").attr("id","map"))
    );

    // Inicializa el mapa con el centro del pueblo y los marcadores de los museos de ese pueblo
    let museosPueblo = museos.filter(museo => museo.areaServed.address.addressLocality === pueblo);
    iniciarMapaPueblo(pueblos.find(p => p.name === pueblo), museosPueblo);

    $("main").empty()
    $("main").attr("class","contenedor-principal lista-museos");
    $("main").append(crearBotonAtras(crearDondeVisitar, "Inicio"));
    $("main").append(crearH2(pueblo));
    $("main").append(crearHr());
    $("main").append(crearFiltros());

    let contenedorMuseos = crearDiv("contenedor-museos");
    museosPueblo.forEach(museo => {
        contenedorMuseos.append(crearTarjetaUbicacion(museo, () => crearUbicacionesPueblo(pueblo)));
    });
    $("main").append(crearSection().append(contenedorMuseos));

    $("main").append(crearSelectorPagina());
}

function modificarPaginacion() {
    // Obtener el elemento paginacion
    var paginacion = $(".paginacion");

    if(Math.ceil(museos.length/museosPorPagina) < 2){
        $("main").remove(".paginacion");
        return;
    }

    paginacion.empty();

    // Obtener los botones de página anterior y página siguiente
    var prevButton = crearImg("img/svg/prev-page-arr.svg", "Página anterior");
    var nextButton = crearImg("img/svg/next-page-arr.svg", "Página siguiente");

    paginacion.add(prevButton);
    if(Math.ceil(museos.length/museosPorPagina) <= 4){
        for(let i = 1; i == Math.ceil(museos.length/museosPorPagina); i++){
            var span = crearSpan("",i.toString()).click(function() {
                paginaActual = i;
            });
            paginacion.append(span);

        }
    }

    // Añadir evento onclick a los botones
    prevButton.click(function() {
    });

    nextButton.click(function() {
    });
}
