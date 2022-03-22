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
const sequalize_1 = require("../sequalize");
const Album_1 = require("../models/Album");
const Foto_1 = require("../models/Foto");
const DetalleFoto_1 = require("../models/DetalleFoto");
class AlbumController {
    createAlbum(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction = yield sequalize_1.sequelize.transaction();
            try {
                let data = req.body;
                const albumEncontrado = yield Album_1.Album.findOne({
                    where: {
                        nombre: data.nombre,
                        IdUsuario: data.idUsuario
                    },
                    transaction: transaction
                });
                if (albumEncontrado)
                    throw new Error('Ya existe un album con este nombre');
                const album = yield Album_1.Album.create({
                    nombre: data.nombre,
                    IdUsuario: data.idUsuario
                }, { transaction: transaction });
                yield transaction.commit();
                return res.status(201).send({ error: false, message: 'Se creo album correctamente', result: album });
            }
            catch (error) {
                yield transaction.rollback();
                return res.status(500).send({ error: true, message: error.message });
            }
        });
    }
    updateAlbum(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction = yield sequalize_1.sequelize.transaction();
            try {
                let data = req.body;
                let albumFound = yield Album_1.Album.findOne({
                    where: {
                        id: data.idAlbum
                    },
                    transaction: transaction
                });
                if (albumFound && albumFound.nombre == 'FotosPerfil')
                    throw new Error("El album de fotos de perfil no se puede modificar");
                yield Album_1.Album.update({
                    nombre: data.nombre
                }, {
                    where: {
                        id: data.idAlbum,
                    },
                    transaction: transaction
                });
                let album = yield Album_1.Album.findOne({
                    where: {
                        id: data.idAlbum,
                    },
                    transaction: transaction
                });
                yield transaction.commit();
                return res.status(201).send({ error: false, message: 'Se actualizo album correctamente', result: album });
            }
            catch (error) {
                yield transaction.rollback();
                return res.status(500).send({ error: true, message: error.message });
            }
        });
    }
    deleteAlbum(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction = yield sequalize_1.sequelize.transaction();
            try {
                let params = req.params;
                yield Album_1.Album.destroy({
                    where: {
                        id: params.idAlbum,
                    },
                    transaction: transaction
                });
                yield transaction.commit();
                return res.status(201).send({ error: false, message: 'Se album se borro correctamente', result: true });
            }
            catch (error) {
                yield transaction.rollback();
                return res.status(500).send({ error: true, message: error.message });
            }
        });
    }
    getAlbum(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction = yield sequalize_1.sequelize.transaction();
            try {
                let params = req.params;
                let album = yield Album_1.Album.findOne({
                    where: {
                        id: params.idAlbum,
                    },
                    transaction: transaction
                });
                if (!album)
                    throw new Error('No se encontró el album');
                yield transaction.commit();
                return res.status(201).send({ error: false, message: 'Se encontró el album', result: album });
            }
            catch (error) {
                yield transaction.rollback();
                return res.status(500).send({ error: true, message: error.message });
            }
        });
    }
    getAlbums(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction = yield sequalize_1.sequelize.transaction();
            try {
                let params = req.params;
                let albums = yield Album_1.Album.findAll({
                    where: {
                        IdUsuario: params.idUsuario,
                    },
                    include: [
                        {
                            model: DetalleFoto_1.DetalleFoto,
                            include: [
                                { model: Foto_1.Foto }
                            ]
                        }
                    ],
                    transaction: transaction
                });
                yield transaction.commit();
                return res.status(201).send({ error: false, message: 'Se encontró el album', result: albums });
            }
            catch (error) {
                yield transaction.rollback();
                return res.status(500).send({ error: true, message: error.message });
            }
        });
    }
}
exports.default = AlbumController;
AlbumController.instance = new AlbumController();
