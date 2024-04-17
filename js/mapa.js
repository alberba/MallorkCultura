// NO TOCAR
// Sirve para importar las librerías necesarias de Google Maps
(g => { var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window; b = b[c] || (b[c] = {}); var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams, u = () => h || (h = new Promise(async (f, n) => { await (a = m.createElement("script")); e.set("libraries", [...r] + ""); for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]); e.set("callback", c + ".maps." + q); a.src = `https://maps.${c}apis.com/maps/api/js?` + e; d[q] = f; a.onerror = () => h = n(Error(p + " could not load.")); a.nonce = m.querySelector("script[nonce]")?.nonce || ""; m.head.append(a) })); d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)) })
  ({ key: "AIzaSyDpJ7opt7DIqghZ5FJ4RC-p-5674AMWy9c", v: "beta" });

async function initMap() {

  // Importamos la librería para mostrar el mapa
  const { Map } = await google.maps.importLibrary("maps");
  // Librería para marcadores
  const { AdvancedMarkerView} = await google.maps.importLibrary("marker");
  // Librería para rutas
  const { DirectionsService, DirectionsRenderer } = await google.maps.importLibrary("routes");

  // Posición inicial del mapa (Centro del mapa)
  const position = { lat: 39.570279022882914, lng: 2.6411309682497817 };

  let map = new Map(document.getElementById("map"), {
    // Zoom del mapa inicial
    zoom: 12,
    // Posición inicial del mapa
    center: position,
    // Id del mapa (Aplicable para estilos)
    mapId: "DEMO_MAP_ID",
    // Deshabilitar controles por defecto y conseguir un mapa limpio
    disableDefaultUI: true,
    // Muestra el botón de pantalla completa
    fullscreenControl: true,
    // Lo máximo que puede alejarse el usuario
    minZoom: 8,
  });

  // The marker, positioned at Uluru
  const marker = new AdvancedMarkerView({
    map: map,
    // Punto del marker
    position: {lat: 39.570279022882914, lng: 2.6411309682497817},
  });

}

initMap();

const directionsService = new DirectionsService();

// Método para añadir una ruta al mapa
directionsService.route({
  // Origen de la ruta
  origin: { lat: 39.570279022882914, lng: 2.6411309682497817 },
  // Puntos intermedios
  waypoints: [{ location: { lat: 39.57520180772055, lng: 2.6636397140336925 } }],
  // Destino de la ruta
  destination: { lat: 39.58902731565138, lng: 2.653168369738759 },
  // Modo de transporte
  travelMode: "DRIVING",
}, (response, status) => {
  if (status === "OK") { // No hay error en la respuesta
    const directionsRenderer = new DirectionsRenderer();
    // Añadimos la ruta al mapa
    directionsRenderer.setMap(map);
    // Añadimos la respuesta de la ruta
    directionsRenderer.setDirections(response);
  } else {
    // Avisamos al usuario de que ha habido un error
    window.alert("Directions request failed due to " + status);
  }
});