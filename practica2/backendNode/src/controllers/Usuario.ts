import { sequelize } from '../sequalize'
import { Usuario } from '../models/Usuario'
import AwsService from '../services/awsService'
import passwordUtil from '../utils/passwordUtil'
import { Album } from '../models/Album'
import { Foto } from '../models/Foto'
import { Op } from 'sequelize';

export default class UsuarioController {

    static instance = new UsuarioController()

    getUsuarios = async (req: any, res: any) => {
        try {
            let result = {
                nombre: "Seminario",
            }
            return res.status(201).send({ error: false, result: result });
        } catch (error: any) {
            return res.status(500).send({ error: true, message: error.message });
        }
    }

    async login(req: any, res: any) {
        let transaction = await sequelize.transaction()
        try {
            let data = req.body

            const usuario: Usuario | null = await Usuario.findOne({
                where: {
                    userName: data.userName,
                },
                transaction: transaction
            })

            if (!usuario) throw new Error('Este usuario aun no esta registrado');

            let matchPasword: boolean = passwordUtil.instance.comparePassword(data.password, usuario.password)

            if (!matchPasword) throw new Error('Contraseña incorrecta');

            usuario.password = ''

            await transaction.commit()
            return res.status(201).send({ error: false, message: 'Login exitoso', result: usuario });
        } catch (error: any) {
            await transaction.rollback()
            return res.status(500).send({ error: true, message: error.message });
        }
    }

    async createUser(req: any, res: any) {
        let transaction = await sequelize.transaction()
        try {
            let data = req.body

            const usuarioEncontrado: Usuario | null = await Usuario.findOne({
                where: {
                    userName: data.userName,
                },
                transaction: transaction
            })

            if (usuarioEncontrado) throw new Error('Este username ya existe');

            let passEncryptada: string = passwordUtil.instance.encryptPassword(data.password)

            let linkFotoS3;
            if (data.linkFotoPerfil) linkFotoS3 = await AwsService.instance.uploadFoto(data.linkFotoPerfil, true)

            const usuario: Usuario = await Usuario.create({
                userName: data.userName,
                nombre: data.nombre,
                password: passEncryptada,
                linkFotoPerfil: linkFotoS3.Location ? linkFotoS3.Location : ''
            },
                { transaction: transaction }
            )

            //Se crea el album 'FotosPerfil' por default al crearse el usuario
            const album: Album = await Album.create({
                nombre: 'FotosPerfil',
                IdUsuario: usuario.id
            },
                { transaction: transaction }
            )

            //Se crea foto que ira en el album de fotos de perfil del usuario
            const foto: Foto = await Foto.create({
                nombre: '',
                IdAlbum: album.id,
                link: linkFotoS3.Location ? linkFotoS3.Location : ''
            },
                { transaction: transaction }
            )

            await transaction.commit()
            return res.status(201).send({ error: false, mensaje: 'Registro exitoso', result: true });
        } catch (error: any) {
            await transaction.rollback()
            return res.status(500).send({ error: true, message: error.message });
        }
    }

    async updateUser(req: any, res: any) {
        let transaction = await sequelize.transaction()
        try {
            let data = req.body

            let usuario: Usuario | null = await Usuario.findOne({
                where: {
                    id: {
                        [Op.ne]: data.usuarioId,
                    },
                    userName: {
                        [Op.eq]: data.userName
                    }
                },
                transaction: transaction
            })

            if (usuario) throw new Error('Este username ya esta siendo utilizado');

            await Usuario.update({
                userName: data.userName,
                nombre: data.nombre
            },
                {
                    where: {
                        id: data.usuarioId,
                    },
                    transaction: transaction
                }
            )

            usuario = await Usuario.findOne({
                where: {
                    id: data.usuarioId,
                },
                transaction: transaction
            })

            await transaction.commit()
            return res.status(201).send({ error: false, message: 'Se actualizo usuario correctamente', result: usuario });
        } catch (error: any) {
            await transaction.rollback()
            return res.status(500).send({ error: true, message: error.message });
        }
    }

    async updateFotoPerfil(req: any, res: any) {
        let transaction = await sequelize.transaction()
        try {
            let data = req.body

            let linkFotoS3;
            if (data.linkFotoPerfil) linkFotoS3 = await AwsService.instance.uploadFoto(data.linkFotoPerfil, true)

            await Usuario.update({
                linkFotoPerfil: linkFotoS3.Location ? linkFotoS3.Location : ''
            },
                {
                    where: {
                        id: data.usuarioId,
                    },
                    transaction: transaction
                }
            )

            const albumEncontrado: Album | null = await Album.findOne({
                where: {
                    nombre: 'FotosPerfil',
                    IdUsuario: data.usuarioId
                },
                transaction: transaction
            })

            if (!albumEncontrado) throw new Error("No se encontró album de fotos de perfil");

            const foto: Foto = await Foto.create({
                nombre: '',
                IdAlbum: albumEncontrado.id,
                link: linkFotoS3.Location ? linkFotoS3.Location : ''
            },
                { transaction: transaction }
            )

            await transaction.commit()
            return res.status(201).send({ error: false, message: 'Se actualizo usuario correctamente', result: linkFotoS3.Location });
        } catch (error: any) {
            await transaction.rollback()
            return res.status(500).send({ error: true, message: error.message });
        }
    }

}