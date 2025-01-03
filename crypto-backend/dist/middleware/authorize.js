"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const authorize = (roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            res.status(401).json({ message: 'No autorizado: Token no presente o inválido' });
            console.log('No autorizado: Token no presente o inválido');
            return;
        }
        if (!roles.includes(user.role)) {
            res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
            console.log('No tienes permiso para realizar esta acción');
            return;
        }
        next();
    };
};
exports.authorize = authorize;
