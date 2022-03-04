const AWS = require('aws-sdk');
import { v4 as uuidv4 } from 'uuid';

const BUCKET_NAME = 'semi1practica1';

const s3 = new AWS.S3({
    accessKeyId: 'AKIAYGZNMTQHBZ66O3EB',
    secretAccessKey: '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',
});

export default class AwsService {

    static instance = new AwsService()

    uploadFoto = async (foto: any, ext = '.jpg') => {

        let buff = Buffer.from(foto, 'base64')

        let id = uuidv4()

        let name = id + ext

        // Setting up S3 upload parameters
        const params = {
            Bucket: BUCKET_NAME,
            Key: name, // File name you want to save as in S3
            Body: buff,
        };

        let data = await s3.upload(params).promise()

        return data
    };
}