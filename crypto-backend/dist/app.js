"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const crypto_routes_1 = __importDefault(require("./routes/crypto.routes"));
const portfolio_routes_1 = __importDefault(require("./routes/portfolio.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const transaction_routes_1 = __importDefault(require("./routes/transaction.routes"));
const user_controller_1 = require("./controllers/user.controller");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Rutas
app.use('/users', user_routes_1.default);
app.use('/cryptos', crypto_routes_1.default);
app.use('/portfolio', portfolio_routes_1.default);
app.use('/transaction', transaction_routes_1.default);
app.use('/login', auth_routes_1.default);
(0, user_controller_1.createAdminIfNotExists)();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
