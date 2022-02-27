import { Router } from 'express';
import controller from '../controllers/Foto'

export const Album = Router();

Album.post('/subirFoto', function (req, res) { // TODO: Seguridad de endpoint
    controller.instance.createFoto(req, res)
});

Album.get('/getFotos/:idAlbum', function (req, res) { // TODO: Seguridad de endpoint
    controller.instance.getFotos(req, res)
});