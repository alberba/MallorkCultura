const jsonUrlMuseos = "json/museosMallorkCultura.json";
const jsonUrlPueblos = "json/pueblos.json";
const centroMallorca = {lat: 39.61809784502291, lng: 2.9967532462301167};
let museos;
let pueblos;

// leer json de museos
fetch(jsonUrlMuseos)
    .then(response => response.json())
    .then(data => {
        museos = data.servicios;
    })
    .catch(error => console.error("Error al cargar los datos del JSON:", error));

// leer json de pueblos
fetch(jsonUrlPueblos)
    .then(response => response.json())
    .then(data => {
        pueblos = data.cities;
    })
    .catch(error => console.error("Error al cargar los datos del JSON:", error));

// Crear la página principal al cargar la página
$(function() {
    crearDondeVisitar();
});

/* --- Eventos de botones --- */
// Rehacer la página principal
$("#logo").on("click", crearDondeVisitar);

$("#queVisitar").on("click", crearPantallaUbicaciones);

/* --- --- */

/* --- Funciones "creadoras" --- */
//esta función se encarga de "Crear" el apartado de título "¿Dónde visitar?"
function crearDondeVisitar() {
    $("header > div").remove();
    $("header").append(crearDiv("overlay header-image")
        .append(crearImg("img/main.webp","Fotografía de dos monumentos de Es Baluard","imagen-overlay"))
        .append(crearDiv("texto-main-page texto-overlay m-0")
            .append($("<h1>").addClass("mu-0 mb-4").html("MallorkCultura"))
            .append(crearP({texto: "Planifica tu ruta ya"}))
        )

    );
    $("main").empty();
    $("main").attr("class","contenedor-principal index");
    $("main").append(crearH2("¿Dónde visitar?"));
    $("main").append(crearHr());
    let sec = crearSection ();
    let div = crearContenedorPueblos();
    $(sec).append(div);
    for(let i = 0; i < 9; i++) {
        $(div).append(crearBotonPueblo(pueblos[i]));
    }
    $("main").append(sec);
    $("main").append(crearBotonVerMas_Pueblos());
    $("main").append(crearHr());
}

// esta función se encarga de "Crear" el listado de museos de todos los pueblos
function crearPantallaUbicaciones() {
    $("header > div").remove();
    $("header").append(crearDiv("mapa-museo map-container")
        .append(crearDiv("ubi-header").attr("id","map"))
    );
    initMap({
        position: centroMallorca, 
        zoom: 9,
        arrPositionMarkers: museos.map(museo => ({lat: parseFloat(museo.areaServed.geo.latitude), lng: parseFloat(museo.areaServed.geo.longitude)}))
    });

    $("main").empty()
    $("main").attr("class","contenedor-principal lista-museos");
    $("main").append(crearBotonAtras());
    $("main").append(crearFiltros());
    let div = crearDiv("contenedor-museos");
    museos.forEach(museo => {
        div.append(
            crearArticle("museo")
                .append(crearImg(museo.areaServed.photo[0].contentUrl, museo.areaServed.photo[0].description))
                .append(crearHeader("titulo-museo-card").append(crearH4(museo.areaServed.name)))
                .append(crearP({
                    clases: "mb-4 descripcion-museo",
                    texto: museo.areaServed.description        
                }))
                .append(crearDiv("botones-museo")
                    .append(crearBoton("","boton boton-card-museo boton-verde","Añadir")
                        .on("click", () => almacenarVisita(escaparComillas(museo.areaServed.name), escaparComillas(museo.areaServed.address.streetAddress), museo.areaServed["@type"][1]))   // Aquí hay que añadir la función para añadir a la ruta
                    )
                    .append(crearBoton("Y","boton boton-card-museo boton-gris","Ver más")
                        .on("click", () => crearInfoUbi(museo.areaServed.name))
                    )
                
                )
        )
    });
    $("main").append(crearSection().append(div));
    $("main").append(crearSelectorPagina());    // esto va a requerir revisión
}

