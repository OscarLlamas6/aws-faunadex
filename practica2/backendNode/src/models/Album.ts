import { Model, Column, Table, CreatedAt, UpdatedAt, DataType, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Usuario } from './Usuario'
import { Foto } from './Foto'
import { DetalleFoto } from './DetalleFoto'

interface Attributes {
    id?: number;
    nombre: string;
    IdUsuario: number;
    Fotos?: Foto[]
    DetalleFoto?: DetalleFoto[]
}

@Table({
    tableName: 'Albums',
    timestamps: true,
})

export class Album extends Model<Album, Attributes> {

    @Column({ allowNull: false, type: DataType.STRING })
    nombre!: string;

    // Fechas de registro
    @CreatedAt
    @Column({ allowNull: false, type: DataType.DATE })
    createdAt!: Date;

    @UpdatedAt
    @Column({ allowNull: false, type: DataType.DATE })
    updatedAt!: Date;

    //LLAVE FORANEA USUARIO
    @ForeignKey(() => Usuario)
    @Column({ allowNull: false, type: DataType.INTEGER })
    IdUsuario?: number;

    @BelongsTo(() => Usuario)
    usuario?: Usuario;

    // Fotos
    @HasMany(() => Foto)
    Fotos?: Foto[];

    // DetallesFoto
    @HasMany(() => DetalleFoto)
    DetalleFoto?: DetalleFoto[];
}