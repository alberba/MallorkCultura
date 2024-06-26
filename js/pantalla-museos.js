/* Función para filtrar ubis por pueblo --> documentar luego */
/**
 * función que filtra las ubicaciones que pertenecen a un ``pueblo`` concreto
 * @param {String} pueblo pueblo por el que se filtran las ubicaciones
 * @returns {Array} array de objetos ubicaciones que contiene las ubicaciones que pertenecen al ``pueblo``
 */
function filtrarUbicacionesPueblo(pueblo) {
    let arrayFiltrado = [];
    ubicaciones.forEach(ubi => {
        if (!ubi.hasOwnProperty("origen")) {
            if (ubi.areaServed.address.addressLocality === pueblo) {
                arrayFiltrado.push(ubi);
            }
        } else {
            switch(ubi.origen) {
                case "MR":
                    if (ubi.address && ubi.address.addressLocality === pueblo) {
                        arrayFiltrado.push(ubi);
                    }
                    break;
                case "DT":
                    if (ubi.address && ubi.address.addressLocality === pueblo) {
                        arrayFiltrado.push(ubi);
                    }
                    break;
                default:
                    console.error("La ubicación",ubi,"tiene un origen incorrecto, no se puede procesar")
                    return;
            }
        }
    });
    return arrayFiltrado;
}

/**
 * Función que se encarga de crear la pantalla de las ubicaciones de todos los pueblos.
 * A esta se accede a partir del botón del header "¿Qué visitar?"
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

    $("main").empty()
    $("main").attr("class","contenedor-principal lista-museos")
        .append(crearBotonAtras("/", "Inicio"))
        .append(crearFiltros());

    let contenedorMuseos = crearDiv("contenedor-museos");
    $("main").append(crearSection().append(contenedorMuseos));
    crearTarjetasUbicacionesPaginaActual(ubicaciones);
    $("main").append(crearSelectorPagina());
    modificarPaginacion(ubicaciones);
    crearPopUpGrafico();
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
    paginaActual = 0;
    // Inicializa el mapa con el centro del pueblo y los marcadores de los museos de ese pueblo
    let ubicacionesPueblo = filtrarUbicacionesPueblo(pueblo);

    $("main").empty()
    $("main").attr("class","contenedor-principal lista-museos");
    $("main").append(crearBotonAtras("/", "Inicio"));
    $("main").append(crearH2(pueblo));
    $("main").append(crearHr());
    $("main").append(crearFiltros());

    let contenedorMuseos = crearDiv("contenedor-museos");
    $("main").append(crearSection().append(contenedorMuseos));
    crearTarjetasUbicacionesPaginaActual(ubicacionesPueblo, pueblo);
    
    $("main").append(crearSelectorPagina());
    modificarPaginacion(ubicacionesPueblo);
}

/**
 * Función que se encarga de generar las tarjetas de los museos y otros
 * edificios del array por parametro, además de cambiar la paginación
 *  en función de la pagina actual.
 */
function crearTarjetasUbicacionesPaginaActual(ubicacionesLocal, pueblo = ""){
    // Obtenemos el contenedor de las tarjetas
    let contenedorMuseo = $(".contenedor-museos");
    // Lo vaciamos
    contenedorMuseo.empty();
    // Añadimos tarjetas una a una desde la primera de la pagina actual,
    // hasta que ya no queden tarjetas o ponga la cantidad museos por pagina
    for(let i=paginaActual*museosPorPagina; i < ubicacionesLocal.length && i < (paginaActual+1)*museosPorPagina; i++){
        // Intentamos crear la tarjeta
        let aux = crearTarjetaUbicacion(ubicacionesLocal[i]);
        if (aux == null) {
            // Revisamos si ha habido un error a la hora de crear tarjetas
            console.error("La tarjeta devuelta está vacía");
        } else {
            // Si todo va bien se une al contendor de museos
            contenedorMuseo.append(aux);
        }
    }

    // Selecciona las ubicaciones de la página actual
    let inicio = paginaActual * museosPorPagina;
    let fin = inicio + 9;
    let ubicacionesGeo = ubicacionesLocal.slice(inicio, fin).map(ubicacion => normalizarGeoUbicaciones(ubicacion));


    // Inicializa el mapa con el centro de Mallorca y los marcadores de todos los museos
    if(pueblo === "") {
        initMap({
            position: centroMallorca, 
            zoom: 9,
            arrPositionMarkers: ubicacionesGeo
        });
    } else {
        // Inicializa el mapa con el centro del pueblo y los marcadores de los museos de ese pueblo
        iniciarMapaPueblo(pueblosConUbicaciones.find(p => p.name === pueblo), ubicacionesLocal);
    }
    modificarPaginacion(ubicacionesLocal);
}

