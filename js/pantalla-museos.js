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
    // Añade las tarjetas de los museos
    museos.forEach(museo => {
        contenedorMuseo.append(crearTarjetaUbicacion(museo, crearPantallaUbicaciones)
        )
    });

    $("main").append(crearSection().append(contenedorMuseo));
    $("main").append(crearSelectorPagina());
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