// esta función se encarga de "Crear" el listado de museos de un pueblo
function crearUbicacionesPueblo(pueblo) {
    $("header > div").remove();
    $("header").append(crearDiv("mapa-museo map-container")
        .append(crearDiv("ubi-header").attr("id","map"))
    );
    initMap({ 
        position: {lat: 39.570279022882914, lng: 2.6411309682497817} // TODO: Habrá que cambiarlo al centro de la ciudad
    });

    $("main").empty()
    $("main").attr("class","contenedor-principal lista-museos");
    $("main").append(crearBotonAtras());
    $("main").append(crearH2(pueblo));
    $("main").append(crearHr());
    $("main").append(crearFiltros());
    let div = crearDiv("contenedor-museos");
    museos.forEach(museo => { if (museo.areaServed.address.addressLocality == pueblo)
        div.append(crearTarjetaUbicacion(museo));
    });
    $("main").append(crearSection().append(div));
    $("main").append(crearSelectorPagina());    // esto va a requerir revisión
}

function crearInfoUbi(nombreLugar){
    window.scrollTo(0, 0);
    const lugar = museos.find(museo => museo.areaServed.name === nombreLugar);
    $("header > div").remove();
    $("header").append(crearDiv("mapa-museo map-container")
        .append(crearDiv("ubi-header").attr("id","map"))
        .append($("<h2>").addClass("m-0 titulo-museo").attr("id", "titulo-museo").html(lugar.areaServed.name))
    );

    let posicion = {lat: parseFloat(lugar.areaServed.geo.latitude), lng: parseFloat(lugar.areaServed.geo.longitude)};
    initMap({
        position: posicion, 
        arrPositionMarkers: [posicion]
    });
    $("main").empty();
    $("main").attr("class","contenedor-principal info-museo");
    $("main").append(crearBotonAtras());

    //Parte del slider habrá que arreglarla
    $("main").append(crearDiv("swiper mySwiper slider-imagen-museo")
        .append(generarCarrousselFotos(lugar.areaServed.photo))
        .append(crearDiv("swiper-button-next"))
        .append(crearDiv("swiper-button-prev"))
        .append(crearDiv("swiper-pagination"))
    )
    .append(crearDiv("section-museo")
        .append(generarArticuloLugarYDescripcion(lugar)
            .append(crearBoton("leer-mas-btn", "boton boton-verde", "Leer más")
                .on("click", leerMas)
            )
            .append((generarDivExposiciones(lugar.areaServed.event)))
            .append(crearDiv("contenedor-botones-museo")
                .append($("<a>")
                    .addClass("boton boton-verde")
                    //TODO: Cambiar esto
                    .html("Añadir a la ruta")
                )
                .append($("<a>")
                    .addClass("boton boton-gris boton-comp-entrada")
                    //TODO: Cambiar esto
                    .html("Comprar entrada")
                    .append(crearImg("img/svg/boton-añadir-carrito.svg","Icono de redireccion"))
                )
            )
        )
        .append(crearDiv("vl").attr("id","separador-vertical-museo"))
        .append(crearHr().attr("id","separador-horizontal-museo"))
        .append(generarAsideMuseo(lugar))
    )

    if (lugar.areaServed.event.length > 0) {
        activarSwipersMuseo();
    }
    
}
/* --- --- */

/* --- Funciones genéricas --- */
// función genérica
function crearSection () {
    return $("<section></section>");
}

// función genérica
function crearArticle(clases = "") {
    return $("<article>").addClass(clases);
}

function crearHeader(clases = "") {
    return $("<header>").addClass(clases);
}

// función genérica
function crearH2(titulo) {
    return $("<h2>").addClass("mt-5").html(titulo);
}

function crearH3(clases="",titulo) {
    return $("<h3>").addClass(clases).html(titulo);
}

function crearH4(titulo) {
    return $("<h4>").addClass("mb-2 mt-3").html(titulo);
}

