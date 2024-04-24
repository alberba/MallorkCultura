const jsonUrl = "json/museosMallorkCultura.json";
const centroMallorca = {lat: 39.61809784502291, lng: 2.9967532462301167};
let museos;

fetch(jsonUrl)
    .then(response => response.json())
    .then(data => {
        museos = data.servicios;
    })
    .catch(error => console.error("Error al cargar los datos del JSON:", error));

// Crear la página principal al cargar la página
$(function() {
    crearDondeVisitar();
});

/* --- Eventos de botones --- */
// Rehacer la página principal
$("#logo").on("click",function() {
    crearDondeVisitar();
});

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
    let nombres =           ["Palma", "Manacor", "Sóller", "Valldemossa","Inca", "Calvià", "Alcúdia", "Santanyí", "Porreres"];
    let nombresArchivo =    ["palma", "manacor", "soller", "valldemossa","inca", "calvia", "alcudia", "santanyi", "porreres"];
    $("main").empty();
    $("main").attr("class","contenedor-principal index");
    $("main").append(crearH2("¿Dónde visitar?"));
    $("main").append(crearHr());
    let sec = crearSection ();
    let div = crearContenedorPueblos();
    $(sec).append(div);
    for(let i = 0; i < 9; i++) {
        $(div).append(crearBotonPueblo(nombres[i],nombresArchivo[i]));
    }
    $("main").append(sec);
    $("main").append(crearBotonVerMas_Pueblos());
    $("main").append(crearHr());
}

// esta función se encarga de "Crear" el listado de museos de un pueblo --> seguramente haya que cambiar algo 
// falta que se haga lo del mapa
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
    for (let i=0; i<9; i++) {
        div.append(crearTarjetaUbicacion());
    }
    $("main").append(crearSection().append(div));
    $("main").append(crearSelectorPagina());    // esto va a requerir revisión
}

function crearInfoUbi(nombreLugar){
    window.scrollTo(0, 0);
    const lugar = museos.find(museo => museo.areaServed.nombre === nombreLugar);
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
            .append(crearSection()
                .append(crearH3("mb-4", "EXPOSICIONES"))
                .append($("<ol>")
                    .addClass("exposiciones swiper")
                    .append(generarDivExposiciones(lugar.areaServed.event))
                )
            )
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
    let expos = crearDiv("swiper-wrapper");
    if(exposiciones !== "") {
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
        return expos;
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
    let horarioEspañol =  horario.map(horario => {
        let [diasIngles, horas] = horario.split(" ");
        let [diaInicio, diaFin] = diasIngles.split("-");
        return diaFin ? `${dias[diaInicio]} a ${dias[diaFin]}: ${horas}` : `${dias[diaInicio]}: ${horas}`;
    });

    return horarioEspañol.join("<br>");
}

function crearTextoDirecciónLugar(lugar) {
    let direccion = lugar.areaServed.address;
    return `${direccion.streetAddress} <br>
            ${direccion.postalCode} ${direccion.addressLocality} <br>
            ${lugar.areaServed.telephone.replace("+34", "").replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4")} <br>
            ${direccion.email}`;
}

function crearTextoPreciosLugar(catalogoOfertas) {
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
function crearBotonPueblo (name, nameST) {
    let nuevoBotonPueblo = $("<button>")
    .addClass("pueblo overlay col-lg-4")
    .on("click",function(){crearUbicacionesPueblo(name)});
    let imagenPrueblo = $("<img>")
    .attr({
        "src" : "img/pueblos/"+nameST+".webp",
        "alt" : "Foto de " + name,
        "class": "imagen-overlay"
    });
    let nombrePueblo = $("<p>")
    .addClass("texto-overlay")
    .html(name);

    $(nuevoBotonPueblo).append(imagenPrueblo).append(nombrePueblo);
    return nuevoBotonPueblo;
}

// función específica - ¿Dónde visitar?
// habría que mejorar esta basura
function añadirPueblosRestantes() {
    const pueblos =           ["Fornalutx","Deià","Sant Joan","Banyalbufar","Maria de la Salut","Artà","Santa Eugènia","Sencelles","Sant Llorenç des Cardassar","Santa Margalida","Petra","Lloseta","Mancor de la Vall","Montuïri","Ses Salines","Santa Maria del Camí","Capdepera","Alaró","Ariany","Bunyola","Estellencs","Costitx","Llucmajor","Pollença","Puigpunyent","Campanet","Felanitx","Algaida","Llubí","Sineu","Búger","Esporles","Binissalem","Escorca","Sa Pobla","Andratx","Son Servera","Campos","Marratxí","Consell","Lloret de Vistalegre","Vilafranca de Bonany"];
    const pueblosSinTilde =   ["fornalutx","deia","santJoan","banyalbufar","mariaDeLaSalut","arta","santaEugenia","sencelles","santLlorençDesCardassar","santaMargalida","petra","lloseta","mancorDeLaVall","montuiri","sesSalines","santaMariaDelCami","capdepera","alaro","ariany","bunyola","estellencs","costitx","llucmajor","pollença","puigpunyent","campanet","felanitx","algaida","llubi","sineu","buger","esporles","binissalem","escorca","saPobla","andratx","sonServera","campos","marratxi","consell","lloretDeVistalegre","vilafrancaDeBonany"];
    for(let i = 0; i<pueblos.length; i++) {
        $("main section .contenedor-pueblos").append(crearBotonPueblo(pueblos[i],pueblosSinTilde[i]));
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
// habrá que añadir los JSON a esto
function crearTarjetaUbicacion() {
    return crearArticle("museo")
        .append(crearImg("img/museo1-small.webp","Museo 1"))
        .append(crearHeader("titulo-museo-card").append(crearH4("Museo 1")))
        .append(
            crearP({
                clases: "mb-4",
                texto: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sit amet enim id sapien fermentum aliquet et ut nibh. Sed."
            })
        )
        .append(crearDiv("botones-museo")
            .append(crearBoton("X","boton boton-card-museo boton-verde","Añadir")
                .on("click",function(){})   // Aquí hay que añadir la función para añadir a la ruta
            )
            .append(crearBoton("Y","boton boton-card-museo boton-gris","Ver más")
                .on("click",function(){crearInfoUbi()})
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