import express from 'express';
import indexRoutes from './routes/index';
import { sequelize } from './sequalize'

import { Usuario } from './models/Usuario'

var cors = require('cors')

class Server {

    public app: express.Application;

    constructor() {
        this.app = express()
        this.app.use(cors())
        this.config()
        this.routes()
    }

    config() {
        this.app.set('port', process.env.PORT || 4000)
        this.app.use(express.json())
    }

    routes() {
        this.app.use('/', indexRoutes)
    }

    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        })
    }
}

const server = new Server()
sequelize.sync().then(function () {
    server.start()
});