import Proveedor from "../proveedores/proveedor.model.js";
import Producto from "../productos/productos.model.js";

export const saveProveedor = async (req, res) => {
    try {
        const data = req.body;
        const producto = await Producto.findOne({ name: data.producto });

        if (!producto) {
            return res.status(404).json({
                success: false,
                msg: 'Product not found!',
            });
        }

        const newProveedor = new Proveedor({
            ...data,
            products: [producto._id],
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

export const getProveedores = async (req, res) => {
    try {
        const proveedores = await Proveedor.find()
            .populate("products", "name");
        
        res.status(200).json({
            msg: "Found Proveedores!",
            proveedores,
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error finding Proveedores!",
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
        const { producto, ...data } = req.body;
        const proveedor = await Proveedor.findById(id);

        if (!proveedor) {
            return res.status(404).json({
                msg: `Proveedor with id ${id} does not exist!`,
            });
        }

        if (producto) {
            const productoActual = await Producto.findOne({ name: producto });
            if (!productoActual) {
                return res.status(404).json({
                    msg: `Product ${producto} does not exist!`,
                });
            }
            data.products = [productoActual._id];
        }

        const proveedorActualizado = await Proveedor.findByIdAndUpdate(id, data, { new: true });

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