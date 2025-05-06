import express from "express";
import { saveProduct, getProducts, getProductById, updateProduct, deleteProduct, searchFlexible, getLowStockProducts } from "./productos.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/stock", getLowStockProducts);
router.get("/:id", getProductById);
router.post("/", validarCampos, saveProduct);
router.get("/buscar/:termino", validarCampos, searchFlexible);
router.put("/:id", validarCampos, updateProduct);
router.delete("/:id", deleteProduct);

export default router;