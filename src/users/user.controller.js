import User from "./user.model.js";
import { hash } from "argon2";
import { generateJWT } from "../helpers/generate-jwt.js";
import { request, response } from "express";
import { coincidirUsername, crearAdminSiNoExiste, existeUser, existeUserById, noActualizarAdmin, pedirPassword, phoneLength, soloAdmin, statusUser, updatePerfil, validarPasswordParaEliminar, validarPasswordUpdate, validarUsernameParaEliminar, verificarContraseña, verificarUsuarioExistente } from "../helpers/db-validator-users.js";

export const login = async (req, res) => {

    const { email, username, password } = req.body;

    try {

        const lowerEmail = email ? email.toLowerCase() : null;
        const lowerUsername = username ? username.toLowerCase() : null;

        const user = await User.findOne({
            $or: [
                { email: lowerEmail },
                { username: lowerUsername }
            ]
        });

        await existeUser(lowerEmail, lowerUsername);
        await statusUser(user);
        await verificarContraseña(user, password);

        const token = await generateJWT(user.id);

        res.status(200).json({
            success: true,
            msg: "Sesión iniciada exitosamente!!",
            userDetails: {
                username: user.username,
                token: token
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: "Error al iniciar sesión",
            error: error.message
        })
    }
}

export const register = async (req, res) => {
    try {

        const data = req.body;
        const { phone } = req.body;

        await phoneLength(phone);

        const encryptedPassword = await hash(data.password);

        const user = await User.create({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: data.email,
            phone: data.phone,
            password: encryptedPassword
        });

        res.status(200).json({
            success: true,
            msg: 'Usuario registrado exitosamente!!',
            userDetails: {
                username: user.username
            }
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al registrar usuario',
            error: error.message
        });
    }
}

export const getUsers = async (req = request, res = response) => {
    try {

        const { limite = 10, desde = 0 } = req.query;
        const query = { status: true };

        const [ total, users ] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
        ])

        res.status(200).json({
            success: true,
            total,
            msg: "Usuarios obtenidos exitosamente!!",
            users
        })
    
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al obtener los usuarios",
            error
        })
    }
}

export const getUserById = async (req, res) => {
    try {
        
        const { id } = req.params;

        await existeUserById(id);
        
        const user = await User.findById(id);
        
        await statusUser(user);

        res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: "Error al buscar usuario",
            error: error.message
        })
    }
}

export const updateUser = async (req, res = response) => {
    try {

        const { id } = req.params;
        const { _id, email, role, password, currentPassword, ...data } = req.body;
        let { username, phone } = req.body;
        
        await existeUserById(id);

        const user = await User.findById(id);

        await phoneLength(phone);
        await noActualizarAdmin(id);
        await updatePerfil(req, id);
        await verificarUsuarioExistente(username, user);
        await statusUser(user);
        await validarPasswordUpdate(user, password, currentPassword)

        const updateUser = await User.findByIdAndUpdate(id, data, {new: true});

        res.status(200).json({
            success: true,
            msg: 'Usuario actualizado exitosamente!!',
            updateUser
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al actualizar usuario',
            error: error.message
        });
    }
}

export const updateRole = async (req, res = response) => {
    try {

        const { id } = req.params;
        let { role } = req.body;

        await existeUserById(id);

        const user = await User.findById(id);

        await soloAdmin(req);
        await noActualizarAdmin(id);
        await statusUser(user);
        
        const roleUpdate = await User.findByIdAndUpdate(id, { role }, { new: true });
        
        res.status(200).json({
            success: true,
            msg: 'Role actualizado exitosamente!!',
            roleUpdate
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al actualizar Role',
            error: error.message
        });
    }
}

export const deleteUser = async (req, res = response) => {

    try {

        const { id } = req.params;
        const { password, username } = req.body;
        
        const authenticatedUser = req.user;
        
        await existeUserById(id);

        const user = await User.findById(id);
        
        await noActualizarAdmin(id);
        await updatePerfil(req, id);
        await statusUser(user);
        await validarUsernameParaEliminar(username);
        await pedirPassword(password);
        await coincidirUsername(username, user);
        await validarPasswordParaEliminar(user, password);
        
        const userDelete = await User.findByIdAndUpdate(id, { status: false }, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Usuario eliminado exitosamente!!',
            userDelete,
            authenticatedUser
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            msg: 'Error al eliminar usuario',
            error: error.message
        });
    }
}

export const createAdmin = async () => {
    try {

        await crearAdminSiNoExiste();
        
    } catch (error) {
        console.log(" ");
        console.error('Error al crear el Usuario ADMIN: ', error.message);
        console.log(" ");
    }
}