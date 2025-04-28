import { Schema, model } from "mongoose";

const CategoriaSchema = Schema({
    name : {
        type : String,
        required : [ true, "El nombre es requerido" ],
        unique : [ true, "El nombre ingresado ya existe" ]
    },
    description : {
        type : String,
        required: [ true, "La descripcion es requerida" ]
    },
    status : {
        type : Boolean,
        default : true
    },
    
    
}, {
    timeStamps: true,
    versionKey : false
})

export default model('Categoria', CategoriaSchema);