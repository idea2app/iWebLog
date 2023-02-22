import { DataTypes, InferAttributes, Sequelize } from 'sequelize';

import { Base } from '../Base/entity';
import { Gender, Role } from '../type';

export class User extends Base {
  declare mobilePhone: string;
  declare nickName?: string;
  declare gender?: Gender;
  declare avatar?: string;
  declare roles?: Role[];
  declare token?: string;
}

export type UserData = InferAttributes<User>;

export const init = (sequelize: Sequelize) =>
  User.init(
    {
      mobilePhone: DataTypes.STRING,
      nickName: { type: DataTypes.STRING, allowNull: true },
      gender: { type: DataTypes.INTEGER, allowNull: true },
      avatar: { type: DataTypes.STRING, allowNull: true },
      roles: { type: DataTypes.JSON, allowNull: true },
    },
    { sequelize },
  );
