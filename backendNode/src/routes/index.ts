import { Router } from "express";
import { Usuario } from '../routes/Usuario'
import { Album } from '../routes/Album'

class IndexRoutes {
    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.use('/usuario', Usuario)
        this.router.use('/album', Album)
    }
}

const indexRoutes = new IndexRoutes();
indexRoutes.routes();

export default indexRoutes.router;
