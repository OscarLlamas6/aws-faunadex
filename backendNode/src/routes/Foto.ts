import { Router } from 'express';
import controller from '../controllers/Foto'

export const Foto = Router();

Foto.post('/subirFoto', function (req, res) { // TODO: Seguridad de endpoint
    controller.instance.createFoto(req, res)
});

Foto.get('/getFotos/:idAlbum', function (req, res) { // TODO: Seguridad de endpoint
    controller.instance.getFotos(req, res)
});