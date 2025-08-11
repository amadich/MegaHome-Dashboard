import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

@Table({ tableName: 'prospects' })
export class Prospect extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  fullName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  phone!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  address!: string;

  @Column({
    type: DataType.ENUM,
    values: ['not_contacted', 'contacted', 'closed'],
    allowNull: false,
    defaultValue: 'not_contacted'
  })
  contactStatus!: 'not_contacted' | 'contacted' | 'closed';
}

export default Prospect;