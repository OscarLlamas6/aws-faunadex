import { Model, Column, Table, CreatedAt, UpdatedAt, DataType, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Album } from './Album'
import { DetalleFoto } from './DetalleFoto'

interface Attributes {
    id?: number;
    nombre: string;
    descripcion?: string
    link: string;
    IdAlbum?: number;
    DetalleFoto?: DetalleFoto[]
}

@Table({
    tableName: 'Fotos',
    timestamps: true,
})

export class Foto extends Model<Foto, Attributes> {

    @Column({ allowNull: false, type: DataType.STRING })
    nombre!: string;

    @Column({ allowNull: true, type: DataType.STRING })
    descripcion?: string;

    @Column({ allowNull: false, type: DataType.STRING })
    link!: string;

    // Fechas de registro
    @CreatedAt
    @Column({ allowNull: false, type: DataType.DATE })
    createdAt!: Date;

    @UpdatedAt
    @Column({ allowNull: false, type: DataType.DATE })
    updatedAt!: Date;

    //LLAVE FORANEA USUARIO
    @ForeignKey(() => Album)
    @Column({ allowNull: true, type: DataType.INTEGER })
    IdAlbum?: number;

    @BelongsTo(() => Album)
    album?: Album;

    // DetallesFoto
    @HasMany(() => DetalleFoto)
    DetalleFoto?: DetalleFoto[];
}