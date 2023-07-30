const { request, response } = require('express');
const { Producto, Usuario } = require('../models')

const crearProducto = async (req = request, resp = response) => {

    const nombre = req.body.nombre.toUpperCase();
    const descripcion = req.body.descripcion;
    const categoria = req.body.categoria;

    const productoDB = await Producto.findOne({ nombre });
    if (productoDB) {
        return resp.status(400).json({
            msg: `El producto ${productoDB.nombre} ya existe`
        })
    }
    // console.log(productoDB);

    const data = {
        ...req.body,
        nombre,
        usuario: req.usuario._id        
    }
    const producto = new Producto(data);
    await producto.save();
    resp.status(201).json(producto);

}

// obtenerProductos - paginado - total - populate
const obtenerProductos = async (req = request, resp = response) => {
    const { limite = 5, desde = 0 } = req.query;

    let [total, productos] = await Promise.all([
        Producto.countDocuments(),
        Producto.find()
            .limit(Number(limite))
            .skip(Number(desde))            
            .populate('usuario', 'rol')
            .populate('categoria', 'nombre')
    ])
    if (total == 0) {
        resp.status(500).json({
            msg: 'No existen productos activados'
        })
    } else {
        if (req.usuario.rol != 'ADMIN_ROLE'){      
            productos = productos.filter(prod => prod.usuario.id === req.uid);
            total = productos.length;
        }
        resp.json({
            total,
            productos
        })
    }
}

// obtenerProducto - populate -> Regresa el objeto de la categoría
const obtenerProducto = async (req = request, resp = response) => {
    const id = req.params.id;
    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
    resp.json({
        producto
    })

}

// Actualizar producto - Recibe el nombre y ver que no exista
const actualizarProducto = async (req = request, resp = response) => {
    const { usuario, ...data } = req.body;
    const { id } = req.params;
    data.nombre = data.nombre.toUpperCase();    
    data.usuario = req.usuario._id;

    const prod = await Producto.findById(id).populate('usuario', 'rol')
    let producto = null;

    if(req.usuario.rol !== 'ADMIN_ROLE' && prod.usuario.id === req.uid){
        producto = await Producto.findByIdAndUpdate(id, data, {new: true});

    } else if (req.usuario.rol === 'ADMIN_ROLE'){
        producto = await Producto.findByIdAndUpdate(id, data, {new: true});
    } else {
        return resp.status(400).json({
            msg: `El producto ${prod.nombre} no se ha podido modificar porque este usuario no tiene privilegios sobre este recurso`
        })
    }
    
    resp.status(201).json({
        msg: `El producto se ha actualizado correctamente`,
        producto
    })
}

const borrarProducto = async (req = request, resp = response) => {
    const { id } = req.params;

    const prod = await Producto.findById(id).populate('usuario', 'rol')
    let producto = null;

    if(req.usuario.rol !== 'ADMIN_ROLE' && prod.usuario.id === req.uid){
        producto = await Producto.findByIdAndDelete(id);

    } else if (req.usuario.rol === 'ADMIN_ROLE'){
        producto = await Producto.findByIdAndDelete(id);
    } else {
        return resp.status(400).json({
            msg: `El producto ${prod.nombre} no se ha podido eliminar porque este usuario no tiene privilegios sobre este recurso`
        })
    }

    resp.status(201).json({
        msg: `El producto se ha eliminado correctamente`,
        producto
    })
}
const borrarTodosProductos = async (req, res = response) => {
    await Producto.deleteMany();
}



module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto,
    borrarTodosProductos
}