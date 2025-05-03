import { Schema, model } from "mongoose";

const ProductSchema = Schema({
    name : {
        type : String, 
        required: [ true, "El nombre es requerido" ],
        unique: [ true, "El nombre ingresado ya existe" ],
        lowercase: true
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
    },
    proveedor : {
        type: Schema.Types.ObjectId,
        ref: 'Proveedor',
        require: [ true, "El proveedor es requerido" ]
    },
    fechaEntrada : {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true,
    versionKey: false
})

export default model('Producto', ProductSchema);