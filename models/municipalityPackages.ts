import { type CreationOptional, DataTypes, ForeignKey, type InferAttributes, type InferCreationAttributes, Model, NonAttribute } from 'sequelize';
import { sequelizeConnection } from '../db/config';
import { Package } from './package';
import { Municipality } from './municipality';
import { Price } from './price';

class MunicipalityPackages extends Model<InferAttributes<MunicipalityPackages>, InferCreationAttributes<MunicipalityPackages>> {
  declare id: CreationOptional<number>;
  declare packageId: ForeignKey<Package['id']>;
  declare municipalityId: ForeignKey<Municipality['id']> | null;
  declare priceCents: number;
  declare prices?: NonAttribute<Price[]>;
  declare municipality: NonAttribute<Municipality>;
  declare date: CreationOptional<Date>;
}

MunicipalityPackages.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  priceCents: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  date: DataTypes.DATE,
}, {
  sequelize: sequelizeConnection,
});

MunicipalityPackages.hasMany(Price, {
  sourceKey: 'id',
  foreignKey: 'municipalityPackageId',
  as: 'prices',
});

MunicipalityPackages.belongsTo(Package, {
  foreignKey: 'packageId',
  as: 'package',
});

MunicipalityPackages.belongsTo(Municipality, {
  foreignKey: 'municipalityId',
  as: 'municipality',
});

Municipality.hasMany(MunicipalityPackages, {
  sourceKey: 'id',
  foreignKey: { name: 'municipalityId', allowNull: true },
  as: 'municipalityPackages',
});

export { MunicipalityPackages };
