var socket = io();

var params = new URLSearchParams(window.location.search);
// validar que en la URL venga el nombre y se agrego la sala
if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}
// asigno el nombre y la sala que viene en el parametro de la URL
var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');

    // indicar a mi back end quien soy yo, y le envio el nombre
    socket.emit('entrarChat', usuario, function(resp) { // NOMBRE esta en la variable usuario

        // console.log('Usuarios conectados', resp); // Se reemplaza por RenderizarUsurios()
        renderizarUsuarios(resp);

    });
});

// escuchar
socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});
// reconectar
socket.on('reconnect', function() {
    console.log('reconectado!');
});


// Enviar o emitir un mensaje a todo el grupo
//socket.emit('crearMensaje', {
//    nombre: 'Horacio',
//    mensaje: 'Hola Mundo'
//}, function(resp) {
//    console.log('respuesta server: ', resp);
//});

// Escuchar información, cuando recibimos un nuevo mensaje, para desconectar y borrar el usuario del arreglo del chat
socket.on('crearMensaje', function(mensaje) {

    //console.log('Servidor:', mensaje); se reemplaza por renderizarMensaje
    renderizarMensajes(mensaje, false); // false pq es de lado del servidor
    scrollBottom(); // scroll
});

// Escuchar cambios de usuarios
// Cuando un usuario entra o sale del chat (listaPersona)
socket.on('listaPersona', function(personas) {
    // console.log('Usuario conectado o desconectado al chat es: ', personas); (Se reemplaza por RenderizarUsurios()
    renderizarUsuarios(personas);

});


// Mensajes privados, esta es la accion de escuchar del cliente un mensaje PRIVADO
socket.on('mensajePrivado', function(mensaje) {
    console.log('Mensaje privado: ', mensaje);
});