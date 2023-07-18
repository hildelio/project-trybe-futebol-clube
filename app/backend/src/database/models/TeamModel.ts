import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';
import db from '.';

class SequelizeTeam extends
  Model<InferAttributes<SequelizeTeam>, InferCreationAttributes<SequelizeTeam>> {
  declare id: CreationOptional<number>;
  declare teamName: string;
}

SequelizeTeam.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    teamName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'team_name',
    },
  },
  {
    sequelize: db,
    timestamps: false,
    tableName: 'teams',
    modelName: 'Team',
    underscored: true,
  },
);

export default SequelizeTeam;
