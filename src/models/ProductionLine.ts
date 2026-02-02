import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";
import { Facility } from "./Facility";

export class ProductionLine extends Model {
  declare id: string;
  declare name: string;
  declare facilityId: string;
}

ProductionLine.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    facilityId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  { sequelize, tableName: "production_lines" },
);

Facility.hasMany(ProductionLine, { foreignKey: "facilityId" });
ProductionLine.belongsTo(Facility, { foreignKey: "facilityId" });
