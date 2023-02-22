import { CommentData } from '../service/Comment/entity';
import { TableModel } from './Base';
import userStore from './User';

export class CommentModel extends TableModel<CommentData> {
  client = userStore.client;
  baseURI = '';

  constructor(articleId: number) {
    super();
    this.baseURI = `article/${articleId}/comment`;
  }
}
