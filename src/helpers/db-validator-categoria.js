import Categoria from "../categoria/categoria.model.js"

export const existenteId = async (id = '' ) => {

    if(!/^[0-9a-fA-F]{24}$/.test(id)){
        throw new Error(`El ID ${id} no existe en la base de datos`)
    }

    const existeId = await Categoria.findById( id );

    if(!existeId){
        throw new Error(`El ID ${id} no existe en la base de datos`)
    }
}

export const falsoId = async ( category ) => {
    if (category.status === false) {
        throw new Error(`Categoria desactivada o ya esta desactivada`)
    }
}

export const verificarCategoriaExistente = async ( name, category )  => {
    if (name && name !== category.name) {
        const existingCategoria = await Categoria.findOne({name});

        if (existingCategoria && existingCategoria.id !== category.id) {
            throw new Error(`El nombre de la categoria ${name} ya existe en la base de datos`)
        } 
    }
}