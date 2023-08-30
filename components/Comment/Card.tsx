import { Avatar, TimeDistance } from 'idea-react';
import { makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Button, Col, Row } from 'react-bootstrap';

import { CommentModel } from '../../models/Comment';
import { i18n } from '../../models/Translation';
import { CommentData } from '../../service/Comment/entity';
import { TimeOption } from '../data';
import { CommentForm } from './Form';

export interface CommentCardProps extends CommentData {
  className?: string;
  store: CommentModel;
}

const { t } = i18n;

@observer
export class CommentCard extends PureComponent<CommentCardProps> {
  constructor(props: CommentCardProps) {
    super(props);
    makeObservable(this);
  }

  @observable
  openForm = false;

  render() {
    const { openForm } = this,
      {
        className = '',
        store,
        id,
        createdAt,
        poster,
        content,
        parentId,
      } = this.props;

    return (
      <Row
        as="li"
        className={`g-3 p-3 shadow-sm ${className}`}
        id={`comment-${id}`}
      >
        <Col className="text-center" xs={2}>
          <Avatar src={poster.avatar} />

          <h3 className="h6">{poster.nickName || poster.mobilePhone}</h3>

          <TimeDistance {...TimeOption} date={createdAt} />
        </Col>
        <Col xs={10} className="d-flex flex-column">
          <p className="flex-fill">{content}</p>
          <footer>
            {parentId && (
              <Button variant="link" href={`#comment-${parentId}`}>
                {t('quote')}
              </Button>
            )}
            <Button variant="link" onClick={() => (this.openForm = true)}>
              {t('reply')}
            </Button>
          </footer>
        </Col>
        {openForm && (
          <CommentForm
            className="col-12 mt-3"
            store={store}
            parentId={id}
            onSubmit={() => (this.openForm = false)}
          />
        )}
      </Row>
    );
  }
}
