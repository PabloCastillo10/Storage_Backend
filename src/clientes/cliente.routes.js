import express from "express";
import { check } from "express-validator";
import { saveCliente, getClientes, getClienteById, updateCliente, deleteCliente } from "./cliente.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { existeClienteById, validateStatus, errorName, productForName } from "../helpers/db-validator-clientes.js";

const router = express.Router();

router.get("/", getClientes);

router.get("/:id",
    [
        check("id", "id invalid!").isMongoId(),
        validarCampos,
        check("id").custom(existeClienteById),
        check("id").custom(validateStatus),
        validarCampos
    ],
    getClienteById
);

router.post("/",
    [
        check("name").custom(errorName),
        check("products").custom(productForName),
        validarCampos
    ],
    saveCliente
);

router.put("/:id",
    [
        check("id", "id invalid!").isMongoId(),
        validarCampos,
        check("id").custom(existeClienteById),
        check("id").custom(validateStatus),
        check("name").custom(errorName),
        check("products").custom(productForName),
        validarCampos
    ],
    updateCliente
);

router.delete("/:id",
    [
        check("id", "id invalid!").isMongoId(),
        validarCampos,
        check("id").custom(existeClienteById),
        check("id").custom(validateStatus),
        validarCampos
    ],
    deleteCliente
);

export default router;