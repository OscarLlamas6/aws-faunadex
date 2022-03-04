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
                let linkFotoS3 = yield awsService_1.default.instance.uploadFoto(data.linkFoto);
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
}
exports.default = FotoController;
FotoController.instance = new FotoController();
