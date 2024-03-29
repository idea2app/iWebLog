import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import { cache, compose, errorLogger, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Button, Container } from 'react-bootstrap';

import { ArticleListLayout } from '../components/Article/List';
import { PageHead } from '../components/PageHead';
import articleStore, { ArticleModel } from '../models/Article';
import { i18n } from '../models/Translation';
import { Role } from '../service/type';

const SessionBox = dynamic(() => import('../components/SessionBox'), {
    ssr: false,
  }),
  { t } = i18n;

export const getServerSideProps = compose(
  cache(),
  errorLogger,
  translator(i18n),
  async () => {
    const articles = await new ArticleModel().getList();

    return { props: { articles } };
  },
);

const HomePage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> =
  observer(({ articles }) => (
    <Container as="main" className="py-3">
      <PageHead />

      <header className="d-flex">
        <SessionBox className="ms-auto" roles={[Role.Editor]}>
          <Button size="sm" href="/article/0/editor">
            {t('write')}
          </Button>
        </SessionBox>
      </header>

      <ScrollList
        translator={i18n}
        store={articleStore}
        renderList={allItems => <ArticleListLayout data={allItems} />}
        defaultData={articles}
      />
    </Container>
  ));

export default HomePage;
