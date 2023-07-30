const { Schema, model } = require('mongoose');


const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio']
    },
    rol: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE'],
        default: 'USER_ROLE'
    }

})

UsuarioSchema.methods.toJSON = function () {
    const { __v, password, _id: uid, ...usuario } = this.toObject();
    const newUser = { uid, ...usuario };
    return newUser;
}

module.exports = model('Usuario', UsuarioSchema);
