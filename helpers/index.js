const dbValidators = require('./db-validators');
const generarJWT = require('./generarJWT');
const subirArchivo = require('./subir-archivo');

module.exports = ({
    ...dbValidators,
    ...generarJWT,
    ...subirArchivo
})