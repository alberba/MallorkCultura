// Función para escapar las comillas simples en un texto
function escaparComillas(texto) {
    return texto.replace(/'/g, "\\'");
}

// Función para almacenar la visita con los detalles del museo
function almacenarVisita(lugar, direccion, tipo) {
    console.log("ALMACENAR VISITA");
    const evento = { lugar, direccion, horaInicio: "2024-06-01T09:00:00", horaFin: "2024-06-01T10:00:00", tipo };
    console.log("EVENTO CREADO:", evento);
    actualizarVisitas(evento);
    console.log("VISITA AÑADIDA");
}

// Función para cargar los museos al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    const museosContainer = document.getElementById("museos-container");
    const jsonData = "json/museosMallorkCultura.json"; // Ruta al archivo JSON

    // Función para cargar los datos del JSON y mostrar los museos
    function cargarMuseos() {
        fetch(jsonData)
            .then(response => response.json())
            .then(data => {
                let museos = data.servicios;

                // Obtiene el número total de museos y establece variables para el control de paginación
                const numMuseos = museos.length;
                let paginaActual = 1;
                const museosPorPagina = 6;
                let inicio = 0;
                let fin = museosPorPagina;

                // Función para mostrar los museos en la página actual
                function mostrarMuseos() {
                    // Borra el contenido anterior de los museos
                    if (museosContainer) {
                        museosContainer.innerHTML = "";

                        // Itera sobre los museos de la página actual y genera el HTML correspondiente
                        for (let i = inicio; i < fin; i++) {
                            if (museos[i]) {
                                const museo = museos[i];
                                console.log("CHECKPOINT 1");
                                console.log(museo);

                                // Escapar comillas simples en los valores de museo
                                const nombreEscapado = escaparComillas(museo.areaServed.name);
                                const direccionEscapada = escaparComillas(museo.areaServed.address.streetAddress);

                                const museoHTML = `
                                    <article class="museo">
                                        <img src="${museo.areaServed.photo[0].contentUrl}" alt="${museo.areaServed.photo[0].description}">
                                        <header class="titulo-museo-card">
                                            <h4>${museo.areaServed.name}</h4>
                                        </header>
                                        <p class="mb-4 descripcion-museo">${museo.areaServed.description}</p>
                                        <div class="botones-museo">
                                            <a type="button" class="boton boton-card-museo boton-verde" onclick="almacenarVisita('${nombreEscapado}', '${direccionEscapada}', '${museo.areaServed["@type"][1]}')">Añadir</a>
                                            <a href="pantalla-museo1.html" class="boton boton-card-museo boton-gris">Ver más</a>
                                        </div>
                                    </article>
                                `;
                                museosContainer.innerHTML += museoHTML;
                            }
                        }
                    }
                    
                }

                // Muestra los museos en la página actual
                mostrarMuseos();

                // Función para cambiar de página
                function changePage(change) {
                    paginaActual += change;
                    inicio = (paginaActual - 1) * museosPorPagina;
                    fin = paginaActual * museosPorPagina;
                    if (inicio < 0) {
                        inicio = 0;
                        fin = museosPorPagina;
                        paginaActual = 1;
                    } else if (fin > numMuseos) {
                        fin = numMuseos;
                        inicio = (paginaActual - 1) * museosPorPagina;
                    }
                    $('#pageNum').text(paginaActual);
                    mostrarMuseos();
                    updatePagination();
                }

                // Event listener para botón de página anterior
                $("#prevPageBtn").on("click", function() {
                    changePage(-1);
                });

                // Event listener para botón de página siguiente
                $("#nextPageBtn").on("click", function() {
                    changePage(1);
                });

                // Función para actualizar la numeración de página
                function updatePagination() {
                    const totalPages = Math.ceil(numMuseos / museosPorPagina);
                    const paginationContainer = $('.paginas p');
                    paginationContainer.html('');

                    if (totalPages <= 3) {
                        for (let i = 1; i <= totalPages; i++) {
                            const pageNum = document.createElement('span');
                            $('#pageNum').text(i);
                            if (i === paginaActual) {
                                pageNum.classList.add('pagina-actual');
                            }
                            pageNum.addEventListener('click', () => changePage(i - paginaActual));
                            paginationContainer.append(pageNum);
                        }
                    } else {
                        const firstPage = $('<span>').text(1)
                        .on('click', () => changePage(1 - paginaActual));
                        paginationContainer.append(firstPage);

                        if (paginaActual > 2) {
                            paginationContainer.append(document.createTextNode('..'));
                        }

                        for (let i = Math.max(2, paginaActual - 1); i < Math.min(totalPages - 1, paginaActual + 2); i++) {
                            const pageNum = $('<span>');
                            pageNum.text(i);
                            if (i === paginaActual) {
                                pageNum.addClass('pagina-actual');
                            }
                            pageNum.on('click', () => changePage(i - paginaActual));
                            paginationContainer.append(pageNum);
                        }

                        if (paginaActual < totalPages - 1) {
                            paginationContainer.append(document.createTextNode('..'));
                        }

                        const lastPage = $('<span>');
                        lastPage.text(totalPages);
                        lastPage.on('click', () => changePage(totalPages - paginaActual));
                        paginationContainer.append(lastPage);
                    }
                }

                // Actualizar la paginación inicialmente
                updatePagination();
            })
            .catch(error => console.error("Error al cargar los datos del JSON:", error));
    }

    // Carga los museos al cargar la página
    cargarMuseos();
});
