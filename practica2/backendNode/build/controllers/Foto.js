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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequalize_1 = require("../sequalize");
const Foto_1 = require("../models/Foto");
const Album_1 = require("../models/Album");
const DetalleFoto_1 = require("../models/DetalleFoto");
const awsService_1 = __importDefault(require("../services/awsService"));
class FotoController {
    createFoto(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction = yield sequalize_1.sequelize.transaction();
            try {
                let data = req.body;
                const fotoEcontrada = yield Foto_1.Foto.findOne({
                    where: {
                        nombre: data.nombre,
                        IdAlbum: data.idAlbum,
                    },
                    transaction: transaction
                });
                if (fotoEcontrada)
                    throw new Error('Ya existe una foto con este nombre en este album');
                let linkFotoS3 = yield awsService_1.default.instance.uploadFoto(data.linkFoto, false);
                const foto = yield Foto_1.Foto.create({
                    nombre: data.nombre,
                    IdAlbum: data.idAlbum,
                    link: linkFotoS3.Location ? linkFotoS3.Location : ''
                }, { transaction: transaction });
                yield transaction.commit();
                return res.status(201).send({ error: false, message: 'Se subió foto correctamente', result: foto });
            }
            catch (error) {
                yield transaction.rollback();
                return res.status(500).send({ error: true, message: error.message });
            }
        });
    }
    getFotos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction = yield sequalize_1.sequelize.transaction();
            try {
                let params = req.params;
                let fotos = yield Foto_1.Foto.findAll({
                    where: {
                        IdAlbum: params.idAlbum,
                    },
                    transaction: transaction
                });
                yield transaction.commit();
                return res.status(201).send({ error: false, message: 'Se encontró el album', result: fotos });
            }
            catch (error) {
                yield transaction.rollback();
                return res.status(500).send({ error: true, message: error.message });
            }
        });
    }
    getTextImagen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = req.body;
                let text = yield awsService_1.default.instance.getTextImagen(data.imagenBase64);
                return res.status(201).send({ error: false, message: 'Se extrajo el texto exitosamente', result: text });
            }
            catch (error) {
                return res.status(500).send({ error: true, message: error.message });
            }
        });
    }
    translateDescripcionImagen(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = req.body;
                let tranduccion = yield awsService_1.default.instance.translate(data.idioma, data.texto);
                return res.status(201).send({ error: false, message: 'Se extrajo el texto exitosamente', result: tranduccion });
            }
            catch (error) {
                return res.status(500).send({ error: true, message: error.message });
            }
        });
    }
    createFotoAnimal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction = yield sequalize_1.sequelize.transaction();
            try {
                let data = req.body;
                let linkFotoS3 = yield awsService_1.default.instance.uploadFoto(data.imagenBase64, false);
                const foto = yield Foto_1.Foto.create({
                    nombre: data.nombre,
                    link: linkFotoS3.Location ? linkFotoS3.Location : '',
                    descripcion: data.descripcion
                }, { transaction: transaction });
                let tags = yield awsService_1.default.instance.getTagsImagen(data.imagenBase64, true);
                if (!tags || !tags.Labels)
                    throw new Error("No se encontraron tags");
                for (const element of tags.Labels) {
                    const albumEncontrado = yield Album_1.Album.findOne({
                        where: {
                            nombre: element.Name,
                            IdUsuario: data.idUsuario,
                        },
                        transaction: transaction
                    });
                    if (albumEncontrado) {
                        yield DetalleFoto_1.DetalleFoto.create({
                            IdAlbum: albumEncontrado.id,
                            IdFoto: foto.id
                        }, { transaction: transaction });
                    }
                    else {
                        const albumNuevo = yield Album_1.Album.create({
                            nombre: element.Name ? element.Name : '',
                            IdUsuario: data.idUsuario
                        }, { transaction: transaction });
                        yield DetalleFoto_1.DetalleFoto.create({
                            IdAlbum: albumNuevo.id,
                            IdFoto: foto.id
                        }, { transaction: transaction });
                    }
                }
                // const albumEncontrado: number = await Album.count({
                //     where: {
                //         nombre: element.Name,
                //         IdUsuario: data.idUsuario,
                //     },
                //     transaction: transaction
                // })
                // if (albumEncontrado) {
                // await DetalleFoto.create({
                //     IdAlbum: albumEncontrado.id,
                //     IdFoto: foto.id
                // },
                //     { transaction: transaction }
                // )
                // } else {
                //     const albumNuevo: Album = await Album.create({
                //         nombre: element.Name ? element.Name : '',
                //         IdUsuario: data.idUsuario
                //     },
                //         { transaction: transaction }
                //     )
                //     // await DetalleFoto.create({
                //     //     IdAlbum: albumNuevo.id,
                //     //     IdFoto: foto.id
                //     // },
                //     //     { transaction: transaction }
                //     // )
                // }
                yield transaction.commit();
                return res.status(201).send({ error: false, message: 'Se subió foto correctamente', result: tags });
            }
            catch (error) {
                yield transaction.rollback();
                return res.status(500).send({ error: true, message: error.message });
            }
        });
    }
}
exports.default = FotoController;
FotoController.instance = new FotoController();
