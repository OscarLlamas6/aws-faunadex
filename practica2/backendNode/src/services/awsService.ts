import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const BUCKET_NAME = 'semi1practica1';

AWS.config.region = 'us-east-2'

const s3 = new AWS.S3({
    accessKeyId: process.env.S3AKI,
    secretAccessKey: process.env.S3SAK,
});

const rekognition = new AWS.Rekognition({
    accessKeyId: process.env.REKAKI,
    secretAccessKey: process.env.REKAK,
})

const translate = new AWS.Translate({
    accessKeyId: process.env.REKAKI,
    secretAccessKey: process.env.REKAK,
})

export default class AwsService {

    static instance = new AwsService()

    translate = async (idioma: any, text: any) => {

        let tranduccion = await translate.translateText({
            Text: text,
            SourceLanguageCode: 'es',
            TargetLanguageCode: idioma
        }).promise()

        return tranduccion
    };

    uploadFoto = async (foto: any, esPerfil: boolean) => {

        let buff = Buffer.from(foto, 'base64')

        let id = uuidv4()

        let name = esPerfil ? 'Fotos_Perfil/' + id + '.jpg' : 'Fotos_Publicadas/' + id + '.jpg'

        // Setting up S3 upload parameters
        const params = {
            Bucket: BUCKET_NAME,
            Key: name, // File name you want to save as in S3
            Body: buff,
        };

        let data = await s3.upload(params).promise()

        return data
    };

    compararImagen = async (pathFotoPerfil: any, fotoACompararBytes: any) => {

        let buff = Buffer.from(fotoACompararBytes, 'base64')

        let comparacion = await rekognition.compareFaces({
            SimilarityThreshold: 90,
            SourceImage: {
                S3Object: {
                    Bucket: 'semi1practica1',
                    Name: pathFotoPerfil,
                }
            },
            TargetImage: {
                Bytes: buff
            }
        }).promise()

        return comparacion
    };

    getTagsImagen = async (pathFotoPerfil: any, esBase64: boolean) => {

        let imagen;

        if (esBase64) {
            let buff = Buffer.from(pathFotoPerfil, 'base64')
            imagen = {
                Bytes: buff
            }
        } else {
            imagen = {
                S3Object: {
                    Bucket: 'semi1practica1',
                    Name: pathFotoPerfil,
                }
            }
        }

        let labels = await rekognition.detectLabels({
            Image: imagen
        }).promise()

        return labels
    };

    getTextImagen = async (fotoEnBytes: any) => {

        let buff = Buffer.from(fotoEnBytes, 'base64')

        let text = await rekognition.detectText({
            Image: {
                Bytes: buff
            }
        }).promise()

        return text
    };

}