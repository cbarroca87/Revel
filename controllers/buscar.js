const { request, response } = require("express");
const { isValidObjectId, ObjectId } = require("mongoose");
const { Usuario, Categoria, Producto } = require("../models")


const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async (termino = '', resp = response) => {
    const esMongoId = isValidObjectId(termino);
    if (esMongoId) {
        const usuario = await Usuario.findById(termino);
        return resp.json({
            results: usuario ? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }]
    })
    resp.json({
        results: usuarios
    });
}

const buscarCategorias = async (termino, resp = response) => {
    const esMongoId = isValidObjectId(termino);
    if (esMongoId) {
        const categoria = await Categoria.findById(termino);
        return resp.json({
            results: categoria ? [categoria] : []
        })
    }    
    const regex = new RegExp(termino, 'i');
    // console.log(regex)
    const categorias = await Categoria.find({
        $or: [
            {nombre: regex}
        ]

    })   
    resp.json({
        results: categorias
    });
}

const buscarProductos = async (termino, resp = response) => {
    if (isValidObjectId(termino)) {
        const producto = await Producto.findById(termino);
        resp.json({
            results: producto ? [producto] : []
        })
    }
    const regex = new RegExp(termino, 'i');

    const productos = await Producto.find({
        $or: [
            {nombre: regex},
            {descripcion: regex}
        ]

    })
    resp.json({
        results: productos
    });
}

const buscar = (req = request, resp = response) => {
    const { coleccion, termino } = req.params;
    if (!coleccionesPermitidas.includes(coleccion)) {
        return resp.status(400).json({
            msg: `La colección ${coleccion} no está permitida. Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, resp);
            break;
        case 'categorias':
            buscarCategorias(termino, resp);
            break;
        case 'productos':
            buscarProductos(termino, resp);
            break;
        default:
            resp.status(500).json({
                msg: 'Se me olvidó hacer esta búsqueda'
            })
            break;

    }
}

module.exports = {
    buscar
}