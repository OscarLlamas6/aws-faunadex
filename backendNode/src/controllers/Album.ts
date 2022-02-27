import { sequelize } from '../sequalize'
import { Album } from '../models/Album'
import { Usuario } from '../models/Usuario'

export default class AlbumController {

    static instance = new AlbumController()

    async createAlbum(req: any, res: any) {
        let transaction = await sequelize.transaction()
        try {
            let data = req.body

            const albumEncontrado: Album | null = await Album.findOne({
                where: {
                    nombre: data.nombre,
                    IdUsuario: data.idUsuario
                },
                transaction: transaction
            })

            if (albumEncontrado) throw new Error('Ya existe un album con este nombre');


            const album: Album = await Album.create({
                nombre: data.nombre,
                IdUsuario: data.idUsuario
            },
                { transaction: transaction }
            )
            await transaction.commit()
            return res.status(201).send({ error: false, result: true, album: album });
        } catch (error: any) {
            await transaction.rollback()
            return res.status(500).send({ error: true, message: error.message });
        }
    }

    async updateAlbum(req: any, res: any) {
        let transaction = await sequelize.transaction()
        try {
            let data = req.body

            await Album.update({
                nombre: data.nombre
            },
                {
                    where: {
                        id: data.idAlbum,
                    },
                    transaction: transaction
                }
            )

            let album: Album | null = await Album.findOne({
                where: {
                    id: data.idAlbum,
                },
                transaction: transaction
            })

            await transaction.commit()
            return res.status(201).send({ error: false, message: 'Se actualizo usuario correctamente', result: true, album: album });
        } catch (error: any) {
            await transaction.rollback()
            return res.status(500).send({ error: true, message: error.message });
        }
    }

    async deleteAlbum(req: any, res: any) {
        let transaction = await sequelize.transaction()
        try {
            let params = req.params

            await Album.destroy({
                where: {
                    id: params.idAlbum,
                },
                transaction: transaction
            })

            await transaction.commit()
            return res.status(201).send({ error: false, message: 'Se album se borro correctamente', result: true });
        } catch (error: any) {
            await transaction.rollback()
            return res.status(500).send({ error: true, message: error.message });
        }
    }

    async getAlbum(req: any, res: any) {
        let transaction = await sequelize.transaction()
        try {
            let params = req.params

            let album: Album | null = await Album.findOne({
                where: {
                    id: params.idAlbum,
                },
                transaction: transaction
            })

            if (!album) throw new Error('No se encontró el album');

            await transaction.commit()
            return res.status(201).send({ error: false, message: 'Se encontró el album', result: album });
        } catch (error: any) {
            await transaction.rollback()
            return res.status(500).send({ error: true, message: error.message });
        }
    }

    async getAlbums(req: any, res: any) {
        let transaction = await sequelize.transaction()
        try {
            let params = req.params

            let usuario: Usuario | null = await Usuario.findOne({
                where: {
                    id: params.idUsuario,
                },
                include: [
                    { model: Album }
                ],
                transaction: transaction
            })

            if (!usuario || !usuario.albums) throw new Error('No se pudieron traer los albums');

            await transaction.commit()
            return res.status(201).send({ error: false, message: 'Se encontró el album', result: usuario.albums });
        } catch (error: any) {
            await transaction.rollback()
            return res.status(500).send({ error: true, message: error.message });
        }
    }
}