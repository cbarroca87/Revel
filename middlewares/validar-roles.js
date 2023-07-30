const { response, request } = require('express')
const Producto = require('../models/producto');
const usuario = require('../models/usuario');

const validarRoles = (req = request, resp = response, next) => {
    if (!req.usuario) {
        return resp.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        })
    }

    const { rol, nombre } = req.usuario;

    if (rol !== 'ADMIN_ROLE') {
        return resp.status(401).json({
            msg: `El usuario ${nombre} no tiene privilegios suficientes para realizar esta acción`
        })
    }
    next();
}

const tieneRole = (...roles) => {
    return (req = request, resp = response, next) => {

        if (!req.usuario) {
            return resp.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            })
        }
        console.log('USUARIO:    ', req.usuario);
        const { rol, nombre } = req.usuario;
        if (!roles.includes(rol)) {
            return resp.status(401).json({
                msg: `El usuario ${nombre} no tiene privilegios suficientes para realizar esta acción`
            })
        }
        next();
    }

};

module.exports = {
    validarRoles,
    tieneRole
}