// Seleccionar los botones de cambio de página por su ID
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');

// Añadir eventos de clic a los botones de cambio de página
prevPageBtn.addEventListener('click', previousPage);
nextPageBtn.addEventListener('click', nextPage);

// Función para ir a la página anterior
function previousPage() {
    changePage(-1);
}

// Función para ir a la siguiente página
function nextPage() {
    changePage(1);
}

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
                    museosContainer.innerHTML = "";

                    // Itera sobre los museos de la página actual y genera el HTML correspondiente
                    for (let i = inicio; i < fin; i++) {
                        if (museos[i]) {
                            const museo = museos[i];
                            const museoHTML = `
                                <article class="museo">
                                    <img src="${museo.areaServed.photo[0].contentUrl}" alt="${museo.areaServed.name}">
                                    <header class="titulo-museo-card">
                                        <h4>${museo.areaServed.name}</h4>
                                    </header>
                                    <p class="mb-4 descripcion-museo">${museo.areaServed.description}</p>
                                    <div class="botones-museo">
                                        <a type="button" class="boton boton-card-museo boton-verde">Añadir</a>
                                        <a href="pantalla-museo1.html" class="boton boton-card-museo boton-gris">Ver más</a>
                                    </div>
                                </article>
                            `;
                            museosContainer.innerHTML += museoHTML;
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
                    document.getElementById("pageNum").innerText = paginaActual;
                    mostrarMuseos();
                    updatePagination();
                }

                // Event listener para botón de página anterior
                document.getElementById("prevPageBtn").addEventListener("click", function() {
                    changePage(-1);
                });

                // Event listener para botón de página siguiente
                document.getElementById("nextPageBtn").addEventListener("click", function() {
                    changePage(1);
                });

                // Función para actualizar la numeración de página
                function updatePagination() {
                    const totalPages = Math.ceil(numMuseos / museosPorPagina);
                    const paginationContainer = document.querySelector('.paginas p');
                    paginationContainer.innerHTML = '';

                    if (totalPages <= 3) {
                        for (let i = 1; i <= totalPages; i++) {
                            const pageNum = document.createElement('span');
                            pageNum.textContent = i;
                            if (i === paginaActual) {
                                pageNum.classList.add('pagina-actual');
                            }
                            pageNum.addEventListener('click', () => changePage(i - paginaActual));
                            paginationContainer.appendChild(pageNum);
                        }
                    } else {
                        const firstPage = document.createElement('span');
                        firstPage.textContent = 1;
                        firstPage.addEventListener('click', () => changePage(1 - paginaActual));
                        paginationContainer.appendChild(firstPage);

                        if (paginaActual > 2) {
                            paginationContainer.appendChild(document.createTextNode('..'));
                        }

                        for (let i = Math.max(2, paginaActual - 1); i < Math.min(totalPages - 1, paginaActual + 2); i++) {
                            const pageNum = document.createElement('span');
                            pageNum.textContent = i;
                            if (i === paginaActual) {
                                pageNum.classList.add('pagina-actual');
                            }
                            pageNum.addEventListener('click', () => changePage(i - paginaActual));
                            paginationContainer.appendChild(pageNum);
                        }

                        if (paginaActual < totalPages - 1) {
                            paginationContainer.appendChild(document.createTextNode('..'));
                        }

                        const lastPage = document.createElement('span');
                        lastPage.textContent = totalPages;
                        lastPage.addEventListener('click', () => changePage(totalPages - paginaActual));
                        paginationContainer.appendChild(lastPage);
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

