import { Loading, SpinnerButton } from 'idea-react';
import { observer } from 'mobx-react';
import { DataObject } from 'mobx-restful';
import { FormField } from 'mobx-restful-table';
import { InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import { compose, RouteProps, router, translator } from 'next-ssr-middleware';
import { FormEvent, PureComponent } from 'react';
import { Container, Form } from 'react-bootstrap';
import { formToJSON } from 'web-utility';

import { PageHead } from '../../../components/PageHead';
import { SessionBox } from '../../../components/SessionBox';
import articleStore from '../../../models/Article';
import { i18n } from '../../../models/Translation';
import userStore from '../../../models/User';
import { ArticleData } from '../../../service/Article/entity';
import { Role } from '../../../service/type';

const BlockEditor = dynamic(() => import('../../../components/BlockEditor'), {
  ssr: false,
});
BlockEditor.displayName = 'BlockEditor';

interface ArticleInput
  extends Omit<ArticleData, 'createdAt' | 'updatedAt' | 'content' | 'image'> {
  content: DataObject;
  image?: File;
}

export const getServerSideProps = compose<
  { id: string },
  RouteProps<{ id: string }>
>(router, translator(i18n));

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
      image,
      ...data
    } = formToJSON<ArticleInput>(event.currentTarget);

    const filePath = image && (await userStore.upload(image));

    const { id } = await articleStore.updateOne(
      {
        ...data,
        content: JSON.stringify(content),
        image: filePath,
      },
      +ID,
    );
    location.replace(`/article/${id}`);
  };

  render() {
    const { t } = i18n,
      { downloading, uploading } = articleStore,
      { title, image, author, location, origin, tags, summary, content } =
        articleStore.currentOne,
      { id } = this.props;
    const header = `${t('edit')}${title ? ` ${title}` : ''}`;

    return (
      <Container
        as="form"
        className="d-flex flex-column gap-3 pt-3"
        onSubmit={this.handleSubmit}
      >
        <PageHead title={header} />

        {!!downloading && <Loading />}

        <input type="hidden" name="id" value={id} />

        <FormField
          label={t('title')}
          placeholder={t('title')}
          name="title"
          required
          defaultValue={title}
        />
        <FormField
          label={t('image')}
          type="file"
          accept="image/*"
          name="image"
          defaultValue={image}
        />
        <FormField
          label={t('author')}
          placeholder={t('author')}
          name="author"
          required
          defaultValue={author}
        />
        <FormField
          label={t('location')}
          placeholder={t('location')}
          name="location"
          defaultValue={location}
        />
        <FormField
          label={t('origin')}
          placeholder={t('origin')}
          name="origin"
          defaultValue={origin}
        />
        <FormField
          label={t('tags')}
          placeholder={t('tags')}
          name="tags"
          required
          defaultValue={tags}
        />
        <FormField
          label={t('summary')}
          placeholder={t('summary')}
          name="summary"
          defaultValue={summary}
        />
        <Form.Group>
          <Form.Label>{t('content')}</Form.Label>
          {id ? (
            content && (
              <BlockEditor name="content" defaultValue={JSON.parse(content)} />
            )
          ) : (
            <BlockEditor name="content" />
          )}
        </Form.Group>

        <footer className="w-100 position-sticky bottom-0 z-1 pb-3 bg-white">
          <SpinnerButton
            className="w-100"
            size="lg"
            type="submit"
            loading={!!uploading}
          >
            {t('submit')}
          </SpinnerButton>
        </footer>
      </Container>
    );
  }
}
