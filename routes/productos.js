const { Router, request, response } = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { validarCampos, validarJWT, tieneRole } = require('../middlewares');
const { existsCategoriaId, existsProductoId } = require('../helpers/db-validators')

const router = Router();

// Obtiene todas las categorías
router.get('/', [
    validarJWT
], obtenerProductos);

// Obtiene una categoría a partir de su id
router.get('/:id', [
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existsProductoId),
    validarCampos],
    obtenerProducto
);

// Crear categoría
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'la categoria es obligatoria').not().isEmpty(),
    check('categoria', 'No es una id de categoría válida').isMongoId(),
    check('categoria').custom(existsCategoriaId),
    validarCampos,
], crearProducto);

// Modifica una categoría
router.put('/:id', [
    validarJWT,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existsProductoId),        
    // check('categoria', 'No es una id de categoría válida').isMongoId(),
    check('categoria').custom(existsCategoriaId),    
    validarCampos
], actualizarProducto);

// Borra una categoría
router.delete('/:id', [
    validarJWT,
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existsProductoId),
    validarCampos
], borrarProducto);


module.exports = router;