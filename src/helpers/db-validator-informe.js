import ExcelJS from 'exceljs';

export const movimientoNoValido = async (tipo = '') => {
    if (!tipo || !["entrada", "salida"].includes(tipo.toLowerCase())) {
        throw new Error(`El movimiento ${ tipo } no es valido, debe ser 'entrada' o 'salida'` );
    }
}

export const verificarIngresoFechas = async (desde = '', hasta = '') => {
    if (!desde || !hasta) {
        throw new Error("Debes proporcionar las fechas 'desde' y 'hasta'");
    }
}

export const noExistenMovimientos = async (movimientos, tipo, desde, hasta) => {
    if (movimientos.length === 0) {
        throw new Error(`No se encontraron movimientos de tipo '${ tipo }' en el período del ${ desde } al ${ hasta }`);
    }
}

export const verificarMovimientos = async (movimientos) => {
    if (movimientos.length === 0) {
        throw new Error("No se encontraron movimientos registrados");
    }
}

export const verificarProductos = async (productos) => {
    if (productos.length === 0) {
        throw new Error("No se encontraron productos registrados");
    }
}

export const generarExcelEstadisticas = async (estadisticas) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Estadísticas de Productos');

    worksheet.columns = [
        { header: 'Producto', key: 'producto', width: 30 },
        { header: 'Stock', key: 'stock', width: 15 },
        { header: 'Entradas', key: 'entradas', width: 15 },
        { header: 'Salidas', key: 'salidas', width: 15 },
        { header: 'Total Movimientos', key: 'totalMovimientos', width: 20 },
        { header: 'Fecha de Alta', key: 'primeraFecha', width: 25 },
        { header: 'Fecha de Baja', key: 'ultimaFecha', width: 25 },
    ];

    estadisticas.forEach(stat => {
        worksheet.addRow({
            producto: stat.producto,
            stock: stat.stock,
            entradas: stat.entradas,
            salidas: stat.salidas,
            totalMovimientos: stat.totalMovimientos,
            primeraFecha: stat.primeraFecha.toLocaleDateString(),
            ultimaFecha: stat.ultimaFecha.toLocaleDateString()
        });
    });

    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
            cell.border = {
                top: { style: 'medium', color: { argb: '000000' } },
                left: { style: 'medium', color: { argb: '000000' } },
                bottom: { style: 'medium', color: { argb: '000000' } },
                right: { style: 'medium', color: { argb: '000000' } },
            };

            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

            if (rowNumber === 1) {
                cell.font = { bold: true, color: { argb: 'FFFFFF' }, size: 12 };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1F77B4' } };  // Color de fondo del encabezado (Azul intenso)
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            } else {
                cell.font = { size: 10 };

                if (rowNumber % 2 === 0) {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F1C40F' } };
                } else {
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF5733' } };
                }
            }
        });
    });

    worksheet.getRow(1).height = 30;
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
            row.height = 25;
        }
    });

    worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}
