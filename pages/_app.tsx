import '../styles/globals.less';

import { HTTPError } from 'koajax';
import { observer, useStaticRendering } from 'mobx-react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Image } from 'react-bootstrap';

import { MainNavigator } from '../components/MainNavigator';
import { isServer } from '../models/Base';
import { i18n } from '../models/Translation';

// eslint-disable-next-line react-hooks/rules-of-hooks
useStaticRendering(isServer());

globalThis.addEventListener?.('unhandledrejection', ({ reason }) => {
  var { message, statusText } = reason as HTTPError;

  message = statusText || message;

  if (message) alert(message);
});

const AppShell = observer(({ Component, pageProps }: AppProps) => {
  const { t } = i18n;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <MainNavigator />

      <div className="mt-5 pt-2">
        <Component {...pageProps} />
      </div>

      <footer className="flex-fill d-flex justify-content-center align-items-center border-top py-4">
        <a
          className="flex-fill d-flex justify-content-center align-items-center"
          href="https://vercel.com?utm_source=create-next-app&amp;utm_medium=default-template&amp;utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('powered_by')}
          <span className="mx-2">
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </>
  );
});

export default AppShell;
