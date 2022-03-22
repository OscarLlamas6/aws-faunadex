import { Model, Column, Table, CreatedAt, UpdatedAt, DataType, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Album } from './Album'
import { Foto } from './Foto'

interface Attributes {
    id?: number;
    IdFoto: number;
    IdAlbum: number;
}

@Table({
    tableName: 'DetalleFoto',
    timestamps: true,
})

export class DetalleFoto extends Model<DetalleFoto, Attributes> {

    // Fechas de registro
    @CreatedAt
    @Column({ allowNull: false, type: DataType.DATE })
    createdAt!: Date;

    @UpdatedAt
    @Column({ allowNull: false, type: DataType.DATE })
    updatedAt!: Date;

    //LLAVE FORANEA ALBUM
    @ForeignKey(() => Album)
    @Column({ allowNull: false, type: DataType.INTEGER })
    IdAlbum?: number;

    @BelongsTo(() => Album)
    album?: Album;

     //LLAVE FORANEA Foto
     @ForeignKey(() => Foto)
     @Column({ allowNull: false, type: DataType.INTEGER })
     IdFoto?: number;
 
     @BelongsTo(() => Foto)
     foto?: Foto;
}