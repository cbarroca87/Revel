const Role = require('../models/role');
const Usuario = require('../models/usuario')
const Categoria = require('../models/categoria')
const Producto = require('../models/producto')


const isValidRole = async (role = '') => {
    const existeRol = await Role.findOne({ role });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no forma parte del sistema`)
    }
}

const isValidEmail = async (correo = '') => {
    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya está registrado en el sistema`)
    }
}

const existsId = async (id = '') => {
    // Verificar si el correo existe
    console.log("Id de usuario - db-validator: ", id);
    const exists = await Usuario.findById({ _id: id });
    console.log('Existe: ', exists);
    if (!exists) {
        throw new Error(`El id ${id} no existe`)
    }
}

const existsCategoriaId = async (id = '') => {
    const exists = await Categoria.findById({ _id: id });
    if (!exists) {
        throw new Error(`El id ${id} no existe para ninguna categoría`)
    }
}

const existsProductoId = async (id = '') => {
    const exists = await Producto.findById({ _id: id });
    if (!exists) {
        throw new Error(`El id ${id} no existe para ningún producto`)
    }
}

const coleccionesPermitidas = (coleccion = '', permitidas = []) => {    
    const permitida = permitidas.includes(coleccion);
    if (!permitida) {
        console.log('Entra en error');
        throw new Error(`La colección ${coleccion} no está permitida: ${permitidas}`);
    }    
    return true;
}

module.exports = {
    isValidRole,
    isValidEmail,
    existsId,
    existsCategoriaId,
    existsProductoId,
    coleccionesPermitidas
}