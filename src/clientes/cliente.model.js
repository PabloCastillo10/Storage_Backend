import { Schema, model } from "mongoose";

const ClienteSchema = Schema({
    name: {
        type: String,
        required: [true, "Name is required!"],
        unique: true
    },

    contact: {
        type: String,
        required: [true, "Contact is required!"],
        maxlength: [100, "100 characters maximum!"]
    },

    products: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Producto',
                required: [true, "Product is required!"]
            }
        ],

    status: {
        type: Boolean,
        default: true
    },

}, {
    timestamps: true,
    versionKey: false
});

export default model('Cliente', ClienteSchema);