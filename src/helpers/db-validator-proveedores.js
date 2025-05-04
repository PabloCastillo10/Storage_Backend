import Proveedor from "../proveedores/proveedor.model.js";
import Producto from "../productos/productos.model.js";

export const existeProveedorById = async (id = '') => {
    const existeProveedor = await Proveedor.findById(id);

    if (!existeProveedor) {
        throw new Error(`Proveedor ${id} no existe en la base de datos!`);
    }
};

export const validateStatus = async (id = '') => {
    const proveedor = await Proveedor.findById(id);

    if (proveedor && !proveedor.status) {
        throw new Error(`Proveedor ${id} está inactivo!`);
    }
};

export const errorName = async (name = "", { req }) => {
    const existeProveedor = await Proveedor.findOne({ name });

    if (existeProveedor && existeProveedor._id.toString() !== req.params.id) {
        throw new Error(`El proveedor ${name} ya existe en la base de datos!`);
    }
};

export const productForName = async (productos = "") => {
    if (!productos) {
        return;
    }

    const existe = await Producto.findOne({ name: productos });

    if (!existe) {
        throw new Error(`El producto '${productos}' no se encontró.`);
    }

    return existe;
};