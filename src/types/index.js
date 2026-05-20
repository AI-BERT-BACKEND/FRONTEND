/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} nombre
 * @property {string} email
 * @property {string} username
 * @property {string} carrera
 * @property {string} semestre
 * @property {string} foto
 */

/**
 * @typedef {Object} Subject
 * @property {string} id
 * @property {string} nombre
 * @property {string} profesor
 * @property {number} creditos
 * @property {string} semestre
 * @property {string} color
 * @property {Object} horario
 * @property {boolean} activo
 */

/**
 * @typedef {Object} Event
 * @property {string} id
 * @property {string} titulo
 * @property {string} fecha
 * @property {string} hora
 * @property {string} materia
 * @property {string} estado
 * @property {string} color
 */

/**
 * @typedef {Object} Goal
 * @property {string} id
 * @property {string} titulo
 * @property {string} descripcion
 * @property {string} categoria
 * @property {string} fechaLimite
 * @property {number} progreso
 * @property {string} estado
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} titulo
 * @property {string} descripcion
 * @property {string} materiaId
 * @property {string} fechaEntrega
 * @property {string} prioridad
 * @property {boolean} completada
 */

/**
 * @typedef {Object} Notification
 * @property {string} id
 * @property {string} titulo
 * @property {string} mensaje
 * @property {string} tipo
 * @property {string} fecha
 * @property {boolean} leida
 */
