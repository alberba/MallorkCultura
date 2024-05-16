
const jsonUrlMuseos = "json/museosMallorkCultura.json";
const jsonUrlPueblos = "json/pueblos.json";
const jsonUrlComponentes = "json/componentes.json";

let museos;
let pueblos;
let pueblosConUbicaciones;
let componentes;

// leer json de pueblos
fetch(jsonUrlPueblos)
    .then(response => response.json())
    .then(data => {
        pueblos = data.cities;
    })
    .catch(error => console.error("Error al cargar los datos del JSON:", error));

// leer json de museos
fetch(jsonUrlMuseos)
    .then(response => response.json())
    .then(data => {
        museos = data.servicios;
        filtrarPueblos();
        cargarPueblos();
    })
    .catch(error => console.error("Error al cargar los datos del JSON:", error));

// leer json de componentes
fetch(jsonUrlComponentes)
    .then(response => response.json())
    .then(data => {
        componentes = data.personas;
    })
    .catch(error => console.error("Error al cargar los datos del JSON:", error));

function cargarPueblos() {
    let div = $(".contenedor-pueblos");
    if(div.length > 0 && pueblos) {
        for(let i = 0; i < 9 && pueblosConUbicaciones[i]; i++) {
            div.append(crearBotonPueblo(pueblosConUbicaciones[i]));
        }
    }
}

function filtrarPueblos() {
    pueblosConUbicaciones = pueblos.filter(pueblo => museos.some(museo => museo.areaServed.address.addressLocality === pueblo.name));
}