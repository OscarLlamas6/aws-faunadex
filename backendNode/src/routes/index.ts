import { Router } from "express";
import { Usuario } from '../routes/Usuario'
import { Album } from '../routes/Album'
import { Foto } from '../routes/Foto'

class IndexRoutes {
    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.use('/usuario', Usuario)
        this.router.use('/album', Album)
        this.router.use('/foto', Foto)
        this.router.get('/', (req, res) => {
            res.send({
                Instancia: 'NodeJs'
            })
        })
    }
}

const indexRoutes = new IndexRoutes();
indexRoutes.routes();

export default indexRoutes.router;
