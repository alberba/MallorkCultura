const jsonUrlMallorcaRoute = "https://mallorcaroute.com/edificios.json";
const jsonUrlDescobreixTeatre = "https://www.descobreixteatre.com/assets/json/Teatre.json";

const jsonUrlMuseos = "json/museosMallorkCultura.json";
const jsonUrlPueblos = "json/pueblos.json";
const jsonUrlComponentes = "json/componentes.json";

let ubicaciones = [];
let pueblos;
let pueblosConUbicaciones;
let componentes;
let edificios;
let teatros;

let responseStatusMRoute = false;
let responseStatusDT = false;

function leerJSONMallorcaRoute() {
    return fetch(jsonUrlMallorcaRoute)
        .then(response => response.json())
        .then(data => {
            edificios = data.itemListElement;
            edificios.forEach(edificio => {
                edificio.origen = "MR";
                ubicaciones.push(edificio);
                console.log("MR");
            });
            
            responseStatusMRoute = true;
        })
        .catch(error => console.error("Error al cargar los datos del JSON Mallorca Route:", error));
}

function leerJSONDescobreixTeatre() {
    return fetch(jsonUrlDescobreixTeatre)
        .then(response => response.json())
        .then(data => {
            teatros = data.itemListElement;
            teatros.forEach(teatro => {
                teatro.origen = "DT";
                ubicaciones.push(teatro);
            });
            console.log("Teatre");
            
            responseStatusDT = true;
        })
        .catch(error => console.error("Error al cargar los datos del JSON Descobreix Teatre:", error));
}

/**
 * fetch que lee el JSON local con la información de los pueblos
 * @param {String} jsonUrlPueblos Ubicación del fichero de los pueblos
 */
fetch(jsonUrlPueblos)
    .then(response => response.json())
    .then(data => {
        pueblos = data.cities;
        // leer json de museos
        fetch(jsonUrlMuseos)
            .then(response => response.json())
            .then(data => {
                ubicaciones = data.servicios;
                return Promise.all([leerJSONMallorcaRoute(), leerJSONDescobreixTeatre()]);
            }).then(() => {
                filtrarPueblos();
                cargarPueblos();
                cargarContenido();
                crearFooter();
            }).catch(error => console.error("Error al cargar los datos del JSON:", error));
    })
    .catch(error => console.error("Error al cargar los datos del JSON:", error));

/**
 * fetch que lee el JSON local con la información de los componentes del equipo de desarrollo
 * @param {String} jsonUrlComponentes Ubicación del fichero de los componentes
 */
fetch(jsonUrlComponentes)
    .then(response => response.json())
    .then(data => {
        componentes = data.personas;
    })
    .catch(error => console.error("Error al cargar los datos del JSON:", error));

/**
 * función que añade los pueblos a la página inicial que contienen alguna ubicación
 * si hay más de nueve pueblos, añade los 9 primeros y un botón de "ver más" que muestra los demás pueblos
 */
function cargarPueblos() {
    let div = $(".contenedor-pueblos");
    if(div.length > 0 && pueblosConUbicaciones) {
        for(let i = 0; i < 9 && pueblosConUbicaciones[i]; i++) {
            div.append(crearBotonPueblo(pueblosConUbicaciones[i]));
        }
        if(pueblosConUbicaciones.length > 9) {
            $("main").append(crearBotonVerMas_Pueblos());
        }
    }
}

/**
 * función que actualiza el array ``pueblosConUbicaciones`` para que contenga aquellos pueblos que tengan alguna ubicación
 */
function filtrarPueblos() {
    console.log(ubicaciones);
    pueblosConUbicaciones = pueblos.filter(pueblo => ubicaciones.some(ubicacion => {
        switch(ubicacion["@type"]) {
            case "MovieTheater":
            case "CivicStructure":
                return ubicacion.address ? ubicacion.address.addressLocality === pueblo.name : false;
            case "Service":
                return ubicacion.areaServed.address.addressLocality === pueblo.name;
        }
    }));
}