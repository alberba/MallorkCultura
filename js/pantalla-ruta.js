// Función para mostrar la ruta en la pantalla
function mostrarRuta() {
    const eventos = recuperarVisitas();
    const contenedorRuta = document.querySelector('.section-ruta');

    // Verificar si el contenedor existe
    if (!contenedorRuta) {
        console.error("El contenedor de la ruta no se encuentra.");
        return;
    }
    
    // Limpiar el contenido existente del contenedor
    contenedorRuta.innerHTML = '';

    // Verificar si hay eventos
    if (eventos.length === 0) {
        // Si no hay eventos, mostrar un mensaje
        contenedorRuta.innerHTML = '<p>Todavía no has empezado a diseñar tu ruta</p>';
        var botonGuardar = document.querySelector('.guardar-calendar button');
        if(botonGuardar != null){
            botonGuardar.remove();
        }
    } else {
        // Si hay eventos, mostrar cada uno en la lista
        eventos.forEach((evento, index) => {
            const duracion = calcularDuracion(evento.horaInicio, evento.horaFin);
            const descanso = index === eventos.length - 1 ? '' : '<div><p class="descanso">Descanso: 1h</p></div>';

            const li = document.createElement('li');
            li.classList.add('parada-ruta');

            const divLeft = document.createElement('div');
            divLeft.classList.add('left-museo-ruta');

            const horas = document.createElement('p');
            horas.classList.add('horas');
            horas.textContent = `${evento.horaInicio.split('T')[1].slice(0, 5)} - ${evento.horaFin.split('T')[1].slice(0, 5)}`;
            divLeft.appendChild(horas);

            const circ = document.createElement('span');
            circ.classList.add('circ');
            divLeft.appendChild(circ);

            li.appendChild(divLeft);

            const divRight = document.createElement('div');

            const h5Container = document.createElement('div');
            h5Container.classList.add('parada-ruta','museo-container');

            const h5 = document.createElement('h5');
            h5.textContent = evento.lugar;

            const botonEliminar = document.createElement('button');
            botonEliminar.classList.add('no-style-button', 'cruz-ruta');
            botonEliminar.setAttribute('onclick', `eliminarMuseoRuta(${index})`);
            const imgCruz = document.createElement('img');
            imgCruz.setAttribute('src', 'img/svg/cruz.svg');
            imgCruz.setAttribute('alt', 'Símbolo de cruz para tachar un museo de la ruta');
            botonEliminar.appendChild(imgCruz);

            h5Container.appendChild(h5);
            h5Container.appendChild(botonEliminar);

            divRight.appendChild(h5Container);

            const formulario = document.createElement('form');
            formulario.classList.add('formulario-ruta');

            const divInicio = document.createElement('div');
            const labelInicio = document.createElement('label');
            labelInicio.setAttribute('for', 'inicio');
            labelInicio.textContent = 'Inicio:';
            const selectInicio = document.createElement('select');
            selectInicio.setAttribute('name', 'inicio');
            const optionInicio = document.createElement('option');
            optionInicio.textContent = evento.horaInicio.split('T')[1].slice(0, 5); // Mostrar solo hora y minutos
            selectInicio.appendChild(optionInicio);
            divInicio.appendChild(labelInicio);
            divInicio.appendChild(selectInicio);

            formulario.appendChild(divInicio);

            const divDuracion = document.createElement('div');
            const labelDuracion = document.createElement('label');
            labelDuracion.setAttribute('for', 'duracion');
            labelDuracion.textContent = 'Duración:';
            const selectDuracion = document.createElement('select');
            selectDuracion.setAttribute('name', 'duracion');
            const optionDuracion = document.createElement('option');
            optionDuracion.textContent = duracion; // Mostrar duración con minutos
            selectDuracion.appendChild(optionDuracion);
            divDuracion.appendChild(labelDuracion);
            divDuracion.appendChild(selectDuracion);

            formulario.appendChild(divDuracion);
            divRight.appendChild(formulario);

            

            li.appendChild(divRight);
            contenedorRuta.appendChild(li);
            contenedorRuta.innerHTML += descanso;
        });
        var botonGuardar = document.querySelector('.guardar-calendar button');
        if(botonGuardar == null){
            const contenedorBoton = document.querySelector('.guardar-calendar');

            if(contenedorBoton == null){
                console.error("El contenedor de la ruta no se encuentra.");
                return;
            }

            botonGuardar = document.createElement('button');
            botonGuardar.classList.add('boton', 'boton-verde');
            botonGuardar.textContent = 'Añadir a calendar';
            botonGuardar.setAttribute('onclick', 'guardarRuta()');

            // Insertar el botón después de la lista de eventos
            contenedorBoton.appendChild(botonGuardar);
        }
    }
}

// Función para calcular la duración entre dos horas
function calcularDuracion(horaInicio, horaFin) {
    const inicio = new Date(horaInicio);
    const fin = new Date(horaFin);
    const duracionMinutos = Math.round((fin.getTime() - inicio.getTime()) / (1000 * 60)); // Convertir milisegundos a minutos y redondear
    return `${Math.floor(duracionMinutos / 60)}h ${duracionMinutos % 60}min`; // Mostrar duración con horas y minutos
}

// Función para eliminar un museo de la ruta
function eliminarMuseoRuta(index) {
    const eventos = recuperarVisitas();
    eventos.splice(index, 1); // Eliminar el evento correspondiente al índice
    localStorage.setItem('visitas', JSON.stringify(eventos)); // Actualizar el localStorage
    mostrarRuta(); // Mostrar la ruta actualizada
}

// Función para recuperar las visitas guardadas en el localStorage
function recuperarVisitas() {
    const visitas = localStorage.getItem('visitas');
    return visitas ? JSON.parse(visitas) : [];
}

// Función para guardar la ruta en el calendario
function guardarRuta(){
    
}



// Cargar la ruta al cargar la página
window.addEventListener('DOMContentLoaded', mostrarRuta);