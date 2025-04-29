'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validate-cant-peticiones.js';
import categoriaRoutes from '../src/categoria/categoria.routes.js';
import produtoRoutes from '../src/productos/productos.routes.js';
import proveedorRoutes from "../src/proveedores/proveedor.routes.js";
import clienteRoutes from "../src/clientes/cliente.routes.js";

const configurarMiddlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const configurarRutas = (app) => {
    app.use('/almacenadora/categorias', categoriaRoutes)
    app.use('/almacenadora/productos', produtoRoutes);
    app.use('/almacenadora/proveedores', proveedorRoutes);
    app.use('/almacenadora/clientes', clienteRoutes);
}

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log("Conexión a la base de datos exitosa");
    } catch (error) {
        console.error('Error conectando a la base de datos', error);
        process.exit(1);
    }
}

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3000;
    await conectarDB();
    configurarMiddlewares(app);
    configurarRutas(app);
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}