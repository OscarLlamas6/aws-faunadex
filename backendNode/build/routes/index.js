"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Usuario_1 = require("../routes/Usuario");
const Album_1 = require("../routes/Album");
const Foto_1 = require("../routes/Foto");
class IndexRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.router.use('/usuario', Usuario_1.Usuario);
        this.router.use('/album', Album_1.Album);
        this.router.use('/foto', Foto_1.Foto);
    }
}
const indexRoutes = new IndexRoutes();
indexRoutes.routes();
exports.default = indexRoutes.router;
