import mongoose from "mongoose";
 
const movimientoSchema = new mongoose.Schema({
    producto:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto', required: true 
    },
    tipo: {
        type: String,
        enum: ['entrada', 'salida'], 
        required: true 
    },
    cantidad: { 
        type: Number, 
        required: true 
    },
    fecha: { 
        type: Date, 
        default: Date.now
    },
    empleado: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true
    },
    motivo: { 
        type: String // solo para salidas
    }, 
    destino: { 
        type: String // solo para salidas
    }, 
}, {
    versionKey: false
});
 
export default mongoose.model('Movimiento', movimientoSchema);