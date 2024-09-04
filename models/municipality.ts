import { type CreationOptional, DataTypes, type InferAttributes, type InferCreationAttributes, Model, type NonAttribute } from 'sequelize';
import { sequelizeConnection } from '../db/config';
import { MunicipalityPackages } from './municipalityPackages';

class Municipality extends Model<InferAttributes<Municipality>, InferCreationAttributes<Municipality>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare municipalityPackages?: NonAttribute<MunicipalityPackages[]>;
}

Municipality.init({
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

export { Municipality };
