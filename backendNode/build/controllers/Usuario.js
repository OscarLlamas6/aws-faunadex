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
const Usuario_1 = require("../models/Usuario");
const awsService_1 = __importDefault(require("../services/awsService"));
const passwordUtil_1 = __importDefault(require("../utils/passwordUtil"));
const Album_1 = require("../models/Album");
const Foto_1 = require("../models/Foto");
class UsuarioController {
    constructor() {
        this.getUsuarios = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let result = {
                    nombre: "Seminario",
                };
                return res.status(201).send({ error: false, result: result });
            }
            catch (error) {
                return res.status(500).send({ error: true, message: error.message });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction = yield sequalize_1.sequelize.transaction();
            try {
                let data = req.body;
                const usuario = yield Usuario_1.Usuario.findOne({
                    where: {
                        userName: data.userName,
                    },
                    transaction: transaction
                });
                if (!usuario)
                    throw new Error('Este usuario aun no esta registrado');
                let matchPasword = passwordUtil_1.default.instance.comparePassword(data.password, usuario.password);
                if (!matchPasword)
                    throw new Error('Contraseña incorrecta');
                usuario.password = '';
                yield transaction.commit();
                return res.status(201).send({ error: false, message: 'Login exitoso', result: usuario });
            }
            catch (error) {
                yield transaction.rollback();
                return res.status(500).send({ error: true, message: error.message });
            }
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction = yield sequalize_1.sequelize.transaction();
            try {
                let data = req.body;
                const usuarioEncontrado = yield Usuario_1.Usuario.findOne({
                    where: {
                        userName: data.userName,
                    },
                    transaction: transaction
                });
                if (usuarioEncontrado)
                    throw new Error('Este username ya existe');
                let passEncryptada = passwordUtil_1.default.instance.encryptPassword(data.password);
                let linkFotoS3;
                if (data.linkFotoPerfil)
                    linkFotoS3 = yield awsService_1.default.instance.uploadFoto(data.linkFotoPerfil);
                const usuario = yield Usuario_1.Usuario.create({
                    userName: data.userName,
                    nombre: data.nombre,
                    password: passEncryptada,
                    linkFotoPerfil: linkFotoS3.Location ? linkFotoS3.Location : ''
                }, { transaction: transaction });
                //Se crea el album 'FotosPerfil' por default al crearse el usuario
                const album = yield Album_1.Album.create({
                    nombre: 'FotosPerfil',
                    IdUsuario: data.idUsuario
                }, { transaction: transaction });
                //Se crea foto que ira en el album de fotos de perfil del usuario
                const foto = yield Foto_1.Foto.create({
                    nombre: '',
                    IdAlbum: album.id,
                    link: linkFotoS3.Location ? linkFotoS3.Location : ''
                }, { transaction: transaction });
                yield transaction.commit();
                return res.status(201).send({ error: false, mensaje: 'Registro exitoso', result: true });
            }
            catch (error) {
                yield transaction.rollback();
                return res.status(500).send({ error: true, message: error.message });
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction = yield sequalize_1.sequelize.transaction();
            try {
                let data = req.body;
                let usuario = yield Usuario_1.Usuario.findOne({
                    where: {
                        id: data.usuarioId,
                    },
                    transaction: transaction
                });
                if (!usuario)
                    throw new Error('Este usuario aun no esta registrado');
                let matchPasword = passwordUtil_1.default.instance.comparePassword(data.password, usuario.password);
                if (!matchPasword)
                    throw new Error('Contraseña incorrecta');
                let passEncryptada = passwordUtil_1.default.instance.encryptPassword(data.password);
                yield Usuario_1.Usuario.update({
                    userName: data.userName,
                    nombre: data.nombre,
                    password: passEncryptada,
                    linkFotoPerfil: data.linkFotoPerfil
                }, {
                    where: {
                        id: data.usuarioId,
                    },
                    transaction: transaction
                });
                usuario = yield Usuario_1.Usuario.findOne({
                    where: {
                        id: data.usuarioId,
                    },
                    transaction: transaction
                });
                yield transaction.commit();
                return res.status(201).send({ error: false, message: 'Se actualizo usuario correctamente', result: usuario });
            }
            catch (error) {
                yield transaction.rollback();
                return res.status(500).send({ error: true, message: error.message });
            }
        });
    }
    updateFotoPerfil(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction = yield sequalize_1.sequelize.transaction();
            try {
                let data = req.body;
                let linkFotoS3;
                if (data.linkFotoPerfil)
                    linkFotoS3 = yield awsService_1.default.instance.uploadFoto(data.linkFotoPerfil);
                yield Usuario_1.Usuario.update({
                    linkFotoPerfil: linkFotoS3.Location ? linkFotoS3.Location : ''
                }, {
                    where: {
                        id: data.usuarioId,
                    },
                    transaction: transaction
                });
                const albumEncontrado = yield Album_1.Album.findOne({
                    where: {
                        nombre: 'FotosPerfil',
                        IdUsuario: data.usuarioId
                    },
                    transaction: transaction
                });
                if (!albumEncontrado)
                    throw new Error("No se encontró album de fotos de perfil");
                const foto = yield Foto_1.Foto.create({
                    nombre: '',
                    IdAlbum: albumEncontrado.id,
                    link: linkFotoS3.Location ? linkFotoS3.Location : ''
                }, { transaction: transaction });
                yield transaction.commit();
                return res.status(201).send({ error: false, message: 'Se actualizo usuario correctamente', result: linkFotoS3.Location });
            }
            catch (error) {
                yield transaction.rollback();
                return res.status(500).send({ error: true, message: error.message });
            }
        });
    }
}
exports.default = UsuarioController;
UsuarioController.instance = new UsuarioController();