/**
 * Función que se encarga de crear la tarjeta de los lugares de la lista de ubicaciones que pertenecen al json local
 * @param {Object} ubicacion Ubicacion del que se quiere crear la tarjeta
 * @returns {JQuery<HTMLElement>} Un elemento article con la información del museo
 */
function crearTarjetaUbicacion(ubicacion) {
    let photo = {
        contentUrl : "",
        description: ""
    };
    let ubicacionCopia = Object.assign({}, ubicacion);
    switch(ubicacion["@type"]) {
        case "CivicStructure":
            ubicacionCopia.description = ubicacion.description.description;
            photo = {
                contentUrl: ubicacion.image,
                description: "Foto de " + ubicacion.name
            };
            break;
        case "Service":
            photo = {
                contentUrl: ubicacion.areaServed.photo[0].contentUrl,
                description: ubicacion.areaServed.photo[0].description
            };
            ubicacionCopia = ubicacionCopia.areaServed;
            break;
        case "MovieTheater":
            photo = {
                contentUrl: "https://www.descobreixteatre.com/" + ubicacion.image.contentUrl,
                description:"Foto de " + ubicacion.name
            }
            break;
    }
    let botonVerMas = crearBoton("Ver más", "", "boton boton-card-museo boton-gris")
        .attr("href", "/museo?" + ubicacionCopia.name);

    // @ts-ignore
    añadirEventListenerSPA(botonVerMas.get(0));

    return crearArticle("museo")
            .append(crearImg(photo.contentUrl, photo.description)
                    .attr({
                        "property":"photo",
                        "typeof":"ImageObject"
                    })
            )
            .append(crearHeader("titulo-museo-card").append(crearH4(ubicacionCopia.name).attr("property","name")))
            .append(crearP({
                        clases: "mb-4 descripcion-museo",
                        texto: ubicacionCopia.description        
                    })
                    .attr("property","description")
            )
            .append(crearDiv("botones-museo")
                .append(crearBoton("Añadir", "", "boton boton-card-museo boton-verde")
                    .on("click", () => {
                        if (ubicacion["@type"] === "MovieTheater") {
                            almacenarVisita(escaparComillas(ubicacionCopia.name), escaparComillas(ubicacionCopia.address.addressLocality), ubicacion["@type"]);
                        } else {
                            almacenarVisita(escaparComillas(ubicacionCopia.name), escaparComillas(ubicacionCopia.address.streetAddress), ubicacion["@type"]);
                        }
                        // @ts-ignore
                        Swal.fire({
                            title: "Añadido a la ruta",
                            text: "",
                            icon: "success"
                        });
                    })
                )
                .append(botonVerMas)
            );
}
/**
 * Función que se encarga de que la paginación sea correcta en función de la
 * de ubicaciones que tenemos y la pagina en que nos encontramos.
 * @param tarjetas array que contiene las ubicaciones sobre las que se pagina
 */

