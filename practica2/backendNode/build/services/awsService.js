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
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const uuid_1 = require("uuid");
const BUCKET_NAME = 'semi1practica1';
aws_sdk_1.default.config.region = 'us-east-2';
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.S3AKI,
    secretAccessKey: process.env.S3SAK,
});
const rekognition = new aws_sdk_1.default.Rekognition({
    accessKeyId: process.env.REKAKI,
    secretAccessKey: process.env.REKAK,
});
const translate = new aws_sdk_1.default.Translate({
    accessKeyId: process.env.TRANSLATEAKI,
    secretAccessKey: process.env.TRANSLATESAK,
});
class AwsService {
    constructor() {
        this.translate = (idioma, text) => __awaiter(this, void 0, void 0, function* () {
            let tranduccion = yield translate.translateText({
                Text: text,
                SourceLanguageCode: 'es',
                TargetLanguageCode: idioma
            }).promise();
            return tranduccion;
        });
        this.uploadFoto = (foto, esPerfil) => __awaiter(this, void 0, void 0, function* () {
            let buff = Buffer.from(foto, 'base64');
            let id = (0, uuid_1.v4)();
            let name = esPerfil ? 'Fotos_Perfil/' + id + '.jpg' : 'Fotos_Publicadas/' + id + '.jpg';
            // Setting up S3 upload parameters
            const params = {
                Bucket: BUCKET_NAME,
                Key: name,
                Body: buff,
            };
            let data = yield s3.upload(params).promise();
            return data;
        });
        this.compararImagen = (pathFotoPerfil, fotoACompararBytes) => __awaiter(this, void 0, void 0, function* () {
            let buff = Buffer.from(fotoACompararBytes, 'base64');
            let comparacion = yield rekognition.compareFaces({
                SimilarityThreshold: 90,
                SourceImage: {
                    S3Object: {
                        Bucket: 'semi1practica1',
                        Name: pathFotoPerfil,
                    }
                },
                TargetImage: {
                    Bytes: buff
                }
            }).promise();
            return comparacion;
        });
        this.getTagsImagen = (pathFotoPerfil, esBase64) => __awaiter(this, void 0, void 0, function* () {
            let imagen;
            if (esBase64) {
                let buff = Buffer.from(pathFotoPerfil, 'base64');
                imagen = {
                    Bytes: buff
                };
            }
            else {
                imagen = {
                    S3Object: {
                        Bucket: 'semi1practica1',
                        Name: pathFotoPerfil,
                    }
                };
            }
            let labels = yield rekognition.detectLabels({
                Image: imagen
            }).promise();
            return labels;
        });
        this.getTextImagen = (fotoEnBytes) => __awaiter(this, void 0, void 0, function* () {
            let buff = Buffer.from(fotoEnBytes, 'base64');
            let text = yield rekognition.detectText({
                Image: {
                    Bytes: buff
                }
            }).promise();
            return text;
        });
    }
}
exports.default = AwsService;
AwsService.instance = new AwsService();
