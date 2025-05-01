import express from "express";
import { check } from "express-validator";
import { saveProveedor, getProveedores, getProveedoresById, updateProveedor, deleteProveedor } from "./proveedor.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { existeProveedorById, validateStatus, errorName, productForName } from "../helpers/db-validator-proveedores.js";

const router = express.Router();

router.get("/", getProveedores);

router.get("/:id",
    [
        check("id", "id invalid!").isMongoId(),
        validarCampos,
        check("id").custom(existeProveedorById),
        check("id").custom(validateStatus),
        validarCampos
    ],
    getProveedoresById
);

router.post("/",
    [
        check("name").custom(errorName),
        check("products").custom(productForName),
        validarCampos
    ],
    saveProveedor
);

router.put("/:id",
    [
        check("id", "id invalid!").isMongoId(),
        validarCampos,
        check("id").custom(existeProveedorById),
        check("id").custom(validateStatus),
        check("name").custom(errorName),
        check("products").custom(productForName),
        validarCampos
    ],
    updateProveedor
);

router.delete("/:id",
    [
        check("id", "id invalid!").isMongoId(),
        validarCampos,
        check("id").custom(existeProveedorById),
        check("id").custom(validateStatus),
        validarCampos
    ],
    deleteProveedor
);

export default router;