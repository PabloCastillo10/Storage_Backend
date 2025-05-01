import { response, request } from "express";
import Proveedor from "../proveedores/proveedor.model.js";
import Producto from "../productos/productos.model.js";

export const saveProveedor = async (req, res) => {
    try {
        const data = req.body;
        const nombresProductos = Array.isArray(data.products) ? data.products : [data.products];

        const productos = await Producto.find({ name: { $in: nombresProductos } });

        const newProveedor = new Proveedor({
            ...data,
            products: productos.map(p => p._id),
        });

        await newProveedor.save();

        const proveedorGuardado = await Proveedor.findById(newProveedor._id)
            .populate("products", "name");

        res.status(200).json({
            success: true,
            msg: "Proveedor saved!",
            proveedor: proveedorGuardado,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error saving Proveedor!",
            error: error.message
        });
    }
};

export const getProveedores = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const [total, proveedores] = await Promise.all([
            Proveedor.countDocuments(query),
            Proveedor.find(query)
                .populate('products', 'name')
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            proveedores
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener proveedores!",
            error: error.message
        });
    }
};

export const getProveedoresById = async (req, res) => {
    const { id } = req.params;

    try {
        const proveedor = await Proveedor.findById(id)
            .populate("products", "name");

        if (!proveedor) {
            return res.status(404).json({
                msg: `Proveedor with id ${id} does not exist!`,
            });
        }

        res.status(200).json({
            msg: "Proveedor found!",
            proveedor,
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error getting Proveedor!",
            error: error.message
        });
    }
};

export const updateProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const { products, ...data } = req.body; // Extraemos los productos (nombres)
        const proveedor = await Proveedor.findById(id);

        if (!proveedor) {
            return res.status(404).json({
                msg: `Proveedor with id ${id} does not exist!`,
            });
        }

        if (products) {
            // Buscar los productos por nombre y obtener sus ObjectIds
            const productosActualizados = await Producto.find({ name: { $in: products } });

            // Si se encuentran los productos, asignar sus ObjectIds
            data.products = productosActualizados.map(producto => producto._id);
        }

        // Actualizamos el proveedor con los datos nuevos
        const proveedorActualizado = await Proveedor.findByIdAndUpdate(id, data, { new: true })
            .populate('products', 'name'); // Esto rellena los productos con su nombre

        res.status(200).json({
            msg: "Proveedor updated!",
            proveedor: proveedorActualizado,
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error updating Proveedor!",
            error: error.message
        });
    }
};

export const deleteProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const proveedor = await Proveedor.findById(id);

        if (!proveedor) {
            return res.status(404).json({
                msg: `Proveedor with id ${id} does not exist!`,
            });
        }

        proveedor.status = false;
        await proveedor.save();

        res.status(200).json({
            msg: "Proveedor deleted!",
            proveedor,
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error deleting Proveedor!",
            error: error.message
        });
    }
};