function modificarPaginacion(tarjetas) {
    // Obtener el elemento paginacion
    let paginacion = $("#paginacion");

    //Si no hay más que una pagina quitamos la paginación
    if (Math.ceil(tarjetas.length / museosPorPagina) < 2) {
        paginacion.empty();
        return;
    }

    paginacion.empty();

    // Obtener los botones de página anterior y página siguiente
    let prevButton = crearBoton("");
    prevButton.append(crearImg("img/svg/prev-page-arr.svg", "Página anterior"));
    let nextButton = crearBoton("");
    nextButton.append(crearImg("img/svg/next-page-arr.svg", "Página siguiente"));

    // Añadir evento onclick a los botones
    prevButton.on('click', function () {
        if (paginaActual > 0) {
            paginaActual--;
            crearTarjetasUbicacionesPaginaActual(tarjetas);
            $(".contenedor-museos").get(0)?.scrollIntoView({behavior: "smooth"});
        }
    });

    nextButton.on('click', function () {
        if (paginaActual < Math.ceil(tarjetas.length / museosPorPagina) - 1) {
            paginaActual++;
            crearTarjetasUbicacionesPaginaActual(tarjetas);
            $(".contenedor-museos").get(0)?.scrollIntoView({behavior: "smooth"});
        }
    });

    paginacion.append(prevButton);
    // Calculamos cuantas paginas habrá
    let totalPaginas = Math.ceil(tarjetas.length / museosPorPagina);

    // Si hay menos de 4 paginas, se muestran todas
    const clasePaginaActual="pagina-actual";
    //Comprobamos si hay menos de 4 páginas para solo generar esa cantidad
    if (totalPaginas <= 4) {
        for (let i = 1; i <= totalPaginas; i++) {
            let span = crearSpan("", i.toString()).on('click', function () {
                paginaActual = i - 1;
                crearTarjetasUbicacionesPaginaActual(tarjetas);
                $(".contenedor-museos").get(0)?.scrollIntoView({behavior: "smooth"});
            });
            if(paginaActual == i - 1){
                span.addClass(clasePaginaActual);
            }
            paginacion.append(span);
        }
    } else {
        // Si estamos en las primeras 3 paginas tendremos el formato 1 2 3 .. totalPaginas
        if(paginaActual > 0 && paginaActual <= 3) {
            for (let i = 1; i <= 3; i++) {
                let span = crearSpan("", i.toString()).on('click', function () {
                    paginaActual = i - 1;
                    crearTarjetasUbicacionesPaginaActual(tarjetas);
                    $(".contenedor-museos").get(0)?.scrollIntoView({behavior: "smooth"});
                });
                if(paginaActual == i - 1){
                    span.addClass(clasePaginaActual);
                }
                paginacion.append(span);
            }
            paginacion.append(crearP({
                clases: "",
                texto: ".."
            }));
            let lastPage = crearSpan("", totalPaginas.toString()).on('click', function () {
                paginaActual = totalPaginas - 1;
                crearTarjetasUbicacionesPaginaActual(tarjetas);
                $(".contenedor-museos").get(0)?.scrollIntoView({behavior: "smooth"});
            });
            paginacion.append(lastPage);
        // Si estamos en paginas intermedias tendremos el formato 1 .. paginaActual-1 paginaActual paginaActual+1 .. totalPaginas
        }else if(paginaActual > 3 && paginaActual < totalPaginas - 3){
            let firstPage = crearSpan("", "1").on('click', function () {
                paginaActual = 0;
                crearTarjetasUbicacionesPaginaActual(tarjetas);
            });
            paginacion.append(firstPage);
            paginacion.append(crearP({
                clases: "",
                texto: ".."
            }));
            for (let i = paginaActual; i <= paginaActual + 1; i++) {
                let span = crearSpan("", i.toString()).on('click', function () {
                    paginaActual = i - 1;
                    crearTarjetasUbicacionesPaginaActual(tarjetas);
                    $(".contenedor-museos").get(0)?.scrollIntoView({behavior: "smooth"});
                });
                if(paginaActual == i - 1){
                    span.addClass(clasePaginaActual);
                }
                paginacion.append(span);
            }
            paginacion.append(crearP({
                clases: "",
                texto: ".."
            }));
            let lastPage = crearSpan("", totalPaginas.toString()).on('click', function () {
                paginaActual = totalPaginas - 1;
                crearTarjetasUbicacionesPaginaActual(tarjetas);
                $(".contenedor-museos").get(0)?.scrollIntoView({behavior: "smooth"});
            });
            paginacion.append(lastPage);
        // Si estamos en las ultimas 3 paginas tendremos el formato 1 .. totalPaginas-2 totalPaginas-1 totalPaginas
        }else{
            let firstPage = crearSpan("", "1").on('click', function () {
                paginaActual = 0;
                crearTarjetasUbicacionesPaginaActual(tarjetas);
                $(".contenedor-museos").get(0)?.scrollIntoView({behavior: "smooth"});
            });
            paginacion.append(firstPage);
            paginacion.append(crearP({
                clases: "",
                texto: ".."
            }));
            for (let i = totalPaginas - 2; i <= totalPaginas; i++) {
                let span = crearSpan("", i.toString()).on('click', function () {
                    paginaActual = i - 1;
                    crearTarjetasUbicacionesPaginaActual(tarjetas);
                    $(".contenedor-museos").get(0)?.scrollIntoView({behavior: "smooth"});
                });
                if(paginaActual == i - 1){
                    span.addClass(clasePaginaActual);
                }
                paginacion.append(span);
            }
        }
    }

    paginacion.append(nextButton);
}

/**
 * Función que calcula cuántos edificios hay por pueblo y prepara los datos para el gráfico.
 * @returns {Object} Datos para el gráfico con los cinco pueblos con más ubicaciones y "Otros".
 */
