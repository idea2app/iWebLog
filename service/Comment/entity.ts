import {
  BelongsTo,
  DataTypes,
  InferAttributes,
  Model,
  Sequelize,
} from 'sequelize';

import { BaseData } from '../Base/entity';
import { User } from '../User/entity';

export class Comment extends Model {
  declare articleId: number;
  declare poster: User;
  declare content: string;
  declare parentId?: number;

  static Poster: BelongsTo<Comment, User>;
}

export type CommentData = BaseData & InferAttributes<Comment>;

export const init = (sequelize: Sequelize) => {
  Comment.init(
    {
      articleId: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      parentId: { type: DataTypes.INTEGER, allowNull: true },
    },
    { sequelize },
  );
  Comment.Poster = Comment.belongsTo(User, { as: 'poster' });
};
