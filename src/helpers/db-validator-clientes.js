import Cliente from "../clientes/cliente.model.js";
import Producto from "../productos/productos.model.js";

export const existeClienteById = async (id = '') => {
    const existeCliente = await Cliente.findById(id);

    if (!existeCliente) {
        throw new Error(`Cliente ${id} dont exists in the database!`);
    }
};

export const validateStatus = async (id = '') => {
    const cliente = await Cliente.findById(id);

    if (cliente && !cliente.status) {
        throw new Error(`Cliente ${id} está inactivo!`);
    }
};

export const errorName = async (name = "", { req }) => {
    const existeCliente = await Cliente.findOne({ name });

    if (existeCliente && existeCliente._id.toString() !== req.params.id) {
        throw new Error(`El cliente ${name} ya existe en la base de datos!`);
    }
};

export const productForName = async (products = "") => {
    const existe = await Producto.findOne({ name: products });
    if (!existe) {
        throw new Error(`El producto ${products} no se encontró!`);
    }
};