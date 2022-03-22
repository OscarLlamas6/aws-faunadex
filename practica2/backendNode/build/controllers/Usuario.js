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
const sequelize_1 = require("sequelize");
class UsuarioController {
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
    loginFacial(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction = yield sequalize_1.sequelize.transaction();
            try {
                let data = req.body;
                const usuario = yield Usuario_1.Usuario.findOne({
                    where: {
                        userName: data.UserUsuario,
                    },
                    transaction: transaction
                });
                if (!usuario)
                    throw new Error("Este usuario no esta registrado");
                if (!usuario.linkFotoPerfil)
                    throw new Error("Este usuario no tiene foto de perfil");
                //se hace un split de la ruta de la foto de perfil
                let linkFotoPerfil = usuario.linkFotoPerfil.split('/');
                if (linkFotoPerfil.length == 0)
                    throw new Error("No se pudo realizar el reconocimiento facial");
                //aqui se hace el path con el cual rekognition ira a buscar la imagen al bucket -> fotosPerfil/imagen.jpg
                let pathFotoPerfil = `${linkFotoPerfil[linkFotoPerfil.length - 2]}/${linkFotoPerfil[linkFotoPerfil.length - 1]}`;
                //metodo para comparar imagenes, recibe como parametros el path de la foto de perfil y aparte la foto en bytes de la foto que se toma en el momento de hacer login
                let comparacion = yield awsService_1.default.instance.compararImagen(pathFotoPerfil, data.FotoBytes);
                if ((!comparacion.FaceMatches ||
                    comparacion.FaceMatches.length == 0)
                    ||
                        (!comparacion ||
                            !comparacion.FaceMatches ||
                            !comparacion.FaceMatches[0] ||
                            !comparacion.FaceMatches[0].Similarity ||
                            comparacion.FaceMatches[0].Similarity < 90))
                    throw new Error("Los rostros no coinciden");
                yield transaction.commit();
                return res.status(201).send({ error: false, mensaje: 'Registro exitoso', result: comparacion.FaceMatches });
            }
            catch (error) {
                yield transaction.rollback();
                return res.status(500).send({ error: true, message: error.message });
            }
        });
    }
    getTagsFotoPerfil(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let transaction = yield sequalize_1.sequelize.transaction();
            try {
                let { UsuarioId } = req.query;
                const usuario = yield Usuario_1.Usuario.findOne({
                    where: {
                        id: UsuarioId,
                    },
                    transaction: transaction
                });
                if (!usuario || !usuario.linkFotoPerfil)
                    throw new Error("Este usuario no tiene foto de perfil");
                //se hace un split de la ruta de la foto de perfil
                let linkFotoPerfil = usuario.linkFotoPerfil.split('/');
                if (linkFotoPerfil.length == 0)
                    throw new Error("No se pudo extraer tags de la imagen");
                //aqui se hace el path con el cual rekognition ira a buscar la imagen al bucket -> fotosPerfil/imagen.jpg
                let pathFotoPerfil = `${linkFotoPerfil[linkFotoPerfil.length - 2]}/${linkFotoPerfil[linkFotoPerfil.length - 1]}`;
                //metodo para comparar imagenes, recibe como parametros el path de la foto de perfil y aparte la foto en bytes de la foto que se toma en el momento de hacer login
                let comparacion = yield awsService_1.default.instance.getTagsImagen(pathFotoPerfil, false);
                yield transaction.commit();
                return res.status(201).send({ error: false, mensaje: 'Se extrajeron tags de imagen exitosamente', result: comparacion.Labels });
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
                    linkFotoS3 = yield awsService_1.default.instance.uploadFoto(data.linkFotoPerfil, true);
                const usuario = yield Usuario_1.Usuario.create({
                    userName: data.userName,
                    nombre: data.nombre,
                    password: passEncryptada,
                    linkFotoPerfil: linkFotoS3 && linkFotoS3.Location ? linkFotoS3.Location : ''
                }, { transaction: transaction });
                //Se crea el album 'FotosPerfil' por default al crearse el usuario
                const album = yield Album_1.Album.create({
                    nombre: 'FotosPerfil',
                    IdUsuario: usuario.id
                }, { transaction: transaction });
                //Se crea foto que ira en el album de fotos de perfil del usuario
                const foto = yield Foto_1.Foto.create({
                    nombre: '',
                    IdAlbum: album.id,
                    link: linkFotoS3 && linkFotoS3.Location ? linkFotoS3.Location : ''
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
                        id: {
                            [sequelize_1.Op.ne]: data.usuarioId,
                        },
                        userName: {
                            [sequelize_1.Op.eq]: data.userName
                        }
                    },
                    transaction: transaction
                });
                if (usuario)
                    throw new Error('Este username ya esta siendo utilizado');
                yield Usuario_1.Usuario.update({
                    userName: data.userName,
                    nombre: data.nombre
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
                    linkFotoS3 = yield awsService_1.default.instance.uploadFoto(data.linkFotoPerfil, true);
                yield Usuario_1.Usuario.update({
                    linkFotoPerfil: linkFotoS3 && linkFotoS3.Location ? linkFotoS3.Location : ''
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
                    link: linkFotoS3 && linkFotoS3.Location ? linkFotoS3.Location : ''
                }, { transaction: transaction });
                yield transaction.commit();
                return res.status(201).send({ error: false, message: 'Se actualizo usuario correctamente', result: foto.link });
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
