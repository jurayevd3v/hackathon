import { Column, DataType, Model, Table } from 'sequelize-typescript';
interface PowerAttr {
  address: string;
  powerTime: string;
  note?: string | null;
}

@Table({ tableName: 'power' })
export class Power extends Model<Power, PowerAttr> {
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
  powerTime: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  note?: string | null;
}
