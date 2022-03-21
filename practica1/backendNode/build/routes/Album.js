"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Album = void 0;
const express_1 = require("express");
const Album_1 = __importDefault(require("../controllers/Album"));
exports.Album = (0, express_1.Router)();
exports.Album.post('/crearAlbum', function (req, res) {
    Album_1.default.instance.createAlbum(req, res);
});
exports.Album.put('/editarAlbum', function (req, res) {
    Album_1.default.instance.updateAlbum(req, res);
});
exports.Album.delete('/eliminarAlbum/:idAlbum', function (req, res) {
    Album_1.default.instance.deleteAlbum(req, res);
});
exports.Album.get('/getAlbum/:idAlbum', function (req, res) {
    Album_1.default.instance.getAlbum(req, res);
});
exports.Album.get('/getAlbums/:idUsuario', function (req, res) {
    Album_1.default.instance.getAlbums(req, res);
});
