import Producto from "../productos/productos.model";
import Categoria from "./categoria.model";
import { request, response } from "express";

export const saveCategory = async (req, res) => {
    try {
        
        const data = req.body;

        const category = await Categoria.create({
            name: data.name,
            description: data.description
        });

        res.status(200).json({
            success: true,
            msg: "Categoria creada exitosamente!!",
            category
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al guardar la categoria",
            error
        });
    }
}

export const getCategory = async (req = request, res = response) => {
    try {
        
        const { limite = 10, desde = 0 } = req.body;
        const query = { estado: true }

        const [ total, categories ] = await Promise.all([
            Categoria.countDocuments(query),
            Categoria.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            msg: "Categorias obtenidas exitosamente!!",
            total,
            categories
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al obtener las categorias",
            error
        });
    }
}

export const getCategoryById = async (req, res) => {
    try {
        
        const { id } = req.params;

        const category = await Categoria.findById(id);

        res.status(200).json({
            success: true,
            msg: "Categoria obtenida exitosamente!!",
            category
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al buscar categoria",
            error
        })
    }
}

export const updateCategory = async (req, res = response) => {
    try {
        
        const { id } = req.params;
        const { _id, ...data } = req.body;
        let { name } = req.body;

        if (name) {
            name = name.toLowerCase();
            data.name = name;
        }

        const updateCategory = await Categoria.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: "Categoria actualizada exitosamente!!",
            updateCategory
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al actualizar categoria",
            error
        })
    }
}

export const deleteCategory = async (req, res = response) => {
    try {
        
        const { id } = req.params;

        await Producto.updateMany(
            { category: id },
            { $set: { category: categoryGeneral._id } }
        );

        const deleteCategory = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

        res.status(200).json({
            success: true,
            msg: "Categoria eliminada exitosamente!!",
            deleteCategory
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al eliminar la categoria",
            error
            
        })
    }
}