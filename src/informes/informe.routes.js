import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { getQuantityProducts, getQuantityProductById, getTotalProductsStock, getValueInventory, resumenMovimientos, estadisticasProductos } from "./informe.controller.js";

const router = Router();

router.get(
    "/",
    getQuantityProducts
)

router.get(
    "/product/:id",
    [
        check("id", "Invalid ID").not().isEmpty(),
        validarCampos
    ],
    getQuantityProductById
)

router.get(
    "/totalStock/",
    getTotalProductsStock
)

router.get(
    "/totalValue/",
    getValueInventory
)

router.get(
    '/resumen/',
    resumenMovimientos
)

router.get(
    '/estadisticas/',
    estadisticasProductos
)

export default router;