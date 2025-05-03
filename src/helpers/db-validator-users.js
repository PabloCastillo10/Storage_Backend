import User from "../users/user.model.js";
import { hash, verify } from "argon2";

//VALIDACIONES USERS
export const existenteEmail = async (email = ' ') => {
    
    const existeEmail = await User.findOne({ email });
    
    if (existeEmail) {
        throw new Error(`El email ${ email } ya existe en la base de datos`);
    }
}

export const existenteUsername = async (username = ' ') => {
    
    username = username.toLowerCase();
    
    const existeUsername = await User.findOne({ username });
    
    if (existeUsername) {
        throw new Error(`El username ${ username } ya existe en la base de datos`);
    }
}

export const existeUserById = async (id = '') => {

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error(`El ID ${id} no existe en la base de datos`);
    }

    const existeUser = await User.findById(id);

    if (!existeUser) {
        throw new Error(`El ID ${id} no existe en la base de datos`);
    }
}

export const existeUser = async ( email = ' ', username = ' ') => {
    
    const user = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (!user) {
        throw new Error(`Credenciales incorrectas, email: ${ email } o username: ${ username } no existen en la base de datos`);
    }
}

export const statusUser = async (user) => {
    
    if (user.status === false) {
        throw new Error('Usuario desactivado o ya esta desactivado');
    }
}

export const verificarContraseña = async (user, password = '') => {

    const validarPassword = await verify(user.password, password);

    if (!validarPassword) {
        throw new Error('Contraseña incorrecta');
    }
}

export const noActualizarAdmin = async (id) => {

    const user = await User.findById(id);
    
    if (user.username === "administrador") {
        throw new Error('No se puede actualizar o eliminar el ADMIN por defecto');
    }
}

export const updatePerfil = async (req, id) => {

    if (req.user.id !== id && req.user.role !== "ADMIN") {
        throw new Error('No tienes permisos para actualizar o eliminar un perfil que no es tuyo');
    }
}

export const verificarUsuarioExistente = async (username, user) => {

    if (username && username !== user.username) {
        const existingUser = await User.findOne({ username });

        if (existingUser && existingUser.id !== user.id) {
            throw new Error(`El nombre de usuario ${username} ya existe en la base de datos`);
        }
    }
}

export const validarPasswordUpdate = async (user, password, currentPassword) => {

    if (password) {
        if (!currentPassword) {
            throw new Error('Debes proporcionar la contraseña actual para cambiarla');
        }

        const verifyPassword = await verify(user.password, currentPassword);

        if (!verifyPassword) {
            throw new Error('Contraseña actual incorrecta');
        }

        user.password = await hash(password);
        await user.save();
    }
}

export const soloAdmin = async (req) => {
    
    if (req.user.role !== "ADMIN") {
        throw new Error("Solo los ADMIN pueden actualizar el rol de otros usuarios");
    }
}

export const validarUsernameParaEliminar = async (username) => {
    if (!username) {
        throw new Error('Necesita proporcionar su username para poder eliminar');
    }
}

export const pedirPassword = async (password) => {
    if (!password) {
        throw new Error('Necesita proporcionar su contraseña para poder eliminar');
    }
}

export const coincidirUsername = async (username, user) => {
    if (user.username.toLowerCase() !== username.toLowerCase()) {
        throw new Error('El nombre de usuario es incorrecto');
    }
}

export const phoneLength = async (phone = ' ') => {

    if (phone.length > 8 || phone.length < 8) {
        throw new Error('El número de telefono debe contener exactamente 8 caracteres');
    }
}

export const validarPasswordParaEliminar = async (user, password) => {

    const validPassword = await verify(user.password, password);
    if (!validPassword) {
        throw new Error('Contraseña incorrecta');
    }
}

export const crearAdminSiNoExiste = async () => {
    const verifyUser = await User.findOne({ username: "administrador".toLowerCase() });

    if (!verifyUser) {
        const encryptedPassword = await hash("Admin100");

        const adminUser = new User({
            name: "Ian",
            surname: "Alfaro",
            username: "administrador".toLowerCase(),
            email: "admin@gmail.com",
            phone: "78212654",
            password: encryptedPassword,
            role: "ADMIN"
        });

        await adminUser.save();

        console.log(" ");
        console.log("El usuario ADMIN fue creado exitosamente");
        console.log(" ");
    } else {
        console.log(" ");
        console.log("El usuario ADMIN ya existe, no se creó nuevamente");
        console.log(" ");
    }
};