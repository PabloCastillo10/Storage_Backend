import Movimiento from './movimiento.model.js';
import Producto from '../productos/productos.model.js';
import User from '../users/user.model.js';
 
// Registrar entrada
export const registrarEntrada = async (req, res) => {
  try {
    const { productoName, cantidad, empleado } = req.body;
 
    const producto = await Producto.findOne({name: productoName.toLowerCase()});
    if (!producto) return res.status(404).json({ msg: `Producto ${productoName} no encontrado` });

    const user = await User.findOne({name: empleado.toLowerCase()});
    if (!user || user.role === 'ADMIN') return res.status(404).json({ msg: `Empleado ${empleado} no encontrado` });
 
    producto.stock += cantidad;
    await producto.save();
 
    const movimiento = new Movimiento({
      producto: producto.id,
      tipo: 'entrada',
      cantidad,
      empleado: user.id,
    });
 
    await movimiento.save();

    const motionSaved = await Movimiento.findById(movimiento._id).populate('producto', 'name').populate('empleado', 'name');

    const response = {
      _id: motionSaved._id,
      producto: motionSaved.producto.name, // <-- solo el nombre
      tipo: motionSaved.tipo,
      cantidad: motionSaved.cantidad,
      fecha: motionSaved.fecha,
      empleado: motionSaved.empleado.name,
    };

    res.status(200).json({
      Success: true,
      msg: 'Entrada guardada exitosamente',
      response
    });

  } catch (error) {
    res.status(500).json({ msg: 'Error al registrar entrada', error : error.message});
  }
};
 
// Registrar salida
export const registrarSalida = async (req, res) => {
  try {
    const { productoName, cantidad, motivo, destino, empleado } = req.body;
 
    const producto = await Producto.findOne({name: productoName.toLowerCase()});
    if (!producto) return res.status(404).json({ msg: `Producto ${productoName} no encontrado` });

    const user = await User.findOne({name: empleado.toLowerCase()});
    if (!user || user.role === 'ADMIN') return res.status(404).json({ msg: `Empleado ${empleado} no encontrado` });
 
    if (producto.stock < cantidad)
      return res.status(400).json({ msg: 'Stock insuficiente' });
 
    producto.stock -= cantidad;
    await producto.save();
 
    const movimiento = new Movimiento({
      producto: producto.id,
      tipo: 'salida',
      cantidad,
      empleado: user.id,
      motivo,
      destino,
    });
 
    await movimiento.save();

    const motionSaved = await Movimiento.findById(movimiento._id).populate('producto','name').populate('empleado', 'name');

    const response = {
      _id: motionSaved._id,
      producto: motionSaved.producto.name, // <-- solo el nombre
      tipo: motionSaved.tipo,
      cantidad: motionSaved.cantidad,
      fecha: motionSaved.fecha,
      empleado: motionSaved.empleado.name,
    };

    res.status(201).json({
      Success: true, 
      msg: 'Salida guardada exitosamente',
      response
    });
  } catch (error) {
    res.status(500).json({ msg: 'Error al registrar salida', error: error.message});
  }
};
 
export const historialMovimientos = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findById(id);
    if (!producto) {
      return res.status(404).json({ msg: `Producto con ID '${id}' no encontrado` });
    }

    const movimientos = await Movimiento.find({ producto: id })
      .sort({ fecha: -1 })
      .populate('producto', 'name')
      .populate('empleado', 'name');

    if (movimientos.length === 0) {
      return res.status(200).json({ msg: `El producto '${producto.name}' no tiene movimientos registrados` });
    }

    const presentacionMovimientos = movimientos.map(movimiento => {
      const movObj = movimiento.toObject();
      return {
        ...movObj,
        producto: movimiento.producto?.name || 'Producto eliminado',
        empleado: movimiento.empleado?.name || 'Empleado eliminado',
      };
    });

    res.json(presentacionMovimientos);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener historial', error: error.message });
  }
};

export const editarMovimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad, tipo, motivo, destino } = req.body;

    const movimiento = await Movimiento.findById(id);
    if (!movimiento) return res.status(404).json({ msg: 'Movimiento no encontrado' });

    const producto = await Producto.findById(movimiento.producto);
    if (!producto) return res.status(404).json({ msg: `Producto no encontrado` });

    // Primero revertimos el movimiento original
    if (movimiento.tipo === 'entrada') {
      producto.stock -= movimiento.cantidad;
    } else if (movimiento.tipo === 'salida') {
      producto.stock += movimiento.cantidad;
    }

    // Luego aplicamos el nuevo movimiento
    if (tipo === 'entrada') {
      producto.stock += cantidad;
      // Limpiar campos que no corresponden
      movimiento.motivo = undefined;
      movimiento.destino = undefined;
    } else if (tipo === 'salida') {
      if (producto.stock < cantidad) {
        return res.status(400).json({ msg: 'Stock insuficiente para actualizar la salida' });
      }
      producto.stock -= cantidad;
      if (!motivo || !destino) {
        return res.status(400).json({ msg: 'Motivo y destino son obligatorios para movimientos de salida' });
      }
      movimiento.motivo = motivo;
      movimiento.destino = destino;
    }

    movimiento.tipo = tipo;
    movimiento.cantidad = cantidad;

    await producto.save();
    await movimiento.save();

    const actualizado = await Movimiento.findById(movimiento._id).populate('producto', 'name').populate('empleado', 'name');

    res.json({
      Success: true,
      msg: 'Movimiento actualizado correctamente',
      actualizado
    });
  } catch (error) {
    res.status(500).json({ msg: 'Error al editar movimiento', error: error.message });
  }
};
