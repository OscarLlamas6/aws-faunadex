"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Foto = void 0;
const express_1 = require("express");
const Foto_1 = __importDefault(require("../controllers/Foto"));
exports.Foto = (0, express_1.Router)();
exports.Foto.post('/subirFoto', function (req, res) {
    Foto_1.default.instance.createFoto(req, res);
});
exports.Foto.get('/getFotos/:idAlbum', function (req, res) {
    Foto_1.default.instance.getFotos(req, res);
});
exports.Foto.post('/getTextImagen', function (req, res) {
    Foto_1.default.instance.getTextImagen(req, res);
});
exports.Foto.post('/createFotoAnimal', function (req, res) {
    Foto_1.default.instance.createFotoAnimal(req, res);
});
exports.Foto.post('/translateDescripcionImagen', function (req, res) {
    Foto_1.default.instance.translateDescripcionImagen(req, res);
});
