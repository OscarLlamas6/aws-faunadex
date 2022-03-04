import { sequelize } from '../sequalize'
import { Usuario } from '../models/Usuario'
import AwsService from '../services/awsService'
import passwordUtil from '../utils/passwordUtil'

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
            if (data.linkFotoPerfil) linkFotoS3 = await AwsService.instance.uploadFoto(data.linkFotoPerfil)

            console.log('LINK')
            console.log(linkFotoS3)

            const usuario: Usuario = await Usuario.create({
                userName: data.userName,
                nombre: data.nombre,
                password: passEncryptada,
                linkFotoPerfil: linkFotoS3.Location ? linkFotoS3.Location : ''
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
                    id: data.usuarioId,
                },
                transaction: transaction
            })

            if (!usuario) throw new Error('Este usuario aun no esta registrado');

            let matchPasword: boolean = passwordUtil.instance.comparePassword(data.password, usuario.password)

            if (!matchPasword) throw new Error('Contraseña incorrecta');

            let passEncryptada: string = passwordUtil.instance.encryptPassword(data.password)

            await Usuario.update({
                userName: data.userName,
                nombre: data.nombre,
                password: passEncryptada,
                linkFotoPerfil: data.linkFotoPerfil
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

}