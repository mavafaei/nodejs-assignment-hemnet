import { type CreationOptional, DataTypes, type ForeignKey, type InferAttributes, type InferCreationAttributes, Model } from 'sequelize';
import { sequelizeConnection } from '../db/config';
import { MunicipalityPackages } from './municipalityPackages';

class Price extends Model<InferAttributes<Price>, InferCreationAttributes<Price>> {
  declare id: CreationOptional<number>;
  declare municipalityPackageId: ForeignKey<MunicipalityPackages['id']>;
  declare prevPriceCents: number;
  declare priceCents: number;
  declare changedPriceDate: CreationOptional<Date>;
}

Price.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  prevPriceCents: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  priceCents: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  changedPriceDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
}, {
  sequelize: sequelizeConnection,
});

export { Price };
