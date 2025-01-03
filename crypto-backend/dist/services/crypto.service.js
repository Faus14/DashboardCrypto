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
exports.getCryptoByName = exports.deleteCrypto = exports.updateCrypto = exports.createCrypto = exports.getCryptoById = exports.getCryptos = void 0;
const database_1 = __importDefault(require("../config/database"));
const getCryptos = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield database_1.default.query('SELECT * FROM cryptocurrencies');
    return result.rows;
});
exports.getCryptos = getCryptos;
const getCryptoById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield database_1.default.query('SELECT * FROM cryptocurrencies WHERE crypto_id = $1', [id]);
    return result.rows[0] || null;
});
exports.getCryptoById = getCryptoById;
const createCrypto = (crypto) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield database_1.default.query('INSERT INTO cryptocurrencies (name, symbol) VALUES ($1, $2) RETURNING *', [crypto.name, crypto.symbol,]);
    return result.rows[0];
});
exports.createCrypto = createCrypto;
const updateCrypto = (id, crypto) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield database_1.default.query('UPDATE cryptocurrencies SET name = $1, symbol = $2 WHERE crypto_id = $3 RETURNING *', [crypto.name, crypto.symbol, id]);
    return result.rows[0] || null;
});
exports.updateCrypto = updateCrypto;
const deleteCrypto = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield database_1.default.query('DELETE FROM cryptocurrencies WHERE crypto_id = $1', [id]);
});
exports.deleteCrypto = deleteCrypto;
const getCryptoByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield database_1.default.query('SELECT * FROM cryptocurrencies WHERE name = $1', [name]);
    return result.rows[0] || null;
});
exports.getCryptoByName = getCryptoByName;
