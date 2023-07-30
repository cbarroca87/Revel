const { request, response } = require('express');
const { Categoria } = require('../models')

const crearCategoria = async (req = request, resp = response) => {

    const nombre = req.body.nombre.toUpperCase();
    const categoriaDB = await Categoria.findOne({ nombre });
    if (categoriaDB) {
        return resp.status(400).json({
            msg: `La categoría ${categoriaDB.nombre} ya existe`
        })
    }
    // console.log(categoriaDB);

    const data = {
        nombre,
        usuario: req.usuario._id
    }
    const categoria = new Categoria(data);
    await categoria.save();
    resp.status(201).json(categoria);

}

// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req = request, resp = response) => {

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(),
        Categoria.find()
            .populate('usuario', 'nombre')
    ])
    if (total == 0) {
        resp.status(500).json({
            msg: 'No existen categorías activadas'
        })
    }
    resp.json({
        total,
        categorias
    })

}

// obtenerCategoria - populate -> Regresa el objeto de la categoría
const obtenerCategoria = async (req = request, resp = response) => {
    const id = req.params.id;
    const categoria = await Categoria.findById(id)
        .populate('usuario', 'nombre');
    resp.json({
        categoria
    })

}

// Actualizar categoría - Recibe el nombre y ver que no exista
const actualizarCategoria = async (req = request, resp = response) => {
    const { usuario, ...data } = req.body;
    const { id } = req.params;
    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });
    resp.status(201).json({
        msg: `El nombre de la categoría se ha actualizado correctamente`,
        categoria
    })
}

const borrarCategoria = async (req = request, resp = response) => {
    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, { new: true });
    resp.status(201).json({
        msg: `La categoría se ha desactivado correctamente`,
        categoria
    })
}

const borrarTodasCategorias = async (req = request, res = response) => {
    await Categoria.deleteMany();
}


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria,
    borrarTodasCategorias
}