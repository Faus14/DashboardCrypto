"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCryptoFromPortfolio = exports.addCryptoToPortfolio = exports.getPortfolioCryptos = exports.getPortfolioTransactions = void 0;
const transactionService = __importStar(require("../services/transaction.service"));
const getPortfolioTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { portfolio_id } = req.params;
        const transactions = yield transactionService.getporfolioTransactions(Number(portfolio_id));
        res.status(200).json(transactions);
    }
    catch (err) {
        res.status(500).json({ message: 'Error al buscar transacciones', error: err });
    }
});
exports.getPortfolioTransactions = getPortfolioTransactions;
const getPortfolioCryptos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { portfolio_id } = req.params;
        const cryptos = yield transactionService.getPortfolioCryptos(Number(portfolio_id));
        res.status(200).json(cryptos);
    }
    catch (err) {
        res.status(500).json({ message: 'Error al buscar transaccion', error: err });
    }
});
exports.getPortfolioCryptos = getPortfolioCryptos;
const addCryptoToPortfolio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { portfolio_id, crypto_id, quantity } = req.body;
        const transaction = yield transactionService.addCryptoToPortfolio({
            portfolio_id,
            crypto_id,
            quantity,
            transaction_type: 'add',
            transaction_date: new Date(),
        });
        res.status(201).json(transaction);
    }
    catch (err) {
        res.status(500).json({ message: 'Error al agregar transaccion', error: err });
    }
});
exports.addCryptoToPortfolio = addCryptoToPortfolio;
const removeCryptoFromPortfolio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { portfolio_id, crypto_id, quantity } = req.body;
        const result = yield transactionService.removeCryptoFromPortfolio(Number(portfolio_id), Number(crypto_id), quantity);
        if (result.error) {
            res.status(400).json({ message: result.message, available_quantity: result.available_quantity });
        }
        res.status(200).json(result);
    }
    catch (err) {
        console.error('Error en el controlador:', err);
        res.status(500).json({ message: 'Error al vender criptomoneda', error: err });
    }
});
exports.removeCryptoFromPortfolio = removeCryptoFromPortfolio;
