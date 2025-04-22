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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalPortfolioBalance = exports.getPortfolioById = exports.getUserPortfolios = exports.deletePortfolio = exports.createPortfolio = void 0;
const portfolio_service_1 = require("../services/portfolio.service");
const createPortfolio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { portfolio_name } = req.body;
    try {
        const userId = req.user.userId;
        const portfolio = yield (0, portfolio_service_1.createPortfolios)(userId, portfolio_name);
        res.status(201).json({ message: 'Portafolio creado', portfolio });
    }
    catch (err) {
        console.error('Error al crear el portafolio:', err);
        res.status(500).json({ message: 'Error al crear el portafolio', error: err });
    }
});
exports.createPortfolio = createPortfolio;
const deletePortfolio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { portfolio_id } = req.params;
    try {
        yield (0, portfolio_service_1.deletePortfolios)(parseInt(portfolio_id));
        res.status(204).send();
    }
    catch (err) {
        console.error('Error al eliminar el portafolio:', err);
        res.status(500).json({ message: 'Error al eliminar el portafolio', error: err });
    }
});
exports.deletePortfolio = deletePortfolio;
const getUserPortfolios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const portfolios = yield (0, portfolio_service_1.getPortfolios)(userId);
        res.status(200).json(portfolios);
    }
    catch (err) {
        console.error('Error al obtener los portafolios:', err);
        res.status(500).json({ message: 'Error al obtener los portafolios', error: err });
    }
});
exports.getUserPortfolios = getUserPortfolios;
const getPortfolioById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { portfolio_id } = req.params;
    try {
        const portfolio = yield (0, portfolio_service_1.getPortfolioByIdService)(parseInt(portfolio_id));
        res.status(200).json(portfolio);
    }
    catch (err) {
        console.error('Error al obtener el portafolio:', err);
        res.status(500).json({ message: 'Error al obtener el portafolio', error: err });
    }
});
exports.getPortfolioById = getPortfolioById;
const getTotalPortfolioBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { portfolio_id } = req.params;
    try {
        const balance = yield (0, portfolio_service_1.getTotalBalance)(parseInt(portfolio_id));
        res.status(200).json({ balance });
    }
    catch (err) {
        console.error('Error al obtener el balance total del portafolio:', err);
        res.status(500).json({ message: 'Error al obtener el balance total del portafolio', error: err });
    }
});
exports.getTotalPortfolioBalance = getTotalPortfolioBalance;
