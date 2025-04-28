import { Schema, model } from "mongoose";

const ProductSchema = Schema({
    name : {
        type : String, 
        required: [ true, "El nombre es requerido" ],
        unique: [ true, "El nombre ingresado ya existe" ]
    },
    description: {
        type: String,
        require: [ true, "La descripcion es requerida" ]
    },
    price: {
        type: Number,
        require: [ true, "El precio es requerido" ]
    },
    stock: {
        type: Number,
        require: [ true, "El stock es requerido" ]
    },
    categoria : {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        require: [ true, "La categoria es requerida" ]
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
})

export default model('Producto', ProductSchema);