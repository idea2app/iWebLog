import { HTTPClient } from 'koajax';
import { DataObject, Filter, ListModel, NewData, toggle } from 'mobx-restful';
import { buildURLData } from 'web-utility';

import { ListChunk } from '../service/database';

export const isServer = () => typeof window === 'undefined';

const VercelHost = process.env.VERCEL_URL,
  GithubToken = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

export const API_Host = isServer()
  ? VercelHost
    ? `https://${VercelHost}`
    : 'http://localhost:3000'
  : globalThis.location.origin;

export const githubClient = new HTTPClient({
  baseURI: 'https://api.github.com/',
  responseType: 'json',
}).use(({ request }, next) => {
  if (GithubToken)
    request.headers = {
      ...request.headers,
      Authorization: `Bearer ${GithubToken}`,
    };
  return next();
});

export abstract class TableModel<
  D extends DataObject,
  F extends Filter<D> = Filter<D>,
> extends ListModel<D, F> {
  async loadPage(pageIndex = 1, pageSize = 10, filter: F) {
    const { body } = await this.client.get<ListChunk<D>>(
      `${this.baseURI}?${buildURLData({ pageIndex, pageSize, ...filter })}`,
    );
    return { pageData: body!.rows, totalCount: body!.count };
  }

  @toggle('uploading')
  async updateOne(data: Partial<NewData<D>>, id?: number) {
    const item = await super.updateOne(data, id);

    if (id) this.changeOne(item, id);
    else
      this.restoreList({
        allItems: [...this.allItems, item],
        totalCount: this.totalCount! + 1,
      });

    return (this.currentOne = item!);
  }
}
