import { Column, DataType, Model, Table } from 'sequelize-typescript';
interface CarAttr {
  key: string;
  title?: string | null;
  note?: string | null;
  imageOne?: string | null;
  imageTwo?: string | null;
}

@Table({ tableName: 'cars' })
export class Car extends Model<Car, CarAttr> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  key: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  title?: string | null;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  note?: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  imageOne?: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  imageTwo?: string | null;
}
