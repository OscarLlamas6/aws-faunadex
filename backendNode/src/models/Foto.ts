import { Model, Column, Table, CreatedAt, UpdatedAt, DataType, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Album } from './Album'

interface Attributes {
    id?: number;
    nombre: string;
    link: string;
    IdAlbum: number;
}

@Table({
    tableName: 'Fotos',
    timestamps: true,
})

export class Foto extends Model<Foto, Attributes> {

    @Column({ allowNull: false, type: DataType.STRING })
    nombre!: string;

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
    @Column({ allowNull: false, type: DataType.INTEGER })
    IdAlbum?: number;

    @BelongsTo(() => Album)
    album?: Album;
}