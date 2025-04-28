export const tieneRole = (...roles) => {


    return (req, res, next) => {
        if (!roles.includes(req.employee.role)) {
            return res.status(400).json({
                success: false,
                message : `Empleado no autorizado, posee un rol ${ req.employee.role }, el role autorizado es ${ roles }`
            });
        }

        next();
    }
}
