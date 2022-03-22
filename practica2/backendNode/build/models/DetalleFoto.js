"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DetalleFoto = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Album_1 = require("./Album");
const Foto_1 = require("./Foto");
let DetalleFoto = class DetalleFoto extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.CreatedAt,
    (0, sequelize_typescript_1.Column)({ allowNull: false, type: sequelize_typescript_1.DataType.DATE })
], DetalleFoto.prototype, "createdAt", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    (0, sequelize_typescript_1.Column)({ allowNull: false, type: sequelize_typescript_1.DataType.DATE })
], DetalleFoto.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Album_1.Album),
    (0, sequelize_typescript_1.Column)({ allowNull: false, type: sequelize_typescript_1.DataType.INTEGER })
], DetalleFoto.prototype, "IdAlbum", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Album_1.Album)
], DetalleFoto.prototype, "album", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Foto_1.Foto),
    (0, sequelize_typescript_1.Column)({ allowNull: false, type: sequelize_typescript_1.DataType.INTEGER })
], DetalleFoto.prototype, "IdFoto", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Foto_1.Foto)
], DetalleFoto.prototype, "foto", void 0);
DetalleFoto = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'DetalleFoto',
        timestamps: true,
    })
], DetalleFoto);
exports.DetalleFoto = DetalleFoto;
