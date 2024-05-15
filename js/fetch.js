
const jsonUrlMuseos = "json/museosMallorkCultura.json";
const jsonUrlPueblos = "json/pueblos.json";
const jsonUrlComponentes = "json/componentes.json";

let museos;
let pueblos;
let componentes;

// leer json de pueblos
fetch(jsonUrlPueblos)
    .then(response => response.json())
    .then(data => {
        pueblos = data.cities;
        cargarPueblos();
    })
    .catch(error => console.error("Error al cargar los datos del JSON:", error));

// leer json de museos
fetch(jsonUrlMuseos)
    .then(response => response.json())
    .then(data => {
        museos = data.servicios;
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
    if(div && pueblos) {
        for(let i = 0; i < 9; i++) {
            div.append(crearBotonPueblo(pueblos[i]));
        }
    }
}