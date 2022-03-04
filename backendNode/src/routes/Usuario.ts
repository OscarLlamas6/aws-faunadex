import { Router } from 'express';
import controller from '../controllers/Usuario'

export const Usuario = Router();

Usuario.get('/', function (req, res) { // TODO: Seguridad de endpoint
    controller.instance.getUsuarios(req, res)
});

Usuario.post('/login', function (req, res) { // TODO: Seguridad de endpoint
    controller.instance.login(req, res)
});

Usuario.post('/registro', function (req, res) { // TODO: Seguridad de endpoint
    controller.instance.createUser(req, res)
});

Usuario.put('/updateUsuario', function (req, res) { // TODO: Seguridad de endpoint
    controller.instance.updateUser(req, res)
});