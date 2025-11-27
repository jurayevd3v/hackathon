import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface FineAttr {
  address: string;
  name: string;
  carNumber: string;
  note?: string | null;
}

@Table({ tableName: 'fine' })
export class Fine extends Model<Fine, FineAttr> {
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
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  carNumber: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  note?: string | null;
}
