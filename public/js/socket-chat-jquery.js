var params = new URLSearchParams(window.location.search);

// Referenciar nombre y la sala se obtiene desde la URL
var nombre = params.get('nombre');
var sala = params.get('sala');

// Referencias de JQUERY
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');

// Funciones para Renderizar Usuarios
function renderizarUsuarios(personas) { // [{},{},{}]

    console.log(personas);

    var html = '';
    // define el html que voy a usar, se agrega la sala
    html += '<li>';
    html += '<a href="javascript:void(0)" class="active"> Chat de <span> ' + params.get('sala') + '</span></a>'; // le agrego el parametro de la Sala
    html += '</li>';

    // Se indica todas las personas conectadas
    for (var i = 0; i < personas.length; i++) {
        // se agrega el ID y el nombre
        html += '<li>';
        html += '<a data-id=" ' + personas[i].id + '"  href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + personas[i].nombre + ' <small class="text-success">online</small></span></a>';
        html += '</li>';

    }
    // el divUsuarios es igual a todo el html que construimos
    divUsuarios.html(html);
}

// Renderizar los mensajes del chat
function renderizarMensajes(mensaje, yo) {

    var html = '';

    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();

    // cambiar el color cuando es un administrador
    var adminClass = 'info'; // representa al codigo html div class="box bg-light-info
    if (mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }

    if (yo) {
        // Mensaje cuando soy yo
        html += '<li class="reverse">'
        html += '<div class="chat-content">'
        html += '<h5>' + mensaje.nombre + '</h5>'
        html += '<div class="box bg-light-inverse">' + mensaje.mensaje + '</div>'
        html += '</div>'
        html += '<div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>'
        html += '<div class="chat-time">' + hora + '</div>'
        html += '</li>'
    } else {
        // Mensaje de los demas
        html += '<li class="animated fadeIn">'

        // quitar la imagen de la persona cuando no es administrador
        if (mensaje.nombre !== 'Administrador') {
            html += '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>'
        }
        html += '<div class="chat-content">'
        html += '<h5>' + mensaje.nombre + '</h5>'
        html += '<div class="box bg-light-' + adminClass + '">' + mensaje.mensaje + '</div>'
        html += '</div>'
        html += '<div class="chat-time">' + hora + '</div>'
        html += '</li>'
    }
    // agregar mensajes y todo el html como un arreglo
    divChatbox.append(html); // se ocupa en emit.crearMensaje() en esta misma clase
}

// funcion de scroll para ver el ultimo mensaje escrito en el chat
function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

// Literners (escuchar), cuando se hace un click en <a href (empieza con a), click en los nombres o sala
divUsuarios.on('click', 'a', function() {
    //Obtengo el valor de data-id(id puede ser cualquier palabra)
    var id = $(this).data('id');
    if (id) { // Si existe el ID devuelve el id así no me devuelve undefined al hacer click en la sala
        console.log(id);
    }
});

// cuando se haga el submit del formulario o desde boton para enviar el mensaje
formEnviar.on('submit', function(e) {

    e.preventDefault();
    if (txtMensaje.val().trim().length === 0) {
        return;
    }

    // Enviar o emitir un mensaje a todo el grupo de la Sala
    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val()
    }, function(mensaje) {
        //console.log('respuesta server: ', resp);
        txtMensaje.val('').focus(); // focus para que el curso se quede ahi al apretar el botón
        renderizarMensajes(mensaje, true); // la funcion se encuntra en la misma clase, TRUE uno mismo envia el mensaje
        scrollBottom(); // scroll
    });

});