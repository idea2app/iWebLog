import { observer } from 'mobx-react';
import { Filter } from 'mobx-restful';
import { ScrollListProps } from 'mobx-restful-table';
import { FC } from 'react';
import { Col, Row, RowProps } from 'react-bootstrap';

import { ArticleModel } from '../../models/Article';
import { ArticleData } from '../../service/Article/entity';
import { XScrollList } from '../ScrollList';
import { ArticleCard } from './Card';

export interface ArticleListLayoutProps {
  className?: string;
  rowCols?: Pick<RowProps, 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'>;
  data: ArticleData[];
}

export const ArticleListLayout: FC<ArticleListLayoutProps> = ({
  className = 'g-3 my-4',
  rowCols = { xs: 1, sm: 2, xl: 3 },
  data,
}) => (
  <Row as="section" {...rowCols} className={className}>
    {data.map(item => (
      <Col key={item.id + ''}>
        <ArticleCard className="h-100" {...item} />
      </Col>
    ))}
  </Row>
);

export interface ArticleListProps
  extends Omit<ArticleListLayoutProps, 'data'>,
    ScrollListProps<ArticleData> {
  store: ArticleModel;
  filter?: Filter<ArticleData>;
}

@observer
export class ArticleList extends XScrollList<ArticleListProps> {
  store = this.props.store;
  filter = this.props.filter || {};

  constructor(props: ArticleListProps) {
    super(props);

    this.boot();
  }

  renderList() {
    return (
      <ArticleListLayout
        rowCols={this.props.rowCols}
        data={this.store.allItems}
      />
    );
  }
}
