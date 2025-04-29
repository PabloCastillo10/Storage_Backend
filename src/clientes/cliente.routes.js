import express from "express";
import { saveCliente, getClientes, getClienteById, updateCliente, deleteCliente } from "./cliente.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = express.Router();

router.get("/", getClientes);
router.get("/:id", getClienteById);
router.post("/", validarCampos, saveCliente);
router.put("/:id", validarCampos, updateCliente);
router.delete("/:id", validarCampos, deleteCliente);

export default router;