import { Table, Column, Model, DataType } from "sequelize-typescript";

export enum PropertyType {
  HOME = "HOME",
  COMMERCIAL = "COMMERCIAL",
  FARM = "FARM",
}

export enum CoolerType {
  IRANI = "IRANI",
  CENTRAL = "CENTRAL",
}

export enum InverterLocation {
  INSIDE = "INSIDE",
  OUTSIDE = "OUTSIDE",
}

@Table({
  tableName: "AccomplishedProjects",
  timestamps: true,
})
export default class AccomplishedProject extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({
    type: DataType.ENUM(...Object.values(PropertyType)),
    allowNull: false,
  })
  propertyType!: PropertyType;

  @Column(DataType.FLOAT)
  nightAmperage?: number;

  @Column(DataType.FLOAT)
  dayAmperage?: number;

  @Column(DataType.INTEGER)
  numberOfSplits?: number;

  @Column(DataType.INTEGER)
  numberOfFridges?: number;

  @Column(DataType.INTEGER)
  numberOfFreezers?: number;

  @Column(DataType.INTEGER)
  numberOfCoolers?: number;

  @Column({
    type: DataType.ENUM(...Object.values(CoolerType)),
    allowNull: true,
  })
  coolerType?: CoolerType;

  @Column(DataType.INTEGER)
  numberOfColdRooms?: number;

  @Column(DataType.FLOAT)
  propertyArea?: number;

  @Column(DataType.BOOLEAN)
  isRoofExposed?: boolean;

  @Column({
    type: DataType.ENUM(...Object.values(InverterLocation)),
    allowNull: false,
  })
  inverterLocation!: InverterLocation;

  @Column(DataType.INTEGER)
  numberOfFloors?: number;

  @Column(DataType.INTEGER)
  numberOfFamilies?: number;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  projectId!: string;
}