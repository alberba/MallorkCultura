/**********************************************************************************************************************************************************
 * FUNCIONES PARA EL BUEN FUNCIONAMIENTO DE LA API DE GOOGLE CALENDAR
 **********************************************************************************************************************************************************/
const CLIENT_ID = '669018232457-tolv7hmbpgrd2ns604dcmm5dsnligtp0';
const API_KEY = 'AIzaSyDYRvgHLEuiLChioE6uR_4rpRNRN7yVJME';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/calendar';

let tokenClient;
let gapiInited = false;
let gisInited = false;



/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
    // @ts-ignore
    gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
    // @ts-ignore
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
    // @ts-ignore
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
        throw (resp);
        }
        await crearEventosCalendario();
    };

    // @ts-ignore
    if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.requestAccessToken({prompt: ''});
    }
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        const botonGuardar = document.getElementById('add-to-calendar-button');
        if(botonGuardar && botonGuardar instanceof HTMLButtonElement){
            botonGuardar.disabled = false;
        }
    }
}
/**********************************************************************************************************************************************************
 *  MANEJO DEL CALENDARIO
 **********************************************************************************************************************************************************/

function generarHorasAleatorias() {
    const horasInicio = Math.floor(Math.random() * 24); // Genera una hora aleatoria entre 0 y 23
    const minutosInicio = Math.floor(Math.random() * 60); // Genera minutos aleatorios entre 0 y 59
    const segundosInicio = Math.floor(Math.random() * 60); // Genera segundos aleatorios entre 0 y 59

    const horasFin = (horasInicio + Math.floor(Math.random() * (24 - horasInicio))) % 24; // Genera una hora aleatoria mayor que la hora de inicio
    const minutosFin = Math.floor(Math.random() * 60); // Genera minutos aleatorios entre 0 y 59
    const segundosFin = Math.floor(Math.random() * 60); // Genera segundos aleatorios entre 0 y 59

    // Formatea las horas, minutos y segundos para asegurarse de que tienen dos dígitos
    const horaInicioStr = horasInicio.toString().padStart(2, '0');
    const minutosInicioStr = minutosInicio.toString().padStart(2, '0');
    const segundosInicioStr = segundosInicio.toString().padStart(2, '0');
    
    const horaFinStr = horasFin.toString().padStart(2, '0');
    const minutosFinStr = minutosFin.toString().padStart(2, '0');
    const segundosFinStr = segundosFin.toString().padStart(2, '0');

    const horaInicio = `${horaInicioStr}:${minutosInicioStr}:${segundosInicioStr}`;
    const horaFin = `${horaFinStr}:${minutosFinStr}:${segundosFinStr}`;

    return { horaInicio, horaFin };
}

/**
 * Función que se encarga de g.uardar en web storage los eventos de la ruta hecha por el usuario a nivel actual
 */
function actualizarVisitas(evento) {
    const arrayJSONRecuperado = localStorage.getItem('visitas');
    if (arrayJSONRecuperado) {
        const arrayDeObjetosRecuperado = JSON.parse(arrayJSONRecuperado);
        arrayDeObjetosRecuperado.push(evento);
        localStorage.setItem('visitas', JSON.stringify(arrayDeObjetosRecuperado));
    } else {
        const arrayDeObjetos = [evento];
        localStorage.setItem('visitas', JSON.stringify(arrayDeObjetos));
    }
}

/**
 * Función que se encarga de recuperar las visitas de web storage y devolverlas
 */
function recuperarVisitas() {
    const arrayJSONRecuperado = localStorage.getItem('visitas');
    if (arrayJSONRecuperado) {
        return JSON.parse(arrayJSONRecuperado);
    } else {
        return [];
    }

}

/**
 * 
 * Elimina un evento concreto de las visitas
 */
function eliminarVisita(evento) {
    const arrayJSONRecuperado = localStorage.getItem('visitas');
    if (arrayJSONRecuperado) {
        const arrayDeObjetosRecuperado = JSON.parse(arrayJSONRecuperado);
        const arrayFiltrado = arrayDeObjetosRecuperado.filter((element) => {
            return (element.lugar !== evento.lugar) && (element.direccion !== evento.direccion);
        });
        localStorage.setItem('visitas', JSON.stringify(arrayFiltrado));
    }

}


/**
 * Función que se encarga de crear todos los eventos de una ruta en el calendario de google
 */
async function crearEventosCalendario() {
    const eventos = recuperarVisitas();
    const dia = localStorage.getItem('fechaVisita');

    // Bucle para recorrer todos los eventos y crearlos en el calendario
    for(let i = 0; i < eventos.length; i++) {
        // Creamos un evento
        const event = {
            // Título del evento
            'summary': 'Visita a ' + eventos[i].lugar,
            // Ubicación del evento
            'location': eventos[i].direccion,
            // Descripción del evento
            'description': 'Visita a ' + eventos[i].tipo,
            // Fecha de inicio del evento
            'start': {
                'dateTime': dia + "T" + eventos[i].horaInicio,
                'timeZone': 'Europe/Zurich'
            },
            // Fecha de fin del evento
            'end': {
                'dateTime': dia + "T" + eventos[i].horaFin,
                'timeZone': 'Europe/Zurich'
            },
            // Recordatorios del evento
            // He elegido 24 horas antes un email y 30 minutos antes una notificación del móvil
            'reminders': {
                'useDefault': false,
                'overrides': [
                    {'method': 'email', 'minutes': 24 * 60},
                    {'method': 'popup', 'minutes': 30}
                ]
            }
        };
        // Creamos una solicitud de api
        // @ts-ignore
        const request = gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': event
        });

        let response

        try{
            // Enviamos la solicitud
            response = request.execute();
            // Eliminamos la visita del local storage
            eliminarVisita(eventos[i]);
        }catch(error){
            // Control de errores
            console.error(error);
            console.error("Error al crear el evento: "+event.summary+"\n"+
                        "La api devolvevió: "+response+"\n");
            return;
        }

    }
    crearTuRuta(this);
}