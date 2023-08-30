import { makeObservable, observable } from 'mobx';

import { ArticleData } from '../service/Article/entity';
import { TableModel } from './Base';
import { CommentModel } from './Comment';
import userStore from './User';

export class ArticleModel extends TableModel<ArticleData> {
  constructor() {
    super();
    makeObservable(this);
  }

  client = userStore.client;
  baseURI = 'article';

  @observable
  currentComment?: CommentModel = undefined;

  async getOne(id: number) {
    const article = await super.getOne(id);

    this.currentComment = new CommentModel(id);

    return article;
  }
}

export default new ArticleModel();
