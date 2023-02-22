import { SpinnerButton } from 'idea-react';
import { FormEvent, PureComponent } from 'react';
import { Col, FloatingLabel, Form } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { CommentModel } from '../../models/Comment';
import { CommentData } from '../../service/Comment/entity';

export interface CommentFormProps {
  className?: string;
  parentId?: number;
  store: CommentModel;
  onSubmit?: () => any;
}

export class CommentForm extends PureComponent<CommentFormProps> {
  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { store, parentId, onSubmit } = this.props,
      { content } = formToJSON<CommentData>(event.currentTarget);

    await store.updateOne({ content, parentId });

    store.restoreList({ allItems: [...store.allItems, store.currentOne] });

    onSubmit?.();
  };

  render() {
    const { className = '', store } = this.props;
    const { uploading } = store;

    return (
      <Form className={`row ${className}`} onSubmit={this.handleSubmit}>
        <Col xs={12} sm={10}>
          <FloatingLabel controlId="content" label="评论">
            <Form.Control
              as="textarea"
              name="content"
              required
              placeholder="评论"
            />
          </FloatingLabel>
        </Col>
        <SpinnerButton
          className="col-12 col-sm-2"
          type="submit"
          loading={uploading > 0}
        >
          发言
        </SpinnerButton>
      </Form>
    );
  }
}
