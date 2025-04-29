import Movimiento from './movimiento.model.js';
import Producto from '../productos/productos.model.js';
 
// Registrar entrada
export const registrarEntrada = async (req, res) => {
  try {
    const { nombre, cantidad, empleado } = req.body;
 
    const producto = await Producto.findOne({name: nombre});
    if (!producto) return res.status(404).json({ msg: 'Producto no encontrado' });
 
    producto.stock += cantidad;
    await producto.save();
 
    const movimiento = new Movimiento({
      producto: producto.id,
      tipo: 'entrada',
      cantidad,
      empleado,
    });
 
    await movimiento.save();
    res.status(201).json(movimiento);
  } catch (error) {
    res.status(500).json({ msg: 'Error al registrar entrada', error : error.message});
  }
};
 
// Registrar salida
export const registrarSalida = async (req, res) => {
  try {
    const { nombre, cantidad, empleado, motivo, destino } = req.body;
 
    const producto = await Producto.findOne({name: nombre});
    if (!producto) return res.status(404).json({ msg: 'Producto no encontrado' });
 
    if (producto.stock < cantidad)
      return res.status(400).json({ msg: 'Stock insuficiente' });
 
    producto.stock -= cantidad;
    await producto.save();
 
    const movimiento = new Movimiento({
      producto: productoId,
      tipo: 'salida',
      cantidad,
      empleado,
      motivo,
      destino,
    });
 
    await movimiento.save();
    res.status(201).json(movimiento);
  } catch (error) {
    res.status(500).json({ msg: 'Error al registrar salida', error });
  }
};
 
// Obtener historial por producto
export const historialMovimientos = async (req, res) => {
  try {
    const { idProducto } = req.params;
 
    const movimientos = await Movimiento.find({ producto: idProducto }).sort({ fecha: -1 });
    res.json(movimientos);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener historial', error });
  }
};