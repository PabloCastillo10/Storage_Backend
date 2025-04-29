import express from "express";
import {registrarEntrada, registrarSalida, historialMovimientos} from './movimiento.controller.js'
import {validarCampos}  from '../middlewares/validar-campos.js'
import {check} from 'express-validator'

const router = express.Router()

router.get(
    "/:id", 
    [
        check("productId","Must be a valid ID").isMongoId()
    ],
    historialMovimientos
);

router.post("/entry", validarCampos, registrarEntrada);

router.post("/exit", validarCampos, registrarSalida);

export default router;