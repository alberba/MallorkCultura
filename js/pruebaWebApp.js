/* --- Eventos de botones --- */
// Rehacer la página principal
$("#logo").on("click",function() {
    crearDondeVisitar();
});

/* --- --- */

/* --- Funciones "creadoras" --- */
//esta función se encarga de "Crear" el apartado de título "¿Dónde visitar?"
function crearDondeVisitar() {
    nombres =           ["Palma", "Manacor", "Sóller", "Valldemossa","Inca", "Calvià", "Alcúdia", "Santanyí", "Porreres"];
    nombresSinTilde =   ["Palma", "Manacor", "Soller", "Valldemossa","Inca", "Calvia", "Alcudia", "Santanyi", "Porreres"];
    $("main").empty();
    $("main").attr("class","contenedor-principal index");
    $("main").append(crearH2("¿Dónde visitar?"));
    $("main").append(crearHr());
    sec = crearSection ();
    div = crearContenedorPueblos();
    $(sec).append(div);
    for(let i = 0; i < 9; i++) {
        $(div).append(crearBotonPueblo(nombres[i],nombresSinTilde[i]));
    }
    $("main").append(sec);
    $("main").append(crearBotonVerMas_Pueblos());
    $("main").append(crearHr());
}

// esta función se encarga de "Crear" el listado de museos de un pueblo --> seguramente haya que cambiar algo 
// falta que se haga lo del mapa
function crearUbicacionesPueblo(pueblo) {
    $("main").empty()
    $("main").attr("class","contenedor-principal lista-museos");
    $("main").append(crearH2(pueblo));
    $("main").append(crearHr());
    $("main").append(crearFiltros());
    div = crearDiv("contenedor-museos");
    for (let i=0; i<9; i++) {
        div.append(crearTarjetaUbicacion());
    }
    $("main").append(crearSection().append(div));
    $("main").append();
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
function crearImg(direc, textAl = "") {
    return $("<img>")
        .attr({
            "src":direc,
            "alt":textAl
        });
}

// función genérica
function crearP(clases = "", texto) {
    return $("<p>").addClass(clases).html(texto);
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
    opt = $("<option>")
        .attr("value", valor)
        .html(texto);
    if(seleccionado) {  // Hago esto para ahorrar un atributo en los que no están preseleccionados
        $("<option>")
        .attr("selected", seleccionado);
    }
    return opt;
}

/* --- --- */

/* --- Funciones específicas --- */

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
function añadirPueblosRestantes() {
    pueblos =           ["Fornalutx","Deià","Sant Joan","Banyalbufar","Maria de la Salut","Artà","Santa Eugènia","Sencelles","Sant Llorenç des Cardassar","Santa Margalida","Petra","Lloseta","Mancor de la Vall","Montuïri","Ses Salines","Santa Maria del Camí","Capdepera","Alaró","Ariany","Bunyola","Estellencs","Costitx","Llucmajor","Pollença","Puigpunyent","Campanet","Felanitx","Algaida","Llubí","Sineu","Búger","Esporles","Binissalem","Escorca","Sa Pobla","Andratx","Son Servera","Campos","Marratxí","Consell","Lloret de Vistalegre","Vilafranca de Bonany"];
    pueblosSinTilde =   ["Fornalutx","Deia","Sant Joan","Banyalbufar","Maria de la Salut","Arta","Santa Eugenia","Sencelles","Sant Llorenç des Cardassar","Santa Margalida","Petra","Lloseta","Mancor de la Vall","Montuiri","Ses Salines","Santa Maria del Cami","Capdepera","Alaro","Ariany","Bunyola","Estellencs","Costitx","Llucmajor","Pollença","Puigpunyent","Campanet","Felanitx","Algaida","Llubi","Sineu","Buger","Esporles","Binissalem","Escorca","Sa Pobla","Andratx","Son Servera","Campos","Marratxi","Consell","Lloret de Vistalegre","Vilafranca de Bonany"];
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

// función específica - Lista de ubicaciones
function crearTarjetaUbicacion() {
    art = crearArticle("museo");
    art.append(crearImg("img/museo1-small.webp","Museo 1"));
    art.append(crearHeader("titulo-museo-card").append(crearH4("Museo 1")));
    art.append(crearP("mb-4","Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sit amet enim id sapien fermentum aliquet et ut nibh. Sed."));
    art.append(crearDiv("botones-museo")
                .append(crearBoton("X","boton boton-card-museo boton-verde","Añadir"))
                .append(crearBoton("Y","boton boton-card-museo boton-gris","Ver más"))
            );
    return art;
}

// función específica - Lista de ubicaciones
function crearFiltros() {
    filtros = crearDiv("contenedor-filtros");
    filtros.append(crearBoton("boton-filtros","boton-filtros","Filtros")
                    .append(crearImg("img/svg/flecha-menu-down.svg"))
                    .attr({
                        "data-bs-toggle":"collapse",
                        "data-bs-target":"#form-filtro"
                    })
                );
    form = crearForm("form-filtro","form-filtro-museos mt-3 collapse show");
    form
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
                .append(crearP("","10Km")) // Esto me imagino que tendrá que cambiar a medida que se mueve el range
            )
        )
        .append(crearDiv("elemento-filtro-museo")
            .append(crearLabel("","Tipo de exposición"))
            .append(crearSelect("","seleccion-exposicion","select")
                .append(crearOption(1,true,"Todos"))
                .append(crearOption(2,"Todos"))
                .append(crearOption(3,"Todos"))
            )
        )
        .append(crearDiv("elemento-filtro-museo")   // Input texto nombre
                .append(crearLabel("dia-visita","Día de visita"))
                .append(crearInput("date","","dia-visita"))
        )
        .append(crearDiv("elemento-filtro-museo")
            .attr("id","tipo-entrada") // Pocos divs necesitan un id, no veo necesidad de tener que incluir el id en la función para crear div's
            .append(crearP("","Tipo de entrada"))
            .append(crearDiv("opciones-check")
                .append(crearLabel("gratuito","Gratuito")
                    .append(crearInput("checkbox","tipo_entrada[]","gratuito"))
                )
                .append(crearLabel("entrada","Entrada")
                    .append(crearInput("checkbox","tipo_entrada[]","entrada"))
                )
            )
        );
    filtros.append(form);
    
    return filtros;
}

/* --- --- */