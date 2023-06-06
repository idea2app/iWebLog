import { observer } from 'mobx-react';
import { ScrollList, ScrollListProps } from 'mobx-restful-table';
import { FC } from 'react';

import { CommentModel } from '../../models/Comment';
import { i18n } from '../../models/Translation';
import { CommentData } from '../../service/Comment/entity';
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

export type CommentListProps = Omit<CommentListLayoutProps, 'data'> &
  Pick<ScrollListProps<CommentData>, 'className' | 'filter'>;

const { t } = i18n;

export const CommentList: FC<CommentListProps> = observer(
  ({ store, filter }) => (
    <>
      <CommentForm store={store} />

      <aside className="p-3 text-center">
        {t('has_x_comments', { totalCount: store.totalCount })}
      </aside>

      <ScrollList
        translator={i18n}
        {...{ store, filter }}
        renderList={allItems => (
          <CommentListLayout store={store} data={allItems} />
        )}
      />
    </>
  ),
);
