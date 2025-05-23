import Producto  from "../productos/productos.model.js";
import Categoria from "../categoria/categoria.model.js";
import { categoriaNoExistente, existenteProductById, statusProduct, verificarProductoExistente, existenteProveedor } from "../helpers/db-validator-products.js";
import Proveedor from "../proveedores/proveedor.model.js";


export const saveProduct = async (req, res) => {
    try {
        const data = req.body;
        const categoria = await Categoria.findOne({name: data.categoria});
        const proveedor = await Proveedor.findOne({name: data.proveedor});
        const fechaEntrada = data.fechaEntrada;

        await categoriaNoExistente(data.categoria, categoria);
        await existenteProveedor(data.proveedor, proveedor);

        const newProduct = new Producto({
            ...data,
            categoria: categoria._id,
            proveedor: proveedor._id,
            fechaEntrada : fechaEntrada || Date.now(),
        })
        await newProduct.save();

        const productoGuardado = await Producto.findById(newProduct._id).populate("categoria", "name").populate("proveedor", "name");

        res.status(200).json({
            success: true,
            msg: "Producto guardado",
            producto: productoGuardado,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error.message,
            success: false,
        })
}}

export const getProducts = async (req, res) => {
    try {
        const productos = await Producto.find({status: true}).populate("categoria","name").populate("proveedor", "name");
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

export const getLowStockProducts = async (req, res) => {
    try {
        const productos = await Producto.find({
            stock: { $lte: 5 },
            status: true
        }).populate("categoria", "name").populate("proveedor", "name");

        res.status(200).json({
            msg: "Productos con bajo stock obtenidos",
            productos,
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error al obtener productos con bajo stock",
            error: error.message
        });
    }
};


export const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        await existenteProductById(id);

        const producto = await Producto.findById(id).populate("categoria", "name");

        await statusProduct(producto);

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
            name: termino,
            status: true,
        }).populate("categoria", "name").populate("proveedor", "name")

        if (productos.length > 0) {
            return res.status(200).json({
                msg: "Productos encontrados por nombre",
                productos,
            })
        }

        const categorias = await Categoria.find({
            name: { $regex: new RegExp(`^${termino}$`, 'i') },
            status: true,
        })

        if (categorias.length > 0) {
            const categoriaIds = categorias.map(cat => cat._id);

            productos = await Producto.find({
                categoria: { $in: categoriaIds },
                status: true,
            }).populate("categoria", "name")
            .populate("proveedor", "name")

            if (productos.length > 0) {
                return res.status(200).json({
                    msg: "Productos encontrados por nombre de categoría",
                    productos,
                });
            }
        }

        const fecha = new Date(termino);

        if (!isNaN(fecha.getTime())) {
            const inicioDia = new Date(fecha.setUTCHours(0, 0, 0, 0));
            const finDia = new Date(inicioDia).setUTCHours(23, 59, 59, 999);

            productos = await Producto.find({
                fechaEntrada: { $gte: inicioDia, $lt: new Date(finDia) },
                status: true,
            }).populate("categoria", "name").populate("proveedor", "name");


            if (productos.length > 0) {
                return res.status(200).json({
                    msg: "Productos encontrados por fecha de entrada",
                    productos,
                });
            } else {
                return res.status(404).json({
                    msg: "No se encontraron productos en la fecha ingresada",
                    productos: [],
                });
            }
        }

        res.status(404).json({
            msg: "No se encontraron productos que coincidan",
        })
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
        const {...data} = req.body;
        let { name } = req.body;
        
        await existenteProductById(id);

        const producto = await Producto.findById(id);
        
        await statusProduct(producto);
        await verificarProductoExistente(name, producto);

        const categoria = await Categoria.findOne({name: data.categoria});
        await categoriaNoExistente(data.categoria, categoria);

        const proveedor = await Proveedor.findOne({name: data.proveedor});
        await existenteProveedor(data.proveedor, proveedor);

        data.categoria = categoria._id;
        data.proveedor = proveedor._id;

        const productoActualizado = await Producto.findByIdAndUpdate(id, data, { new: true })
            .populate('categoria', 'name')
            .populate('proveedor', 'name');

        res.status(200).json({
            msg: "Producto actualizado",
            producto: productoActualizado,
        });

      } catch (error) {
        res.status(500).json({
            msg: "Error al actualizar el producto",
            error: error.message
        });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        await existenteProductById(id);

        const producto = await Producto.findById(id);
        await statusProduct(producto);

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