// NO TOCAR
// Sirve para importar las librerías necesarias de Google Maps
// @ts-ignore
(g => { var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window; b = b[c] || (b[c] = {}); var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams, u = () => h || (h = new Promise(async (f, n) => { await (a = m.createElement("script")); e.set("libraries", [...r] + ""); for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]); e.set("callback", c + ".maps." + q); a.src = `https://maps.${c}apis.com/maps/api/js?` + e; d[q] = f; a.onerror = () => h = n(Error(p + " could not load.")); a.nonce = m.querySelector("script[nonce]")?.nonce || ""; m.head.append(a) })); d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)) })
  ({ key: "AIzaSyDpJ7opt7DIqghZ5FJ4RC-p-5674AMWy9c", v: "weekly", language: "es", region: "ES", libraries: "marker" });

let directionsRenderer;
let map;
let markers = [];
/**
 * Función encargada para inicializar el mapa y mostrarlo por pantalla
 * @param position Posición central del mapa
 * @param zoom Zoom del mapa. Cuanto mayor sea el número, la vista del mapa será más cercana. 
 *             Por defecto, el valor del zoom será 12.
 * @param arrPositionMarkers Optional. Array de posiciones de los marcadores que se quieren añadir al mapa.
 * @param arrPositionRoutes Optional. Array de posiciones de la ruta que se quiere añadir al mapa.
 */
  async function initMap({position, zoom=12, arrPositionMarkers=[], arrPositionRoutes=[]}) {

  // Importamos la librería para mostrar el mapa
  // @ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  // Librería para marcadores
  // @ts-ignore
  const { AdvancedMarkerElement} = await google.maps.importLibrary("marker");
  // Librería para rutas
  // @ts-ignore
  const { DirectionsService, DirectionsRenderer } = await google.maps.importLibrary("routes");

  // Posición inicial del mapa (Centro del mapa)

  map = new Map(document.getElementById("map"), {
    // Zoom del mapa inicial
    zoom: zoom,
    // Posición inicial del mapa
    center: position,
    // Id del mapa (Aplicable para estilos)
    mapId: "8a56541fb48439ba",
    // Deshabilitar controles por defecto y conseguir un mapa limpio
    disableDefaultUI: true,
    // Muestra el botón de pantalla completa
    fullscreenControl: true,
    // Lo máximo que puede alejarse el usuario
    minZoom: 8,
  });

  // Añadimos los marcadores al mapa, en caso de que sean pasados por parámetro
  if (arrPositionMarkers.length > 0) {
    arrPositionMarkers.forEach(positionMarker => {
      let marker = new AdvancedMarkerElement({
        map: map,
        position: positionMarker
      });
      markers.push(marker);
    });
  }

  // Añadimos la ruta al mapa, en caso de que sea pasada por parámetro
  if (arrPositionRoutes.length > 0) {
    const directionsService = new DirectionsService();
    // En caso de que haya más de dos puntos en la ruta, tendremos 
    // que hacer uso de puntos intermedios
    if (arrPositionRoutes.length > 2) {
      directionsService.route({
        // Origen de la ruta

        origin: { lat: arrPositionRoutes[0].lat, lng: arrPositionRoutes[0].lng },
        // Puntos intermedios
        waypoints: arrPositionRoutes.slice(1,-1).map(pos => ({ location: { lat: pos.lat, lng: pos.lng } })),
        // Destino de la ruta
        destination: { lat: arrPositionRoutes[arrPositionRoutes.length - 1].lat, lng: arrPositionRoutes[arrPositionRoutes.length - 1].lng },
        // Modo de transporte
        travelMode: "DRIVING",
      }, (response, status) => {
        if (status === "OK") { // No hay error en la respuesta
          directionsRenderer = new DirectionsRenderer();
          // Añadimos la ruta al mapa
          directionsRenderer.setMap(map);
          // Añadimos la respuesta de la ruta
          directionsRenderer.setDirections(response);
        } else {
          // Avisamos al usuario de que ha habido un error
          window.alert("Directions request failed due to " + status);
        }
      });
    } else {
      // En caso de que haya dos puntos en la ruta, no necesitamos puntos intermedios
      directionsService.route({
        origin: { lat: arrPositionRoutes[0].lat, lng: arrPositionRoutes[0].lng },
        destination: { lat: arrPositionRoutes[1].lat, lng: arrPositionRoutes[1].lng },
        travelMode: "DRIVING",
      }, (response, status) => {
        if (status === "OK") {
          directionsRenderer = new DirectionsRenderer();
          directionsRenderer.setMap(map);
          directionsRenderer.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      });
    }
  }

}

/**
 * Función encargada de iniciar el mapa en la localización de un pueblo junto con sus museos
 * @param {Object} dataPueblo Objeto con la información del pueblo sacada del JSON
 * @param {Array<Object>} museosPueblo Array con la información de los museos del pueblo
 */
function iniciarMapaPueblo(dataPueblo, museosPueblo) {
  // Ofrece una experiencia personalizada para los pueblos
  let zoomMapa = 12;
  if (dataPueblo.name !== "Palma") {
      zoomMapa = 14;
  }

  // Filtra y prepara la geolocalización de los museos del pueblo con el formato adecuado
  let museosPuebloGeo = museosPueblo.map(museo => ({lat: parseFloat(museo.areaServed.geo.latitude), lng: parseFloat(museo.areaServed.geo.longitude)}));
  initMap({ 
      position: {lat: parseFloat(dataPueblo.latitude), lng: parseFloat(dataPueblo.longitude)},
      zoom: zoomMapa,
      arrPositionMarkers: museosPuebloGeo
  });
}

async function actualizarRouteMaps(arrPositionRoutes) {
  // @ts-ignore
  const { DirectionsService, DirectionsRenderer } = await google.maps.importLibrary("routes");
  // Añadimos la ruta al mapa, en caso de que sea pasada por parámetro
  if (arrPositionRoutes.length > 0) {
    const directionsService = new DirectionsService();
    // En caso de que haya más de dos puntos en la ruta, tendremos 
    // que hacer uso de puntos intermedios
    if (arrPositionRoutes.length > 2) {
      directionsService.route({
        // Origen de la ruta

        origin: { lat: arrPositionRoutes[0].lat, lng: arrPositionRoutes[0].lng },
        // Puntos intermedios
        waypoints: arrPositionRoutes.slice(1,-1).map(pos => ({ location: { lat: pos.lat, lng: pos.lng } })),
        // Destino de la ruta
        destination: { lat: arrPositionRoutes[arrPositionRoutes.length - 1].lat, lng: arrPositionRoutes[arrPositionRoutes.length - 1].lng },
        // Modo de transporte
        travelMode: "DRIVING",
      }, (response, status) => {
        if (status === "OK") {
          // Añadimos la respuesta de la ruta
          directionsRenderer.setDirections(response);
        } else {
          // Avisamos al usuario de que ha habido un error
          window.alert("Directions request failed due to " + status);
        }
      });
    } else {
      // En caso de que haya dos puntos en la ruta, no necesitamos puntos intermedios
      directionsService.route({
        origin: { lat: arrPositionRoutes[0].lat, lng: arrPositionRoutes[0].lng },
        destination: { lat: arrPositionRoutes[1].lat, lng: arrPositionRoutes[1].lng },
        travelMode: "DRIVING",
      }, (response, status) => {
        if (status === "OK") {
          directionsRenderer = new DirectionsRenderer();
          directionsRenderer.setMap(map);
          directionsRenderer.setDirections(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      });
    }
  }
}

async function actualizarMarkerMaps(arrPositionMarkers) {
  setMapOnAll(null);
  markers = [];
  // @ts-ignore
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  // Añadimos los marcadores al mapa, en caso de que sean pasados por parámetro
  if (arrPositionMarkers.length > 0) {
    arrPositionMarkers.forEach(positionMarker => {
      let marker = new AdvancedMarkerElement({
        map: map,
        position: positionMarker
      });
      markers.push(marker);
    });
  }
}

function setMapOnAll(map) {
  markers.forEach(marker => {
    marker.setMap(map);
  });
}