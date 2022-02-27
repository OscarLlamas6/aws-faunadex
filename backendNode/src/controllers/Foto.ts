import { sequelize } from '../sequalize'
import { Foto } from '../models/Foto'
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

            let linkFotoS3 = await AwsService.instance.uploadFoto(data.linkFoto)

            const foto: Foto = await Foto.create({
                nombre: data.nombre,
                IdAlbum: data.idAlbum,
                link: linkFotoS3
            },
                { transaction: transaction }
            )
            await transaction.commit()
            return res.status(201).send({ error: false, result: foto });
        } catch (error: any) {
            await transaction.rollback()
            return res.status(500).send({ error: true, message: error.message });
        }
    }

    async getFotos(req: any, res: any) {
        let transaction = await sequelize.transaction()
        try {
            let params = req.params

            let album: Foto | null = await Foto.findOne({
                where: {
                    IdAlbum: params.idAlbum,
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
}