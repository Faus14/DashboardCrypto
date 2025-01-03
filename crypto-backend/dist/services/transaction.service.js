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
exports.getPortfolioBalance = exports.removeCryptoFromPortfolio = exports.addCryptoToPortfolio = exports.getPortfolioCryptos = exports.getporfolioTransactions = void 0;
const database_1 = __importDefault(require("../config/database"));
const axios_1 = __importDefault(require("axios"));
const getporfolioTransactions = (portfolio_id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield database_1.default.query(`
    SELECT *
    FROM transactions
    WHERE portfolio_id = $1
    `, [portfolio_id]);
    return result.rows;
});
exports.getporfolioTransactions = getporfolioTransactions;
const getPortfolioCryptos = (portfolio_id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield database_1.default.query(`
    SELECT 
      t.crypto_id,
      c.name AS crypto_name,
      SUM(CASE WHEN t.transaction_type = 'add' THEN t.quantity::numeric ELSE 0 END) -
      SUM(CASE WHEN t.transaction_type = 'remove' THEN t.quantity::numeric ELSE 0 END) AS total_quantity
    FROM transactions t
    JOIN cryptocurrencies c ON t.crypto_id = c.crypto_id
    WHERE t.portfolio_id = $1
    GROUP BY t.crypto_id, c.name
    HAVING SUM(CASE WHEN t.transaction_type = 'add' THEN t.quantity::numeric ELSE 0 END) -
           SUM(CASE WHEN t.transaction_type = 'remove' THEN t.quantity::numeric ELSE 0 END) > 0
    `, [portfolio_id]);
    return result.rows;
});
exports.getPortfolioCryptos = getPortfolioCryptos;
const addCryptoToPortfolio = (transaction) => __awaiter(void 0, void 0, void 0, function* () {
    const { portfolio_id, crypto_id, quantity, transaction_type, transaction_date } = transaction;
    const result = yield database_1.default.query(`
    INSERT INTO transactions (portfolio_id, crypto_id, quantity, transaction_type, transaction_date)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `, [portfolio_id, crypto_id, quantity, transaction_type, transaction_date]);
    return result.rows[0];
});
exports.addCryptoToPortfolio = addCryptoToPortfolio;
// Quitar criptomoneda de un portafolio (VENDER)
const removeCryptoFromPortfolio = (portfolio_id, crypto_id, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Verificar la cantidad disponible en la base de datos
        const result = yield database_1.default.query(`
      SELECT 
        SUM(CASE WHEN t.transaction_type = 'add' THEN t.quantity::numeric ELSE 0 END) -
        SUM(CASE WHEN t.transaction_type = 'remove' THEN t.quantity::numeric ELSE 0 END) AS total_quantity
      FROM transactions t
      WHERE t.portfolio_id = $1 AND t.crypto_id = $2
      `, [portfolio_id, crypto_id]);
        const currentQuantity = ((_a = result.rows[0]) === null || _a === void 0 ? void 0 : _a.total_quantity) || 0;
        console.log(`Cantidad disponible para vender: ${currentQuantity}`);
        console.log(`Cantidad solicitada para vender: ${quantity}`);
        // Validar si hay suficiente cantidad para la venta
        if (currentQuantity < quantity) {
            return {
                error: true,
                message: 'Cantidad insuficiente para vender',
                available_quantity: currentQuantity,
            };
        }
        // Registrar transacción de venta
        yield database_1.default.query(`
      INSERT INTO transactions (portfolio_id, crypto_id, quantity, transaction_type, transaction_date)
      VALUES ($1, $2, $3, $4, $5)
      `, [portfolio_id, crypto_id, quantity, 'remove', new Date()]);
        return { message: 'Transacción completada', portfolio_id, crypto_id, quantity_vendida: quantity };
    }
    catch (error) {
        console.error('Error al procesar la transacción:', error);
        throw new Error('Error en la operación de venta');
    }
});
exports.removeCryptoFromPortfolio = removeCryptoFromPortfolio;
// Obtener el balance total del portafolio para un usuario
const getPortfolioBalance = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const portfoliosResult = yield database_1.default.query(`
    SELECT p.id AS portfolio_id, t.crypto_id, SUM(t.quantity) AS total_quantity
    FROM portfolios p
    JOIN transactions t ON p.id = t.portfolio_id
    WHERE p.user_id = $1
    GROUP BY p.id, t.crypto_id
    `, [user_id]);
    const portfolios = portfoliosResult.rows;
    let totalBalance = 0;
    for (const portfolio of portfolios) {
        const { crypto_id, total_quantity } = portfolio;
        try {
            const response = yield axios_1.default.get(`https://criptoya.com/api/${crypto_id}/ARS/1`);
            const askPrice = (_a = response.data.satoshitango) === null || _a === void 0 ? void 0 : _a.ask;
            if (!askPrice) {
                console.warn(`No se encontró precio para ${crypto_id}`);
                continue;
            }
            totalBalance += total_quantity * askPrice;
        }
        catch (apiError) {
            if (axios_1.default.isAxiosError(apiError)) {
                console.error(`Error al obtener datos de CriptoYa para ${crypto_id}: ${apiError.message}`);
            }
            else {
                console.error(`Error al obtener datos de CriptoYa para ${crypto_id}:`, apiError);
            }
        }
    }
    return totalBalance;
});
exports.getPortfolioBalance = getPortfolioBalance;
