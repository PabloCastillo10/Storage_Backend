import express from "express";

import { check } from "express-validator";
import { saveCategory, getCategory, getCategoryById, updateCategory, deleteCategory } from "./categoria.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = express.Router();

router.get("/", getCategory);
router.get("/:id", getCategoryById);
router.post("/", validarCampos, saveCategory);
router.put("/:id", validarCampos, updateCategory);
router.delete("/:id", deleteCategory);

export default router;