import { type CreationOptional, DataTypes, type ForeignKey, type InferAttributes, type InferCreationAttributes, Model } from 'sequelize';
import { sequelizeConnection } from '../db/config';
import { MunicipalityPackages } from './municipalityPackages';

class Price extends Model<InferAttributes<Price>, InferCreationAttributes<Price>> {
  declare id: CreationOptional<number>;
  declare municipalityPackageId: ForeignKey<MunicipalityPackages['id']>;
  declare priceCents: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Price.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  priceCents: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  sequelize: sequelizeConnection,
});



export { Price };