// función genérica
function crearHr() {
    return $("<hr>");
}

// función genérica
function crearDiv(clases = "") {
    return $("<div>").addClass(clases);
}

//función genérica
function crearImg(direc, textAl = "", clases = "") {
    return $("<img>")
        .attr({
            "src":direc,
            "alt":textAl,
            "class": clases
        });
}

// función genérica
function crearP({clases = "", texto, id = ""}) {
    return $("<p>").
        attr({
            "id":id,
            "class":clases
        }).html(texto);
}

// función genérica
function crearBoton(id = "", clases = "", texto) {
    return $("<button>").
        attr({
            "id":id,
            "class":clases
        })
        .html(texto);
}

// función genérica
function crearForm(id,clases = "") {
    return $("<form>")
        .attr({
            "id":id,
            "class":clases
        });
}

// función genérica --> le pasas el input al que debe aderirse
function crearLabel(inputName, text){
    return $("<label>")
        .attr("for",inputName)
        .html(text);
}

// función genérica
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

// función genérica
function crearSelect(nombre, id, clases){
    return $("<select>")
        .attr({
            "name": nombre,
            "id" : id,
            "class": clases
        });
}

// función genérica
function crearOption(valor, seleccionado = false, texto) {
    let opt = $("<option>")
        .attr("value", valor)
        .html(texto);
    if(seleccionado) {  // Hago esto para ahorrar un atributo en los que no están preseleccionados
        opt.prop("selected", true);
    }
    return opt;
}

// función genérica
function crearSpan(clases, texto) {
    return $("<span>").addClass(clases).html(texto);
}
/* --- --- */

/* --- Funciones específicas --- */

// Función para generar el carroussel de fotos a partir del JSON
function generarCarrousselFotos(fotos) {
    let carrousselFotos = crearDiv("swiper-wrapper");
    fotos.forEach(foto => {
        carrousselFotos.append(crearDiv("swiper-slide")
            .append(crearImg(foto.contentUrl, foto.description, "imagen-museo"))
        );
    });
    return carrousselFotos;
}

function generarArticuloLugarYDescripcion(lugar) {
    let articulo = crearArticle("main-museo");
    lugar.areaServed.description.split("\n").forEach((parrafo, index) => {
        if(index === 0) {
            articulo.append(crearP({
                clases: "desc-museum first-desc-museum-mobile",
                id: "first-desc-museum",
                texto: parrafo
            }));
        } else {
            articulo.append(crearP({
                clases: "desc-museum leer-mas",
                texto: parrafo
            }));
        }
    });
    return articulo;
}

function generarDivExposiciones(exposiciones) {
    
    if (exposiciones !== "") {
        
        let expos = crearDiv("swiper-wrapper");
        exposiciones.forEach(expo => {
            expos.append($("<li>")
                .addClass("exposicion swiper-slide")
                .append(crearImg(expo.image.contentUrl, expo.image.description))
                .append(crearP({
                    clases: "nombre",
                    texto: expo.name
                }))
                .append(crearP({
                    clases: "fecha-exp",
                    texto: expo.eventSchedule.startDate + " - " + expo.eventSchedule.endDate
                }))
            );
        });
        let exposDiv = crearSection()
        .append(crearH3("mb-4", "EXPOSICIONES"))
        .append($("<ol>")
            .addClass("exposiciones swiper")
            .append(expos));
        return exposDiv;
    } else {
        return "";
    
    }

}

function generarAsideMuseo(lugar) {
    let aside = $("<aside>");
    aside.append(crearDiv()
        .append($("<h5>").html("Horario"))
        .append(crearP({
            clases: "",
            texto: crearFechasHorarioLugar(lugar.areaServed.openingHours)
        }))
    )
    .append(crearDiv()
        .append($("<h5>").html("Dirección"))
        .append(crearP({
            clases: "",
            texto: crearTextoDirecciónLugar(lugar)
        }))
    )
    .append(crearDiv()
        .append($("<h5>").html("Precios"))
        .append(crearP({
            clases: "",
            texto: crearTextoPreciosLugar(lugar.hasOfferCatalog)
        }))
    );

    return aside;
}

