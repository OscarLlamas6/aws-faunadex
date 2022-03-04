"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usuario = void 0;
const express_1 = require("express");
const Usuario_1 = __importDefault(require("../controllers/Usuario"));
exports.Usuario = (0, express_1.Router)();
exports.Usuario.get('/', function (req, res) {
    Usuario_1.default.instance.getUsuarios(req, res);
});
exports.Usuario.post('/login', function (req, res) {
    Usuario_1.default.instance.login(req, res);
});
exports.Usuario.post('/registro', function (req, res) {
    Usuario_1.default.instance.createUser(req, res);
});
exports.Usuario.put('/updateUsuario', function (req, res) {
    Usuario_1.default.instance.updateUser(req, res);
});
