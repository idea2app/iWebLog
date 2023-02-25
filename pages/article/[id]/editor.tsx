import { Loading, SpinnerButton } from 'idea-react';
import { textJoin } from 'mobx-i18n';
import { observer } from 'mobx-react';
import { DataObject } from 'mobx-restful';
import { InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import { FormEvent, PureComponent } from 'react';
import { Container, FloatingLabel, Form } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { PageHead } from '../../../components/PageHead';
import { SessionBox } from '../../../components/SessionBox';
import articleStore from '../../../models/Article';
import { i18n } from '../../../models/Translation';
import { ArticleData } from '../../../service/Article/entity';
import { Role } from '../../../service/type';
import { withRoute, withTranslation } from '../../api/core';

const BlockEditor = dynamic(() => import('../../../components/BlockEditor'), {
  ssr: false,
});
BlockEditor.displayName = 'BlockEditor';

interface ArticleInput
  extends Omit<ArticleData, 'createdAt' | 'updatedAt' | 'content'> {
  content: DataObject;
}

export const getServerSideProps = withRoute(withTranslation());

export default function ArticleEditorPage({
  route: { params },
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <SessionBox autoCover roles={[Role.Editor]}>
      <ArticleEditor id={+params!.id} />
    </SessionBox>
  );
}

@observer
class ArticleEditor extends PureComponent<{ id: number }> {
  componentDidMount() {
    const { id } = this.props;

    if (id) articleStore.getOne(id);
  }

  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const {
      id: ID,
      content,
      ...data
    } = formToJSON<ArticleInput>(event.currentTarget);

    const { id } = await articleStore.updateOne(
      { ...data, content: JSON.stringify(content) },
      +ID,
    );
    location.replace(`/article/${id}`);
  };

  render() {
    const { t } = i18n,
      { downloading, uploading } = articleStore,
      { title, author, location, origin, tags, summary, content } =
        articleStore.currentOne,
      { id } = this.props;
    const header = textJoin(t('component'), t('examples'));

    return (
      <Container
        as="form"
        className="d-flex flex-column gap-3 pt-3"
        onSubmit={this.handleSubmit}
      >
        <PageHead title={header} />

        {!!downloading && <Loading />}

        <input type="hidden" name="id" value={id} />

        <FloatingLabel controlId="title" label="标题">
          <Form.Control
            name="title"
            required
            placeholder="标题"
            defaultValue={title}
          />
        </FloatingLabel>

        <FloatingLabel controlId="author" label="作者">
          <Form.Control
            name="author"
            required
            placeholder="作者"
            defaultValue={author}
          />
        </FloatingLabel>

        <FloatingLabel controlId="location" label="地点">
          <Form.Control
            name="location"
            placeholder="地点"
            defaultValue={location}
          />
        </FloatingLabel>

        <FloatingLabel controlId="origin" label="原始出处（网址或书刊页码）">
          <Form.Control
            name="origin"
            placeholder="原始出处（网址或书刊页码）"
            defaultValue={origin}
          />
        </FloatingLabel>

        <FloatingLabel controlId="tags" label="标签（多个由空格隔开）">
          <Form.Control
            name="tags"
            required
            placeholder="标签（多个由空格隔开）"
            defaultValue={tags}
          />
        </FloatingLabel>

        <FloatingLabel controlId="summary" label="摘要">
          <Form.Control
            name="summary"
            placeholder="摘要"
            defaultValue={summary}
          />
        </FloatingLabel>

        {id ? (
          content && <BlockEditor name="content" defaultValue={content} />
        ) : (
          <BlockEditor name="content" defaultValue="{}" />
        )}
        <footer className="w-100 position-sticky bottom-0 z-1 pb-3 bg-white">
          <SpinnerButton
            className="w-100"
            size="lg"
            type="submit"
            loading={!!uploading}
          >
            保存
          </SpinnerButton>
        </footer>
      </Container>
    );
  }
}