function crearFechasHorarioLugar(horario) {
    let dias = {
        "Mo": "Lunes",
        "Tu": "Martes",
        "We": "Miércoles",
        "Th": "Jueves",
        "Fr": "Viernes",
        "Sa": "Sábado",
        "Su": "Domingo"
    };
    if (!Array.isArray(horario)) {
        let [diasIngles, horas] = horario.split(" ");
        let [diaInicio, diaFin] = diasIngles.split("-");
        return diaFin ? `${dias[diaInicio]} a ${dias[diaFin]}: ${horas}` : `${dias[diaInicio]}: ${horas}`;
    } else {
        let horarioEspañol =  horario.map(horario => {
            let [diasIngles, horas] = horario.split(" ");
            let [diaInicio, diaFin] = diasIngles.split("-");
            return diaFin ? `${dias[diaInicio]} a ${dias[diaFin]}: ${horas}` : `${dias[diaInicio]}: ${horas}`;
        });
    
        return horarioEspañol.join("<br>");
    }
}

function crearTextoDirecciónLugar(lugar) {
    let direccion = lugar.areaServed.address;
    return `${direccion.streetAddress} <br>
            ${direccion.postalCode} ${direccion.addressLocality} <br>
            ${lugar.areaServed.telephone.replace("+34", "").replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4")} <br>
            ${direccion.email}`;
}

function crearTextoPreciosLugar(catalogoOfertas) {
    if (!catalogoOfertas) {
        return "Entrada general: Gratuito"
    }
    let ofertas = catalogoOfertas.itemListElement.map(offer => {
        let precio = parseFloat(offer.price);
        if (precio === 0) {
            return `${offer.itemOffered.name}: Gratuito`;
        } else if (Number.isInteger(precio)) {
            return `${offer.itemOffered.name}: ${precio}€`;
        } else {
            return `${offer.itemOffered.name}: ${precio.toFixed(2)}€`;
        }
        
    });
    return ofertas.join("<br>");
}

//función específica - ¿Dónde visitar? --> Pensar en sustituirla
function crearContenedorPueblos() {
    return $("<div>").attr("class", "contenedor-pueblos my-5");
}

// función específica - ¿Dónde visitar?
function crearBotonPueblo (pueblo) {
    let nuevoBotonPueblo = $("<button>")
    .addClass("pueblo overlay col-lg-4")
    .on("click",function(){crearUbicacionesPueblo(pueblo.name)});
    $(nuevoBotonPueblo)
        .append(
            crearImg(pueblo.photo.contentUrl, pueblo.photo.description,"imagen-overlay")
        )
        .append(
            crearP({clases: "texto-overlay", texto: pueblo.name})
        );
    return nuevoBotonPueblo;
}

// función específica - ¿Dónde visitar?
function añadirPueblosRestantes() {
    for(let i = 9; i < pueblos.length; i++) {
        $("main .contenedor-pueblos").append(crearBotonPueblo(pueblos[i]));
    } 
    $("#verMasPueblos").remove();
}

// función específica - ¿Dónde visitar?
function crearBotonVerMas_Pueblos() {
    return $("<button>")
            .addClass("boton boton-vermas-index boton-verde")
            .text("Ver más")
            .attr("id","verMasPueblos")
            .on("click",function(){añadirPueblosRestantes()});
}

// función específica - Por todo
// ACABAR
function crearBotonAtras() {
    return $("<button>")
            .html("Atrás")
            .addClass("boton-atras")
            .prepend(crearImg("img/svg/flecha-atras.svg","Botón de volver atrás","back-arrow"))
            .on("click", function(){});
}

