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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
const authService = __importStar(require("../services/auth.service"));
const userService = __importStar(require("../services/user.service"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: 'Faltan campos obligatorios: username o password' });
        return;
    }
    try {
        const { token, user } = yield authService.login(username, password);
        res.status(200).json({ message: 'Login exitoso', token, user });
    }
    catch (error) {
        console.error('Error en el login:', error);
        if (error instanceof Error) {
            res.status(401).json({ message: error.message });
        }
        else {
            res.status(401).json({ message: 'Unknown error' });
        }
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ message: 'Faltan campos obligatorios: username o password' });
            return;
        }
        if (password.trim() === '') {
            res.status(400).json({ message: 'La contraseña no puede estar vacía' });
            return;
        }
        const existingUser = yield userService.getUserByUsername(username);
        if (existingUser) {
            res.status(400).json({ message: 'El usuario ya existe' });
            return;
        }
        const saltRounds = 10;
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        const user = yield userService.createUser({
            username,
            password_hash: hashedPassword,
            role: 'user' // Fijado automáticamente
        });
        const { password_hash } = user, userWithoutPassword = __rest(user, ["password_hash"]);
        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: userWithoutPassword
        });
    }
    catch (error) {
        console.error('Error al registrar usuario:', error);
        if (!res.headersSent) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            res.status(500).json({ message: 'Error al registrar usuario', error: errorMessage });
        }
    }
});
exports.register = register;
