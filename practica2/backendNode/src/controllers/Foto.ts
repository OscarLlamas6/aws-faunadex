import { sequelize } from '../sequalize'
import { Foto } from '../models/Foto'
import { Album } from '../models/Album'
import { DetalleFoto } from '../models/DetalleFoto'
import AwsService from '../services/awsService'

export default class FotoController {

    static instance = new FotoController()

    async createFoto(req: any, res: any) {
        let transaction = await sequelize.transaction()
        try {
            let data = req.body

            const fotoEcontrada: Foto | null = await Foto.findOne({
                where: {
                    nombre: data.nombre,
                    IdAlbum: data.idAlbum,
                },
                transaction: transaction
            })

            if (fotoEcontrada) throw new Error('Ya existe una foto con este nombre en este album');

            let linkFotoS3 = await AwsService.instance.uploadFoto(data.linkFoto, false)

            const foto: Foto = await Foto.create({
                nombre: data.nombre,
                IdAlbum: data.idAlbum,
                link: linkFotoS3.Location ? linkFotoS3.Location : ''
            },
                { transaction: transaction }
            )
            await transaction.commit()
            return res.status(201).send({ error: false, message: 'Se subió foto correctamente', result: foto });
        } catch (error: any) {
            await transaction.rollback()
            return res.status(500).send({ error: true, message: error.message });
        }
    }

    async getFotos(req: any, res: any) {
        let transaction = await sequelize.transaction()
        try {
            let params = req.params

            let fotos: Foto[] | null = await Foto.findAll({
                where: {
                    IdAlbum: params.idAlbum,
                },
                transaction: transaction
            })

            await transaction.commit()
            return res.status(201).send({ error: false, message: 'Se encontró el album', result: fotos });
        } catch (error: any) {
            await transaction.rollback()
            return res.status(500).send({ error: true, message: error.message });
        }
    }

    async getTextImagen(req: any, res: any) {
        try {
            let data = req.body

            let text = await AwsService.instance.getTextImagen(data.imagenBase64)

            return res.status(201).send({ error: false, message: 'Se extrajo el texto exitosamente', result: text });
        } catch (error: any) {
            return res.status(500).send({ error: true, message: error.message });
        }
    }

    async translateDescripcionImagen(req: any, res: any) {
        try {
            let data = req.body

            let tranduccion = await AwsService.instance.translate(data.idioma, data.texto)

            return res.status(201).send({ error: false, message: 'Se tradujo el texto exitosamente', result: tranduccion });
        } catch (error: any) {
            return res.status(500).send({ error: true, message: error.message });
        }
    }

    async createFotoAnimal(req: any, res: any) {
        let transaction = await sequelize.transaction()
        try {
            let data = req.body

            let linkFotoS3 = await AwsService.instance.uploadFoto(data.imagenBase64, false)

            const foto: Foto = await Foto.create({
                nombre: data.nombre,
                link: linkFotoS3.Location ? linkFotoS3.Location : '',
                descripcion: data.descripcion
            },
                { transaction: transaction }
            )

            let tags = await AwsService.instance.getTagsImagen(data.imagenBase64, true)

            if (!tags || !tags.Labels) throw new Error("No se encontraron tags");


            for (const element of tags.Labels) {

                const albumEncontrado: Album | null = await Album.findOne({
                    where: {
                        nombre: element.Name,
                        IdUsuario: data.idUsuario,
                    },
                    transaction: transaction
                })

                if (albumEncontrado) {
                    await DetalleFoto.create({
                        IdAlbum: albumEncontrado.id,
                        IdFoto: foto.id
                    },
                        { transaction: transaction }
                    )
                } else {
                    const albumNuevo: Album = await Album.create({
                        nombre: element.Name ? element.Name : '',
                        IdUsuario: data.idUsuario
                    },
                        { transaction: transaction }
                    )

                    await DetalleFoto.create({
                        IdAlbum: albumNuevo.id,
                        IdFoto: foto.id
                    },
                        { transaction: transaction }
                    )
                }
            }

            // const albumEncontrado: number = await Album.count({
            //     where: {
            //         nombre: element.Name,
            //         IdUsuario: data.idUsuario,
            //     },
            //     transaction: transaction
            // })

            // if (albumEncontrado) {
            // await DetalleFoto.create({
            //     IdAlbum: albumEncontrado.id,
            //     IdFoto: foto.id
            // },
            //     { transaction: transaction }
            // )
            // } else {
            //     const albumNuevo: Album = await Album.create({
            //         nombre: element.Name ? element.Name : '',
            //         IdUsuario: data.idUsuario
            //     },
            //         { transaction: transaction }
            //     )

            //     // await DetalleFoto.create({
            //     //     IdAlbum: albumNuevo.id,
            //     //     IdFoto: foto.id
            //     // },
            //     //     { transaction: transaction }
            //     // )
            // }


            await transaction.commit()
            return res.status(201).send({ error: false, message: 'Se subió foto correctamente', result: tags });
        } catch (error: any) {
            await transaction.rollback()
            return res.status(500).send({ error: true, message: error.message });
        }
    }

}