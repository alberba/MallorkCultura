const jsonUrlMallorcaRoute = "https://mallorcaroute.com/edificios.json";
let edificios;

function leerJSONMallorcaRoute(){
    fetch(jsonUrlMallorcaRoute, { mode: 'no-cors'})
        .then(response => response.json())
        .then(data => {
            edificios = data.edificios;
        })
        .catch(error => console.error("Error al cargar los datos del JSON:", error));
}

function crearTarjetaUbicacionMR(edificio, funcionAnterior) {
    return crearArticle("museo")
                .append(crearImg(edificio.image, "Foto de " + edificio.name))
                .append(crearHeader("titulo-museo-card").append(crearH4(edificio.name)))
                .append(crearP({
                    clases: "mb-4 descripcion-museo",
                    texto: edificio.description        
                }))
                .append(crearDiv("botones-museo")
                    .append(crearBoton("Añadir", "", "boton boton-card-museo boton-verde")
                        .on("click", () => almacenarVisita(escaparComillas(edificio.name), escaparComillas(edificio.address.streetAddress), edificio["@type"][1]))
                    )
                    .append(crearBoton("Ver más", "Y", "boton boton-card-museo boton-gris")
                        .on("click", () => crearPantallaMuseoMR(edificio.name, funcionAnterior))
                    )        
                );
}

function crearPantallaMuseoMR(nombreLugar, funcionAnterior){
    const lugar = edificios.find(edificio => edificio.name === nombreLugar);
    // Hacer que la página suba al principio
    window.scrollTo(0, 0);
    // Elimina el contenido del header y añade el nuevo. Esto se hace para que, en caso de estar la imagen 
    // de portada de la pantalla principal, se elimine
    $("header > div").remove();
    $("header").append(crearDiv("mapa-museo map-container")
        .append(crearDiv("ubi-header").attr("id","map"))
        .append(crearDiv("contenedor-titulo-museo")
            .append($("<h2>").addClass("m-0 titulo-museo").attr("id", "titulo-museo").html(lugar.name))
        )
    );

    // Inicializa el mapa con la posición del lugar
    let posicion = {lat: parseFloat(lugar.geo.latitude), lng: parseFloat(lugar.geo.longitude)};
    initMap({
        position: posicion, 
        zoom: 14,
        arrPositionMarkers: [posicion]
    });

    $("main").empty()
        .attr("class","contenedor-principal info-museo")
        .append(crearBotonAtras(funcionAnterior));

    // Creación del slider de imágenes
    $("main").append(crearDiv("swiper mySwiper slider-imagen-museo")
        .append(generarCarrousselFotos(lugar.image))
        .append(crearDiv("swiper-button-next"))
        .append(crearDiv("swiper-button-prev"))
        .append(crearDiv("swiper-pagination"))
    );

    // Creación de la información del museo
    $("main").append(crearDiv("section-museo")
        .append(crearArticuloMuseo(lugar)
            .append(crearDiv("botones-descripcion")
                .append(crearBoton("Leer más", "leer-mas-btn", "boton boton-verde")
                    .on("click", leerMas)
                )
                .append(crearBoton("", "escuchar-btn", "boton-verde btn-volume")
                    .on("click", () => speechDescription(lugar.name, lugar.description))
                    .append(crearImg("img/svg/volume.svg","Icono de volumen para escuchar el titulo y la descripcion","volume-icon")))
            )
            .append((generarDivExposiciones(lugar.event))) // Si no hay eventos, se muestra vacío
            .append(crearDiv("contenedor-botones-museo")
                .append($("<a>")
                    .addClass("boton boton-verde")
                    .html("Añadir a la ruta")
                    .on("click", () => almacenarVisita(lugar.name, lugar.address.streetAddress, lugar["@type"][1]))
                )
                .append($("<a>")
                    .addClass("boton boton-gris boton-comp-entrada")
                    .attr({
                        "href":lugar.tourBookingPage ?? lugar.url,    // Si tiene web de entradas, redirige allí, sinó, redirige a la web inicial
                        "target":"_blank"
                    })
                    .html("Comprar entrada")
                    .append(crearImg("img/svg/boton-añadir-carrito.svg","Icono de redireccion"))
                )
            )
        )
        .append(crearDiv("vl").attr("id","separador-vertical-museo"))
        .append(crearHr().attr("id","separador-horizontal-museo"))
        .append(generarAsideMuseo(lugar))
    );
    activarSwipersImagenes();

    // Activar el swiper de exposiciones si hay exposiciones
    if (lugar.event.length > 0) {
        activarExposicionSwiper();
    }
    
}