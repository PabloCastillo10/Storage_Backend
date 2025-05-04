import express from "express";
import { saveCategory, getCategory, getCategoryById, updateCategory, deleteCategory, getCategoryByName } from "./categoria.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = express.Router();

router.get("/", getCategory);
router.get("/:id", getCategoryById);
router.post("/", validarCampos, saveCategory);
router.put("/:id", validarCampos, updateCategory);
router.get("/name/:name", getCategoryByName);
router.delete("/:id", deleteCategory);

export default router;