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
exports.deleteCrypto = exports.updateCrypto = exports.createCrypto = exports.getCryptoById = exports.getCryptos = void 0;
const cryptoService = __importStar(require("../services/crypto.service"));
const getCryptos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cryptos = yield cryptoService.getCryptos();
        res.status(200).json(cryptos);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener cryptos' });
    }
});
exports.getCryptos = getCryptos;
const getCryptoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const crypto = yield cryptoService.getCryptoById(Number(req.params.id));
        if (!crypto) {
            res.status(404).json({ message: 'Crypto no encontrado' });
            return;
        }
        res.status(200).json(crypto);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener crypto' });
    }
});
exports.getCryptoById = getCryptoById;
const createCrypto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, symbol } = req.body;
        const existingCrypto = yield cryptoService.getCryptoByName(name);
        if (existingCrypto) {
            res.status(400).json({ message: 'Ya existe una criptomoneda con ese nombre' });
            return;
        }
        const crypto = yield cryptoService.createCrypto(req.body);
        res.status(201).json(crypto);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear crypto' });
    }
});
exports.createCrypto = createCrypto;
const updateCrypto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const crypto = yield cryptoService.updateCrypto(Number(req.params.id), req.body);
        if (!crypto) {
            res.status(404).json({ message: 'Crypto no encontrado' });
            return;
        }
        res.status(200).json(crypto);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar crypto' });
    }
});
exports.updateCrypto = updateCrypto;
const deleteCrypto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield cryptoService.deleteCrypto(Number(req.params.id));
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar crypto' });
    }
});
exports.deleteCrypto = deleteCrypto;
