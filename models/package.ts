import { type Association, type CreationOptional, DataTypes, type InferAttributes, type InferCreationAttributes, Model, type NonAttribute } from 'sequelize';
import { sequelizeConnection } from '../db/config';
import { MunicipalityPackages } from './municipalityPackages';

class Package extends Model<InferAttributes<Package>, InferCreationAttributes<Package>> {
  declare static associations: {
    municipalityPackages: Association<Package, MunicipalityPackages>;
  };

  declare id: CreationOptional<number>;
  declare name: string;
  declare municipalityPackages?: NonAttribute<MunicipalityPackages[]>;
}

Package.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  sequelize: sequelizeConnection,
});

export { Package };
