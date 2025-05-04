import path from 'path';
import fs from 'fs';
import Movimiento from "../movimientos/movimiento.model.js";
import Producto from "../productos/productos.model.js";
import { existenteProductById, statusProduct } from "../helpers/db-validator-products.js";
import { movimientoNoValido, noExistenMovimientos, verificarIngresoFechas, verificarMovimientos, verificarProductos, generarExcelEstadisticas } from "../helpers/db-validator-informe.js";

export const getQuantityProducts = async (req, res) => {
    try {

        const productos = await Producto.find({ status: true }, { name: 1, stock: 1 });
        
        res.status(200).json({
            msg: "Productos obtenidos",
            productos
        })
    } catch (error) {
        res.status(500).json({
            msg: "Error al obtener los productos",
            error: error.message
        })
    }
}

export const getQuantityProductById = async (req, res) => {
    const { id } = req.params;

    try {
        await existenteProductById(id);

        const producto = await Producto.findById(id, { name: 1, stock: 1 });

        await statusProduct(producto);
        
        res.status(200).json({
            msg: "Producto encontrado",
            producto
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Error al obtener el producto",
            error: error.message
        })
    }
}

export const getTotalProductsStock = async (req, res) => {
    try {
        const productos = await Producto.find({ status: true }, { stock: 1 });

        let total = 0;
        for (let i = 0; i < productos.length; i++) {
            total += productos[i].stock;
        }

        res.status(200).json({
            msg: "Total de productos en stock",
            total: {
                cantidadInventario: total
            }
        })
    } catch (error) {
        res.status(500).json({
            msg: "Error al obtener el total de productos en stock",
            error: error.message
        })
    }
}

export const getValueInventory = async (req, res) => {
    try {
        const productos = await Producto.find({ status: true }, { price: 1 });

        let total = 0;
        for (let i = 0; i < productos.length; i++) {
            total += productos[i].price;
        }

        res.status(200).json({
            msg: "Valor de Inventario",
            total: {
                precioInventario: total
            }
        })
    } catch (error) {
        res.status(500).json({
            msg: "Error al obtener el valor de inventario",
            error: error.message
        })
    }
}

export const resumenMovimientos = async (req, res) => {
    try {
        const { tipo, desde, hasta } = req.query;

        await movimientoNoValido(tipo);
        await verificarIngresoFechas(desde, hasta);

        const fechaInicio = new Date(desde);
        const fechaFin = new Date(hasta);
        fechaFin.setDate(fechaFin.getDate() + 1);

        const movimientos = await Movimiento.find({
            tipo: tipo.toLowerCase(),
            fecha: { $gte: fechaInicio, $lte: fechaFin }
        })
        .sort({ fecha: -1 })
        .populate('producto', 'name')
        .populate('empleado', 'name')

        await noExistenMovimientos(movimientos, tipo, desde, hasta);

        const resumen = movimientos.map(mov => ({
            fecha: mov.fecha,
            tipo: mov.tipo,
            cantidad: mov.cantidad,
            producto: mov.producto?.name || 'Producto eliminado',
            empleado: mov.empleado?.name || 'Empleado eliminado'
        }))

        res.status(200).json({
            msg: `Resumen de movimientos de tipo '${ tipo }'`,
            total: movimientos.length,
            resumen
        })

    } catch (error) {
        res.status(500).json({
            msg: 'Error al obtener el resumen de movimientos',
            error: error.message
        })
    }
}

export const estadisticasProductos = async (req, res) => {
    try {
        const movimientos = await Movimiento.find({})
            .populate('producto', 'name stock status')
            .exec()

        if (!movimientos || movimientos.length === 0) {
            return res.status(404).json({
                msg: "No se encontraron movimientos en la base de datos"
            })
        }

        const statsMap = new Map();

        movimientos.forEach(mov => {
            const producto = mov.producto;
            const id = producto._id.toString();

            if (!statsMap.has(id)) {
                statsMap.set(id, {
                    producto: producto.name,
                    stock: producto.stock ?? 0,
                    entradas: 0,
                    salidas: 0,
                    totalMovimientos: 0,
                    primeraFecha: mov.fecha,
                    ultimaFecha: mov.fecha
                })
            }

            const stat = statsMap.get(id);

            if (mov.tipo === 'entrada') {
                stat.entradas += 1;
            } else if (mov.tipo === 'salida') {
                stat.salidas += 1;
            }

            stat.totalMovimientos = stat.entradas + stat.salidas;

            if (mov.fecha < stat.primeraFecha) stat.primeraFecha = mov.fecha;
            if (mov.fecha > stat.ultimaFecha) stat.ultimaFecha = mov.fecha;
        })

        const estadisticas = Array.from(statsMap.values())
            .sort((a, b) => (b.totalMovimientos) - (a.totalMovimientos))

        const carpetaDescargas = path.join(
            path.resolve(),
            'src/informes',
            'estadisticas'
        )

        const fileName = 'estadisticas_productos.xlsx';
        const filePath = path.join(carpetaDescargas, fileName)

        if (!fs.existsSync(carpetaDescargas)) {
            fs.mkdirSync(carpetaDescargas)
        }

        const buffer = await generarExcelEstadisticas(estadisticas)

        console.log("Guardando el archivo en:", filePath)
        fs.writeFileSync(filePath, buffer)

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)

        const file = fs.createReadStream(filePath);
        file.pipe(res)

        res.status(200).json({
            msg: "Estadísticas generales de productos",
            total: estadisticas.length,
            estadisticas
        })

        file.on('end', () => {
            fs.unlinkSync(filePath);
        })

    } catch (error) {
        res.status(500).json({
            msg: 'Error al obtener estadísticas de productos',
            error: error.message
        })
    }
}