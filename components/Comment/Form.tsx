import { SpinnerButton } from 'idea-react';
import { observer } from 'mobx-react';
import { FormEvent, PureComponent } from 'react';
import { Col, FloatingLabel, Form } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { CommentModel } from '../../models/Comment';
import { i18n } from '../../models/Translation';
import { CommentData } from '../../service/Comment/entity';

export interface CommentFormProps {
  className?: string;
  parentId?: number;
  store: CommentModel;
  onSubmit?: () => any;
}

const { t } = i18n;

@observer
export class CommentForm extends PureComponent<CommentFormProps> {
  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { store, parentId, onSubmit } = this.props,
      { content } = formToJSON<CommentData>(event.currentTarget);

    await store.updateOne({ content, parentId });

    onSubmit?.();
  };

  render() {
    const { className = '', store } = this.props;
    const { uploading } = store;

    return (
      <Form className={`row ${className}`} onSubmit={this.handleSubmit}>
        <Col xs={12} sm={10}>
          <FloatingLabel controlId="content" label={t('comment')}>
            <Form.Control
              as="textarea"
              name="content"
              required
              placeholder={t('comment')}
            />
          </FloatingLabel>
        </Col>
        <SpinnerButton
          className="col-12 col-sm-2"
          type="submit"
          loading={uploading > 0}
        >
          {t('post')}
        </SpinnerButton>
      </Form>
    );
  }
}
