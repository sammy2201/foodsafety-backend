import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";
import { ProductionLine } from "./ProductionLine";

export class TestResult extends Model {
  declare id: string;
  declare productionLineId: string;
  declare cfuCount: number;
  declare location: string;
  declare testedAt: Date;
}

TestResult.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productionLineId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    cfuCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    testedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "test_results",
  },
);

ProductionLine.hasMany(TestResult, { foreignKey: "productionLineId" });
TestResult.belongsTo(ProductionLine, { foreignKey: "productionLineId" });
