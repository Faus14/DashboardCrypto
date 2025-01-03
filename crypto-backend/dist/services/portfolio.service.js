"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalBalance = exports.getPortfolioByIdService = exports.getPortfolios = exports.deletePortfolios = exports.createPortfolios = void 0;
const axios_1 = __importDefault(require("axios"));
const database_1 = __importDefault(require("../config/database"));
const createPortfolios = (user_id, portfolio_name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.default.query('INSERT INTO portfolios (user_id, portfolio_name) VALUES ($1, $2) RETURNING *', [user_id, portfolio_name]);
        return result.rows[0];
    }
    catch (err) {
        console.error('Error al crear el portafolio:', err);
        throw err;
    }
});
exports.createPortfolios = createPortfolios;
const deletePortfolios = (portfolio_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.default.query('DELETE FROM portfolios WHERE portfolio_id = $1', [portfolio_id]);
    }
    catch (err) {
        console.error('Error al eliminar el portafolio:', err);
        throw err;
    }
});
exports.deletePortfolios = deletePortfolios;
const getPortfolios = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.default.query('SELECT * FROM portfolios WHERE user_id = $1', [user_id]);
        return result.rows;
    }
    catch (err) {
        console.error('Error al obtener los portafolios:', err);
        throw err;
    }
});
exports.getPortfolios = getPortfolios;
const getPortfolioByIdService = (portfolio_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield database_1.default.query('SELECT * FROM portfolios WHERE portfolio_id = $1', [portfolio_id]);
        return result.rows[0];
    }
    catch (err) {
        console.error('Error al obtener el portafolio:', err);
        throw err;
    }
});
exports.getPortfolioByIdService = getPortfolioByIdService;
const getTotalBalance = (portfolio_id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const result = yield database_1.default.query(`SELECT c.symbol, SUM(CASE WHEN t.transaction_type = 'add' THEN t.quantity
                                 WHEN t.transaction_type = 'remove' THEN -t.quantity
                                 ELSE 0 END) AS total_quantity
      FROM transactions t
      JOIN cryptocurrencies c ON t.crypto_id = c.crypto_id
      WHERE t.portfolio_id = $1
      GROUP BY c.symbol`, [portfolio_id]);
        const cryptos = result.rows;
        let totalBalance = 0;
        for (const crypto of cryptos) {
            try {
                const response = yield axios_1.default.get(`https://criptoya.com/api/${crypto.symbol}/ARS/1`);
                const askPrice = (_a = response.data.satoshitango) === null || _a === void 0 ? void 0 : _a.ask;
                if (!askPrice) {
                    console.warn(`No se encontró precio para ${crypto.symbol}`);
                    continue;
                }
                totalBalance += crypto.total_quantity * askPrice;
            }
            catch (apiError) {
                if (axios_1.default.isAxiosError(apiError)) {
                    console.error(`Error al obtener datos de CriptoYa para ${crypto.symbol}: ${apiError.message}`);
                }
                else {
                    console.error(`Error al obtener datos de CriptoYa para ${crypto.symbol}:`, apiError);
                }
            }
        }
        return totalBalance;
    }
    catch (err) {
        console.error('Error al obtener el balance total del portafolio:', err);
        throw err;
    }
});
exports.getTotalBalance = getTotalBalance;
