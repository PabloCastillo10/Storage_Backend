import { request, response } from "express";
import Producto  from "../productos/productos.model.js";
import Categoria from "../categoria/categoria.model.js";


export const saveProduct = async (req, res) => {
    try {
        const data = req.body;
        const categoria = await Categoria.findOne({name: data.categoria});
        const fechaEntrada = data.fechaEntrada;

        if (!categoria) {
            return res.status(404).json({
                success: false,
                msg: 'Categ oría no encontrada',
            })
        }

        const newProduct = new Producto({
            ...data,
            categoria: categoria._id,
            fechaEntrada : fechaEntrada || Date.now(),
        })
        await newProduct.save();

        const productoGuardado = await Producto.findById(newProduct._id).populate("categoria", "name");

        res.status(200).json({
            success: true,
            msg: "Producto guardado",
            producto: productoGuardado,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al guardar el producto",
            error: error.message
        })
}}

export const getProducts = async (req, res) => {
    try {
        const productos = await Producto.find().populate("categoria","name");
        res.status(200).json({
            msg: "Productos obtenidos",
            productos,
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error al obtener los productos",
            error: error.message
        });
    }
}

export const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const producto = await Producto.findById(id).populate("categoria", "name");

        if (!producto) {
            return res.status(404).json({
                msg: `El producto con id ${id} no existe`,
            });
        }

        res.status(200).json({
            msg: "Producto encontrado",
            producto,
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error al obtener el producto",
            error: error.message
        });
    }
}


export const searchFlexible = async (req, res) => {
    const { termino } = req.params;

    try {
        let productos = [];
        productos = await Producto.find({
            name: { $regex: termino, $options: "i" },
            status: true,
        }).populate("categoria", "name");

        if (productos.length > 0) {
            return res.status(200).json({
                msg: "Productos encontrados por nombre",
                productos,
            });
        }
        
        const fecha = new Date(termino);

        if (!isNaN(fecha.getTime())) {
            productos = await Producto.find({
                fechaEntrada: { $gte: fecha },
                status: true,
            }).populate("categoria", "name");

            return res.status(200).json({
                msg: "Productos encontrados por fecha de entrada",
                productos,
            });
        }
        res.status(404).json({
            msg: "No se encontraron productos que coincidan",
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error al buscar productos",
            error: error.message
        });
    }
}

export const updateProduct = async (req, res) => {
      try {
        const {id} = req.params;
        const {categoria, ...data} = req.body;
        const producto = await Producto.findById(id);

        if (!producto) {
            return res.status(404).json({
                msg: `El producto con id ${id} no existe`,
            });
        }

        if (categoria) {
            const categoriaActual = await Categoria.findOne({name: categoria});
            if (!categoriaActual) {
                return res.status(404).json({
                    msg: `La categoría ${categoria} no existe`,
                });
            }
            data.categoria = categoriaActual._id;
        }

        const productoActualizado = await Producto.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            msg: "Producto actualizado",
            producto: productoActualizado,
        });
      } catch (error) {
        res.status(500).json({
            msg: "Error al actualizar el producto",
            error: error.message
        });
}}

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findById(id);

        if (!producto) {
            return res.status(404).json({
                msg: `El producto con id ${id} no existe`,
            });
        }

        producto.status = false;
        await producto.save();

        res.status(200).json({
            msg: "Producto no encontrado",
            producto,
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error al eliminar el producto",
            error: error.message
        });
    }
}