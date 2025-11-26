import { Column, DataType, Model, Table } from 'sequelize-typescript';
interface AccidentAttr {
  address: string;
  status: string;
  note?: string | null;
  image?: string | null;
}

@Table({ tableName: 'accident' })
export class Accident extends Model<Accident, AccidentAttr> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  note?: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  image?: string | null;
}
