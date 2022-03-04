//import { Sequelize } from 'sequelize-typescript';

import { Sequelize } from 'sequelize-typescript'

let username = process.env.DB_USER || 'root'
let password = process.env.DB_PASSWORD || 'Campos1100#'
let host = process.env.DB_HOST || 'localhost'
let database = process.env.DB_DATABASE || 'semi1practica1'

export const sequelize = new Sequelize({
    username: username,
    password: password,
    host: host,
    database: database,
    port: 3306,
    storage: ':memory:',
    models: [__dirname + '/models'],
    dialect: 'mysql',
    timezone: '-06:00',
    sync: {
        alter: false,
    }
});