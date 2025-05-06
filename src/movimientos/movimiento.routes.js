import express from "express";
import {registrarEntrada, registrarSalida, historialMovimientos,historialProductosMovimientos, editarMovimiento} from './movimiento.controller.js'
import {validarCampos}  from '../middlewares/validar-campos.js'
import {check} from 'express-validator'
import { validarCamposPermitidos } from "../middlewares/validar-edicion-movimiento.js";

const router = express.Router()

router.get(
    "/:id", 
    [
        check("productId","Must be a valid ID").isMongoId()
    ],
    historialProductosMovimientos
);
router.get('/',historialMovimientos);

router.post("/entry", validarCampos, registrarEntrada);

router.post("/exit", validarCampos, registrarSalida);

router.put('/:id', validarCamposPermitidos, validarCampos, editarMovimiento)

export default router;