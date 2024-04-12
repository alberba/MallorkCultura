/**********************************************************************************************************************************************************
 * FUNCIONES PARA EL BUEN FUNCIONAMIENTO DE LA API DE GOOGLE CALENDAR
 **********************************************************************************************************************************************************/
    const CLIENT_ID = '669018232457-tolv7hmbpgrd2ns604dcmm5dsnligtp0';
    const API_KEY = 'AIzaSyDpJ7opt7DIqghZ5FJ4RC-p-5674AMWy9c';

    // Discovery doc URL for APIs used by the quickstart
    const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

    let tokenClient;
    let gapiInited = false;
    let gisInited = false;



    /**
     * Callback after api.js is loaded.
     */
    function gapiLoaded() {
        gapi.load('client', initializeGapiClient);
    }

    /**
     * Callback after the API client is loaded. Loads the
     * discovery doc to initialize the API.
     */
    async function initializeGapiClient() {
        await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInited = true;
    }

      /**
       * Callback after Google Identity Services are loaded.
       */
      function gisLoaded() {
        tokenClient = google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: '', // defined later
        });
        gisInited = true;
      }

      /**
       *  Sign in the user upon button click.
       */
      function handleAuthClick() {
        tokenClient.callback = async (resp) => {
          if (resp.error !== undefined) {
            throw (resp);
          }
          await listUpcomingEvents();
        };

        if (gapi.client.getToken() === null) {
          // Prompt the user to select a Google Account and ask for consent to share their data
          // when establishing a new session.
          tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
          // Skip display of account chooser and consent dialog for an existing session.
          tokenClient.requestAccessToken({prompt: ''});
        }
      }
/**********************************************************************************************************************************************************
 *  MANEJO DEL CALENDARIO
 **********************************************************************************************************************************************************/
/**
 * Función que se encarga de g.uardar en web storage los eventos de la ruta hecha por el usuario a nivel actual
 */
function ActualizarVisitas(evento) {
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
function crearEventosCalendario() {
    const eventos = recuperarVisitas();
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
            'dateTime': eventos[i].horaInicio,
            'timeZone': 'Europe/Zurich'
            },
            // Fecha de fin del evento
            'end': {
            'dateTime': eventos[i].horaFin,
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
        const request = gapi.client.calendar.events.insert({
            'calendarId': 'primary',
            'resource': event
        });

        try{
            // Enviamos la solicitud
            const response = request.execute();
            // Eliminamos la visita del local storage
            eliminarVisita(eventos[i]);
        }catch(error){
            // Control de errores
            console.log(error);
            console.log("Error al crear el evento: "+event.summary+"\n"+
                        "La api devolvevió: "+response+"\n");
        }

    }
  }
  
  // Clase para el manejo de eventos
  class Evento {
    constructor(lugar, direccion, horaInicio, horaFin, tipo) {
        this.lugar = lugar;
        this.direccion = direccion;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.tipo = tipo;
    }
}