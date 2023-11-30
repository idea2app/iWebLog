import { EditorHTML, text2color } from 'idea-react';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { cache, compose, errorLogger, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Badge, Button, Container, Image } from 'react-bootstrap';

import { CommentList } from '../../../components/Comment/List';
import { PageHead } from '../../../components/PageHead';
import { ArticleModel } from '../../../models/Article';
import { CommentModel } from '../../../models/Comment';
import { i18n } from '../../../models/Translation';
import { ArticleData } from '../../../service/Article/entity';
import { Role } from '../../../service/type';

const SessionBox = dynamic(() => import('../../../components/SessionBox'), {
    ssr: false,
  }),
  { t } = i18n;

export const getServerSideProps = compose<{ id: string }, ArticleData>(
  cache(),
  errorLogger,
  translator(i18n),
  async ({ params }) => {
    const articleStore = new ArticleModel();

    return { props: await articleStore.getOne(+params!.id) };
  },
);

const ArticleDetailPage: FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = observer(
  ({
    id,
    updatedAt,
    title,
    image,
    author,
    location,
    origin,
    tags,
    summary,
    content,
  }) => (
    <Container>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/github-markdown-css@5.4.0/github-markdown.css"
        />
      </Head>

      <PageHead title={title} />

      <Image
        className="w-100 object-fit-cover"
        style={{ height: '50vh' }}
        src={image}
      />
      <h1 className="d-flex justify-content-between align-items-center">
        {title}
        <SessionBox roles={[Role.Editor]}>
          <Button size="sm" href={`/article/${id}/editor`}>
            {t('edit')}
          </Button>
        </SessionBox>
      </h1>
      <ul className="list-unstyled my-3 d-flex gap-3">
        <li>🕒 {new Date(updatedAt!).toLocaleString()}</li>
        <li>👩‍🎓 {author}</li>
        <li>🌏 {location}</li>
        <li>
          📑{' '}
          {origin && /^https?:\/\/\S+$/i.test(origin) ? (
            <a target="_blank">{origin}</a>
          ) : (
            origin
          )}
        </li>
        <li className="ms-auto">
          {tags.split(/\s+/).map(tag => (
            <Badge
              as="a"
              key={tag}
              className="text-decoration-none me-2"
              bg={text2color(tag, ['light'])}
              href={`/search?tag=${tag}`}
            >
              {tag}
            </Badge>
          ))}
        </li>
      </ul>
      <blockquote>{summary}</blockquote>

      <EditorHTML data={JSON.parse(content)} />

      <CommentList className="py-3" store={new CommentModel(id)} />
    </Container>
  ),
);

export default ArticleDetailPage;
