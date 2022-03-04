"use strict";
//import { Sequelize } from 'sequelize-typescript';
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let username = process.env.DB_USER || 'root';
let password = process.env.DB_PASSWORD || 'Campos1100#';
let host = process.env.DB_HOST || 'localhost';
let database = process.env.DB_DATABASE || 'semi1practica1';
exports.sequelize = new sequelize_typescript_1.Sequelize({
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