function calcularDatosPueblos() {
    let cantidadMuseosPorPueblo = {};
    let otros = 0;

    // Contar cantidad de museos por pueblo
    ubicaciones.forEach(ubi => {
        let pueblo = "";
        if (!ubi.hasOwnProperty("origen")) {
            if (ubi.areaServed.address && ubi.areaServed.address.addressLocality) {
                pueblo = ubi.areaServed.address.addressLocality;
            }
        } else {
            if (ubi.address && ubi.address.addressLocality) {
                pueblo = ubi.address.addressLocality;
            }
        }

        if (pueblo) {
            if (!cantidadMuseosPorPueblo[pueblo]) {
                cantidadMuseosPorPueblo[pueblo] = 0;
            }
            cantidadMuseosPorPueblo[pueblo]++;
        }
    });

    // Convertir a array y ordenar por cantidad de museos
    let pueblosOrdenados = Object.entries(cantidadMuseosPorPueblo).sort((a, b) => b[1] - a[1]);

    // Separar los cinco primeros pueblos y sumar el resto
    let top5Pueblos = pueblosOrdenados.slice(0, 5);
    let restoPueblos = pueblosOrdenados.slice(5);

    restoPueblos.forEach(pueblo => {
        otros += pueblo[1];
    });

    // Preparar datos para el gráfico
    let arrayCantidadMuseosPueblo = top5Pueblos.map(pueblo => pueblo[1]);
    let arrayNombrePueblos = top5Pueblos.map(pueblo => pueblo[0]);

    if (otros > 0) {
        arrayCantidadMuseosPueblo.push(otros);
        arrayNombrePueblos.push("Otros");
    }

    return { arrayCantidadMuseosPueblo, arrayNombrePueblos };
}

/**
 * Función que se encarga de crear un botón en el footer con un pop-up que muestra un gráfico de barras.
 * El gráfico tiene 6 barras con la información proporcionada.
 */
function crearPopUpGrafico() {
    // Crear botón con imagen en el footer
    let footer = $("footer");
    let enlacePrivacidad = footer.find("a[href='/privacy']");
    let botonGrafico = crearBoton("", "boton-grafico");
    let imgGrafico = crearImg("img/iconobarras.webp", "Gráfico de barras").addClass("icono-grafico");
    botonGrafico.append(imgGrafico);
    enlacePrivacidad.before(botonGrafico);

    // Mostrar el pop-up modal al hacer clic en el botón
    botonGrafico.on("click", () => {
        let { arrayCantidadMuseosPueblo, arrayNombrePueblos } = calcularDatosPueblos();
        
        // @ts-ignore
        // Crear el pop-up que muestra el gráfico de barras
        Swal.fire({
            // Título del grafico
            title: 'Gráfico de barras',
            // HTML con el canvas del gráfico
            html: '<canvas id="graficoBarras"></canvas>',
            // Tamaño del pop-up
            width: 800,
            // Botón de cerrar
            showCloseButton: true,
            // No mostrar botón de confirmar
            showConfirmButton: false,
            // Función que se ejecuta al abrir el pop-up
            didOpen: () => {
                let canvasElement = document.getElementById('graficoBarras');
                if (canvasElement instanceof HTMLCanvasElement) {
                    let ctx = canvasElement.getContext('2d');
                    if (ctx) {
                        // Crear gráfico de barras
                        // @ts-ignore
                        new Chart(ctx, {
                            type: 'bar',
                            data: {
                                labels: arrayNombrePueblos,
                                datasets: [{
                                    label: 'Cantidad de Edificios',
                                    data: arrayCantidadMuseosPueblo,
                                    backgroundColor: [
                                        'rgba(255, 99, 132, 0.2)',
                                        'rgba(54, 162, 235, 0.2)',
                                        'rgba(255, 206, 86, 0.2)',
                                        'rgba(75, 192, 192, 0.2)',
                                        'rgba(153, 102, 255, 0.2)',
                                        'rgba(255, 159, 64, 0.2)'
                                    ],
                                    borderColor: [
                                        'rgba(255, 99, 132, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)',
                                        'rgba(75, 192, 192, 1)',
                                        'rgba(153, 102, 255, 1)',
                                        'rgba(255, 159, 64, 1)'
                                    ],
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                scales: {
                                    // @ts-ignore
                                    y: {
                                        beginAtZero: true
                                    }
                                }
                            }
                        });
                    } else {
                        console.error("No se pudo obtener el contexto 2D del canvas");
                    }
                } else {
                    console.error("El elemento no es un canvas");
                }
            }
        });
    });
}

