import Producto from "../productos/productos.model.js";
import Categoria from "./categoria.model.js";
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
    const {limite = 10, desde = 0} = req.query;
    const query = { status: true };

    try {
        const categorias = await Categoria.find(query)
            .skip(Number(desde))
            .limit(Number(limite))

            const total = await Categoria.countDocuments(query);

            res.status(200).json({
                success: true,
                total,
                msg: "Categorias obtenidas exitosamente!!",
                categorias
            })
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al obtener categorias",
            error
        })
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

        

        const deleteCategory = await Categoria.findByIdAndUpdate(id, { status: false }, { new: true });

        res.status(200).json({
            success: true,
            msg: "Categoria eliminada exitosamente!!",
            deleteCategory
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al eliminar la categoria",
            error : error.message
            
        })
    }
}