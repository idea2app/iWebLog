import { observer } from 'mobx-react';
import { Filter } from 'mobx-restful';
import { ScrollListProps } from 'mobx-restful-table';
import { FC } from 'react';

import { CommentModel } from '../../models/Comment';
import { i18n } from '../../models/Translation';
import { CommentData } from '../../service/Comment/entity';
import { XScrollList } from '../ScrollList';
import { CommentCard } from './Card';
import { CommentForm } from './Form';

export interface CommentListLayoutProps {
  store: CommentModel;
  data: CommentData[];
}

export const CommentListLayout: FC<CommentListLayoutProps> = ({
  store,
  data,
}) => (
  <ol className="list-unstyled">
    {data.map(item => (
      <CommentCard
        className="my-3"
        key={item.id + ''}
        store={store}
        {...item}
      />
    ))}
  </ol>
);

export interface CommentListProps
  extends Omit<CommentListLayoutProps, 'data'>,
    ScrollListProps<CommentData> {
  store: CommentModel;
  filter?: Filter<CommentData>;
}

const { t } = i18n;

@observer
export class CommentList extends XScrollList<CommentListProps> {
  store = this.props.store;
  filter = this.props.filter || {};

  constructor(props: CommentListProps) {
    super(props);

    this.boot();
  }

  renderList() {
    const { store } = this;
    const { totalCount, allItems } = store;

    return (
      <>
        <CommentForm store={store} />

        <aside className="p-3 text-center">
          {t('has_x_comments', { totalCount })}
        </aside>
        <CommentListLayout store={store} data={allItems} />
      </>
    );
  }
}
