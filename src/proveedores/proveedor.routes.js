import express from "express";
import { saveProveedor, getProveedores, getProveedoresById, updateProveedor, deleteProveedor } from "./proveedor.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = express.Router();

router.get("/", getProveedores);
router.get("/:id", getProveedoresById);
router.post("/", validarCampos, saveProveedor);
router.put("/:id", validarCampos, updateProveedor);
router.delete("/:id", validarCampos, deleteProveedor);

export default router;