// función específica - Lista de ubicaciones
function crearTarjetaUbicacion(museo) {
    return crearArticle("museo")
             .append(crearImg(museo.areaServed.photo[0].contentUrl, museo.areaServed.photo[0].description))
             .append(crearHeader("titulo-museo-card").append(crearH4(museo.areaServed.name)))
             .append(crearP({
                 clases: "mb-4 descripcion-museo",
                 texto: museo.areaServed.description        
             }))
             .append(crearDiv("botones-museo")
                 .append(crearBoton("","boton boton-card-museo boton-verde","Añadir")
                     .on("click", () => almacenarVisita(escaparComillas(museo.areaServed.name), escaparComillas(museo.areaServed.address.streetAddress), museo.areaServed["@type"][1]))   // Aquí hay que añadir la función para añadir a la ruta
                 )
                 .append(crearBoton("Y","boton boton-card-museo boton-gris","Ver más")
                     .on("click", () => crearInfoUbi(museo.areaServed.name))
                 )        
             );
}

// función específica - Lista de ubicaciones
// hacer que funcionen
function crearFiltros() {
    let filtros = crearDiv("contenedor-filtros")
        .append(crearBoton("boton-filtros","boton-filtros","Filtros")
            .append(crearImg("img/svg/flecha-menu-down.svg"))
            .attr({
                "data-bs-toggle":"collapse",
                "data-bs-target":"#form-filtro"
            })
        );
    let form = crearForm("form-filtro","form-filtro-museos mt-3 collapse show")
        .append(crearDiv("elemento-filtro-museo")   // Input texto nombre
            .append(crearLabel("busqueda-nombre","Búsqueda por nombre"))
            .append(crearInput("search","nombre","busqueda-nombre","","Buscar museo"))
        )
        .append(crearDiv("elemento-filtro-museo")   // Input texto dirección
            .append(crearLabel("","Ordenar por cercanía"))
            .append(crearInput("search","","busqueda-cercanía","","Dirección"))
        )
        .append(crearDiv("elemento-filtro-museo")
            .append(crearLabel("","Radio de búsqueda"))
            .append(crearDiv("contenedor-range")
                .append(crearInput("range","","busqueda-radio"))
                .append(crearP({
                    clases: "",
                    texto: "10Km"
                })) // Esto me imagino que tendrá que cambiar a medida que se mueve el range
            )
        )
        .append(crearDiv("elemento-filtro-museo")
            .append(crearLabel("","Tipo de exposición"))
            .append(crearSelect("","seleccion-exposicion","select")
                .append(crearOption(1, true, "Todos"))
                .append(crearOption(2, false, "Todos"))
                .append(crearOption(3, false, "Todos"))
            )
        )
        .append(crearDiv("elemento-filtro-museo")   // Input texto nombre
                .append(crearLabel("dia-visita","Día de visita"))
                .append(crearInput("date","","dia-visita"))
        )
        .append(crearDiv("elemento-filtro-museo")
            .attr("id","tipo-entrada") // Pocos divs necesitan un id, no veo necesidad de tener que incluir el id en la función para crear div's
            .append(crearP({
                clases:"",
                texto:"Tipo de entrada"
            }))
            .append(crearDiv("opciones-check")
                .append(crearLabel("gratuito","Gratuito")
                    .prepend(crearInput("checkbox","tipo_entrada[]","gratuito"))
                )
                .append(crearLabel("entrada","Entrada")
                    .prepend(crearInput("checkbox","tipo_entrada[]","entrada"))
                )
            )
        );
    filtros.append(form);
    
    return filtros;
}

// función específica - Lista de ubicaciones
// esta habrá que cambiarla
function crearSelectorPagina() {
    return crearDiv("paginas")
        .append(crearImg("img/svg/prev-page-arr.svg","Página anterior"))
        .append(crearP({
                clases:"",
                texto:".."
            })
            .prepend(crearSpan("pagina-actual","1"))
            .append(crearSpan("","2"))
        )
        .append(crearImg("img/svg/next-page-arr.svg","Página siguiente"));
}

/* --- --- */