import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { FC } from 'react';
import { Button, Container } from 'react-bootstrap';

import { ArticleList } from '../components/Article/List';
import { PageHead } from '../components/PageHead';
import { SessionBox } from '../components/SessionBox';
import articleStore, { ArticleModel } from '../models/Article';
import { i18n } from '../models/Translation';
import { Role } from '../service/type';
import { withErrorLog, withTranslation } from './api/core';

export const getServerSideProps = withErrorLog(
  withTranslation(async () => {
    const articles = await new ArticleModel().getList();

    return { props: { articles } };
  }),
);

const { t } = i18n;

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

      <ArticleList store={articleStore} defaultData={articles} />
    </Container>
  ));

export default HomePage;
