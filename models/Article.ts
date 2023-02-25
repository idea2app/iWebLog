import { observable } from 'mobx';

import { ArticleData } from '../service/Article/entity';
import { TableModel } from './Base';
import { CommentModel } from './Comment';
import userStore from './User';

export class ArticleModel extends TableModel<ArticleData> {
  client = userStore.client;
  baseURI = 'article';

  @observable
  currentComment?: CommentModel;

  async getOne(id: number) {
    const article = await super.getOne(id);

    this.currentComment = new CommentModel(id);

    return article;
  }
}

export default new ArticleModel();
