import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class Facility extends Model {
  declare id: string;
  declare name: string;
}

Facility.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { sequelize, tableName: "facilities" },
);
