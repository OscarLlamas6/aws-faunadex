"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const sequalize_1 = require("./sequalize");
var cors = require('cors');
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.app.use(cors());
        this.config();
        this.routes();
    }
    config() {
        this.app.set('port', process.env.PORT || 4000);
        this.app.use(express_1.default.urlencoded({ limit: '10mb', extended: false }));
        this.app.use(express_1.default.json({ limit: '10mb' }));
    }
    routes() {
        this.app.use('/', index_1.default);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}
const server = new Server();
sequalize_1.sequelize.sync().then(function () {
    server.start();
});
