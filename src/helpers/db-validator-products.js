import Producto from "../productos/productos.model.js";

export const existenteProductById = async (id = '') => {
    
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }
    
    const existeProduct = await Producto.findById(id);
    
    if (!existeProduct) {
        throw new Error(`El ID ${ id } no existe en la base de datos`);
    }
}

export const statusProduct = async (producto) => {
    
    if (producto.status === false) {
        throw new Error('Producto desactivado o ya esta desactivado');
    }
}

export const verificarProductoExistente = async (name, producto) => {
    if (name && name !== producto.name) {
        const existingProduct = await Producto.findOne({ name });

        if (existingProduct && existingProduct.id !== producto.id) {
            throw new Error(`El producto ${ name } ya existe en la base de datos`);
        }
    }
}

export const categoriaNoExistente = async (name, categoria) => {
    if (!categoria || categoria.status === false) {
        throw new Error(`La categoria ${ name } no se encontro`);
    }
}
 
export const existenteProveedor = async (name, proveedor) => {
    if (!proveedor || proveedor.status === false) {
        throw new Error(`El proveedor ${ name } no se encontro`);
    }
}