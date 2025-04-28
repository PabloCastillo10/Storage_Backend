import { Schema, model } from "mongoose";

const RoleSchema = Schema({
    role : {
        type : String,
        required : [true, "El role es obligatorio"],
        enum : {
            values : ["ADMIN", "EMPLOYEE"]
        }
    }
});

export default model ('Role', RoleSchema);