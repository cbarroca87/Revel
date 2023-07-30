const { response } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generarJWT');
const { usuariosPost } = require('../controllers/usuarios')

const login = async (req, res = response) => {
    const { correo, password } = req.body;
    try {
        // Verificar si el correo existe
        const usuario = await Usuario.findOne({ correo });
        // console.log(`Usuario encontrado ${usuario}`)
        if (!usuario) {
            res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        // Verificar la contraseña
       //  console.log(password)
        // console.log(usuario.password)
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            res.status(400).json({
                msg: 'Usuario / Password no son correctos - contraseña'
            });
        }
        // Generar el JWT
        const token = await generarJWT(usuario.id);
        // console.log(usuario)

        res.json({
            usuario,
            token
        })

    } catch (e) {
        // console.log(e)
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

}


module.exports = {
    login
};