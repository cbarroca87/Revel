const { Router, request, response } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { validarCampos, validarJWT, tieneRole } = require('../middlewares');
const { existsCategoriaId } = require('../helpers/db-validators')

const router = Router();

// Obtiene todas las categorías
router.get('/', [
    //middlewares
], obtenerCategorias);

// Obtiene una categoría a partir de su id
router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existsCategoriaId),
    validarCampos],
    obtenerCategoria
);

// Crear categoría
router.post('/', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
], crearCategoria);

// Modifica una categoría
router.put('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existsCategoriaId),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCategoria);

// Borra una categoría
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),    
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existsCategoriaId),
    validarCampos
], borrarCategoria);

module.exports = router;