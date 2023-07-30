const { Router } = require('express');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');
const { check } = require('express-validator');
const { isValidRole, isValidEmail, existsId } = require('../helpers/db-validators');
// const { validarCampos } = require('../middlewares/validar-campos')
// const { validarRoles, tieneRole } = require('../middlewares/validar-roles')
// const { validarJWT } = require('../middlewares/validar-jwt');

const { validarCampos, validarRoles, tieneRole, validarJWT } = require('../middlewares');

const router = Router();
const middlewaresPost =  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(isValidEmail),
    check('password', 'El password debe contener más de 6 dígitos').isLength({ min: 6 }),
    check('rol').custom(isValidRole),
    validarCampos
]

router.get('/', usuariosGet);
router.post('/', middlewaresPost, usuariosPost);
router.put('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existsId),
    check('rol').custom(isValidRole),
    validarCampos

], usuariosPut);
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existsId),
    validarCampos,
], usuariosDelete);
router.patch('/', usuariosPatch);

module.exports = router;