import { Router } from 'express';
import controller from '../controllers/Album'

export const Album = Router();

Album.post('/crearAlbum', function (req, res) { // TODO: Seguridad de endpoint
    controller.instance.createAlbum(req, res)
});

Album.put('/editarAlbum', function (req, res) { // TODO: Seguridad de endpoint
    controller.instance.updateAlbum(req, res)
});

Album.delete('/eliminarAlbum/:idAlbum', function (req, res) { // TODO: Seguridad de endpoint
    controller.instance.deleteAlbum(req, res)
});

Album.get('/getAlbum/:idAlbum', function (req, res) { // TODO: Seguridad de endpoint
    controller.instance.getAlbum(req, res)
});

Album.get('/getAlbums/:idUsuario', function (req, res) { // TODO: Seguridad de endpoint
    controller.instance.getAlbums(req, res)
});