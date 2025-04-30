import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { deleteFileOnError } from "../middlewares/delete-file-on-error.js"
import { deleteUser, getUserById, getUsers, login, register, updateRole, updateUser } from "./user.controller.js";

const router = Router();

router.post(
    "/login",
    deleteFileOnError,
    login
)

router.post(
    "/register",
    deleteFileOnError,
    register
)

router.get(
    "/",
    getUsers
)

router.get(
    "/:id",
    [
        check("id", "Invalid ID").not().isEmpty(),
        validarCampos
    ],
    getUserById
)

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "Invalid ID").not().isEmpty(),
        validarCampos
    ],
    updateUser
)

router.put(
    "/role/:id",
    [
        validarJWT,
        check("id", "Invalid ID").not().isEmpty(),
        check("role", "Invalid role. Valid role are: ADMIN or EMPLOYEE").isIn(["ADMIN", "EMPLOYEE"]),
        validarCampos
    ],
    updateRole
)

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "Invalid ID").not().isEmpty(),
        validarCampos
    ],
    deleteUser
)

export default router;