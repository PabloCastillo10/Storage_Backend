// middlewares/validarCamposPermitidos.js

export const validarCamposPermitidos = (req, res, next) => {
  const camposPermitidos = ['cantidad', 'tipo', 'motivo', 'destino'];
  const camposEnviados = Object.keys(req.body);

  const camposInvalidos = camposEnviados.filter(
    campo => !camposPermitidos.includes(campo)
  );

  if (camposInvalidos.length > 0) {
    return res.status(400).json({
      msg: `Campos no permitidos en la edición: ${camposInvalidos.join(', ')}`
    });
  }

  next();
};
