const { io } = require('../server');
// importar la clase usuarios
const { Usuarios } = require('../classes/usuarios.js');

// importar la función para enviar mensajes(se hizo de esta manera pq se ocupa mucho)
const { crearMensaje } = require('../utilidades/utilidades.js');

// instanciar la clase Usuarios
const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {

        // console.log(data);
        // validar por si no viene el nombre y la Sala
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre / sala son necesario'
            });
        }
        // une el nombre de un usuario a una sala
        client.join(data.sala);

        // agregar la persona(usuario.js) con el ID que viene de client y el nombre de data y la Sala
        let personas = usuarios.agregarPersona(client.id, data.nombre, data.sala);

        // un evento para que todas personas(getPersonasPorSala) por sala vean cuando uno se conecta o desconecta del chat de solo ese CANAL
        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));

        // emitir un mensaje a la sala indicando la persona que se unió el chat(aca se inserta e codigo de la fn de "utilidades.js")
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${data.nombre} se unió al chat`)); // msg abandono el chat

        callback(usuarios.getPersonasPorSala(data.sala)); // retorna todas las personas de esa SALA conectadas al chat (arreglo personas)
    });

    // Desconectar y borrar el usuario del arreglo del chat 
    client.on('disconnect', () => {

        let personaBorrada = usuarios.borrarPersona(client.id);
        // emitir un mensaje a todos indicando la persona qeu abandono el chat(aca se inserta e codigo de la fn de "utilidades.js")
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió del chat`)); // msg abandono el chat
        // un evento para que todas personas por sala(getPersonasPorSala) vean cuando uno se conecta o desconecta del chat 
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));

    });

    // servidor escuche cuando un usuario llame a ese metodo de crearMensaje
    client.on('crearMensaje', (data, callback) => {

        let persona = usuarios.getPersona(client.id); // persona=tengo el nombre y toda la información de esa persona

        let mensaje = crearMensaje(persona.nombre, data.mensaje); // llama a la función (reemplaza a data.nombre por persona.nombre)
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje); // manda el mensaje a todas las pantallas por sala
        // devuelve el mensaje
        callback(mensaje);
    });

    // Esto es lo que va a hacer el servidor cuando alguien manda un mensaje privado 
    // a otro usuario (mensaje privado)
    client.on('mensajePrivado', data => {

        // para saber que persona envia el mensaje
        let persona = usuarios.getPersonas(client.id);
        // to(data.para)= especifica ah que persona envia el mensaje privado
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje)); // en estos puntos tenemos que validar que venga la data

    });

});