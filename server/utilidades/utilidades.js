// Cada vez que envio un mensaje a parte envio la fecha
const crearMensaje = (nombre, mensaje) => {

        return {
            nombre,
            mensaje,
            fecha: new Date().getTime()

        }
    }
    // para ocupar esta función con el proyecto
module.exports = {
    crearMensaje

}