import { Router } from 'express';
import controller from '../controllers/Foto'

export const Foto = Router();

Foto.post('/subirFoto', function (req, res) { // TODO: Seguridad de endpoint
    controller.instance.createFoto(req, res)
});

Foto.get('/getFotos/:idAlbum', function (req, res) { // TODO: Seguridad de endpoint
    controller.instance.getFotos(req, res)
});

Foto.post('/getTextImagen', function (req, res) { // TODO: Seguridad de endpoint
    controller.instance.getTextImagen(req, res)
});

Foto.post('/createFotoAnimal', function (req, res) { // TODO: Seguridad de endpoint
    controller.instance.createFotoAnimal(req, res)
});

Foto.post('/translateDescripcionImagen', function (req, res) { // TODO: Seguridad de endpoint
    controller.instance.translateDescripcionImagen(req, res)
});