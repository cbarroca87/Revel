const { response, query } = require('express');
const Usuario = require('../models/usuario')
const bcryptjs = require('bcryptjs')

const usuariosGet = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;

    /*const usuarios = await Usuario.find(query)
        .limit(Number(limite))
        .skip(Number(desde));

    const total = await Usuario.countDocuments(query);*/


    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(),
        Usuario.find()
            .limit(Number(limite))
            .skip(Number(desde))
    ])


    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req, res = response) => {
    // console.log(req.body);
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);


    await usuario.save();
    res.status(201).json({
        usuario
    });
}

const usuariosPut = async (req, res = response) => {
    const id = req.params.id;
    const { _id, password, correo, ...resto } = req.body;

    //TODO validar contra base de datos
    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }
    const usuarioDB = await Usuario.findByIdAndUpdate(id, resto, {new: true});

    res.json({
        usuarioDB
    });
}

const usuariosDelete = async (req, res = response) => {
    const { id } = req.params;
    const uid = req.uid;
    const usuario = await Usuario.findByIdAndDelete(id);
    const usuarioAutenticado = req.usuario;
    res.json({
        usuario,
        usuarioAutenticado
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: "patch API - controlador"
    });
}

const borrarTodosUsuarios = async (req, res = response) => {
    await Usuario.deleteMany();
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosPatch,
    borrarTodosUsuarios
}