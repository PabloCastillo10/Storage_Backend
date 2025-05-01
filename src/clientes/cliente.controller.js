import { response, request } from "express";
import Cliente from "../clientes/cliente.model.js";
import Producto from "../productos/productos.model.js";

export const saveCliente = async (req = request, res = response) => {
    try {
        const data = req.body;

        const productIds = [];

        if (data.products && data.products.length > 0) {
            for (const productName of data.products) {
                const producto = await Producto.findOne({ name: productName });

                if (!producto) {
                    return res.status(400).json({
                        success: false,
                        message: `Producto con nombre "${productName}" no encontrado!`
                    });
                }

                if (producto.stock <= 0) {
                    return res.status(400).json({
                        success: false,
                        message: `Producto "${producto.name}" sin stock disponible!`
                    });
                }

                producto.stock -= 1;
                await producto.save();

                productIds.push(producto._id);
            }
        }

        const cliente = new Cliente({
            ...data,
            products: productIds
        });

        await cliente.save();

        res.status(201).json({
            success: true,
            message: "Cliente creado exitosamente!",
            cliente
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al guardar cliente!",
            error: error.message
        });
    }
};

export const getClientes = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const [total, clientes] = await Promise.all([
            Cliente.countDocuments(query),
            Cliente.find(query)
                .populate('products', 'name price')
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            clientes
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener clientes!",
            error: error.message
        });
    }
};

export const getClienteById = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const cliente = await Cliente.findById(id)
            .populate('products', 'name price');

        if (!cliente || !cliente.status) {
            return res.status(404).json({
                success: false,
                message: "Cliente no encontrado!"
            });
        }

        res.status(200).json({
            success: true,
            cliente
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener cliente!",
            error: error.message
        });
    }
};

export const updateCliente = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const productIds = [];

        if (data.products && data.products.length > 0) {
            const cliente = await Cliente.findById(id);
            if (cliente && cliente.products.length > 0) {
                for (const oldProductId of cliente.products) {
                    const producto = await Producto.findById(oldProductId);
                    if (producto) {
                        producto.stock += 1;
                        await producto.save();
                    }
                }
            }

            for (const productName of data.products) {
                const producto = await Producto.findOne({ name: productName });

                if (!producto) {
                    return res.status(400).json({
                        success: false,
                        message: `Producto con nombre "${productName}" no encontrado!`
                    });
                }

                if (producto.stock <= 0) {
                    return res.status(400).json({
                        success: false,
                        message: `Producto "${producto.name}" sin stock disponible!`
                    });
                }

                producto.stock -= 1;
                await producto.save();

                productIds.push(producto._id);
            }
        }

        const cliente = await Cliente.findByIdAndUpdate(id, {
            ...data,
            products: productIds.length > 0 ? productIds : data.products
        }, { new: true })
            .populate('products', 'name price');

        if (!cliente) {
            return res.status(404).json({
                success: false,
                message: "Cliente no encontrado!"
            });
        }

        res.status(200).json({
            success: true,
            message: "Cliente actualizado correctamente!",
            cliente
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar cliente!",
            error: error.message
        });
    }
};

export const deleteCliente = async (req = request, res = response) => {
    try {
        const { id } = req.params;

        const cliente = await Cliente.findById(id);

        if (!cliente || !cliente.status) {
            return res.status(404).json({
                success: false,
                message: `Cliente con id ${id} no existe o ya está eliminado!`
            });
        }

        cliente.status = false;
        await cliente.save();

        res.status(200).json({
            success: true,
            message: "Cliente eliminado correctamente!",
            cliente
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar cliente!",
            error: error.message
        });
    }
};