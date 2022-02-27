"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Album = void 0;
const express_1 = require("express");
const Foto_1 = __importDefault(require("../controllers/Foto"));
exports.Album = (0, express_1.Router)();
exports.Album.post('/subirFoto', function (req, res) {
    Foto_1.default.instance.createFoto(req, res);
});
exports.Album.get('/getFotos/:idAlbum', function (req, res) {
    Foto_1.default.instance.getFotos(req, res);
});
