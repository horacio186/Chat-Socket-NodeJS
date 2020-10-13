// clase usuarios que se encarga de todos los usuario conectados
class Usuarios {

    constructor() {
        this.personas = []; // iniciliazar un arreglo vacio
    }

    // metodo agregarPersona que recibe un id  y el nombre y la Sala
    agregarPersona(id, nombre, sala) {
        // creo la persona
        let persona = {
            id,
            nombre,
            sala
        };
        // agrego una persona al arreglo
        this.personas.push(persona);
        // retorno todas las personas del chat
        return this.personas;
    }

    // necesito saber la información de la misma persona(1) con el ID y lo retorno
    getPersona(id) {
        // filter regresa un nuevo arreglo, y necesitamos la primera posición[0]
        let persona = this.personas.filter(persona => persona.id === id)[0];
        // Si no encuentra la persona retorna undefined o null
        return persona;
    }

    // metodo para REGRESAR todas las personas
    getPersonas() {

        return this.personas;
    }

    // Personas por SALA
    getPersonasPorSala(sala) {
        // filter regresa un nuevo arreglo, que la persona sea de la misma sala
        let personaEnSala = this.personas.filter(persona => persona.sala === sala);
        // Si no encuentra la personaEnSala retorna undefined o null
        return personaEnSala;
    }

    // Borrar una persona que se desconecto del chat
    borrarPersona(id) {
        // obtiene el id de la persona antes de sacarla del arreglo, para indicar
        // que id se elimino
        let personaBorrada = this.getPersona(id);

        // devuelve un arreglo y lo almacena en el mismo arreglo y lo reemplaza
        // si tiene distinto id (solo deja las personas activas del chat)
        this.personas = this.personas.filter(persona => persona.id != id);
        // cuando se borre una persona para tener una referencia
        return personaBorrada;
    }

}

module.exports = {
    Usuarios
}