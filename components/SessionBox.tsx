import { computed } from 'mobx';
import { observer } from 'mobx-react';
import Head from 'next/head';
import { MouseEvent, PureComponent } from 'react';

import userStore, { guard } from '../models/User';
import { Role } from '../service/type';

export interface SessionBoxProps {
  className?: string;
  autoCover?: boolean;
  roles?: Role[];
}

@observer
export class SessionBox extends PureComponent<SessionBoxProps> {
  @computed
  get authorized() {
    const { roles } = this.props,
      { session } = userStore;

    return !!(roles
      ? session?.roles?.some(role => roles?.includes(role))
      : session);
  }

  componentDidMount() {
    const { autoCover } = this.props;

    if (autoCover) this.openModal();
  }

  closeModal = () => {
    guard.hide();

    document.scrollingElement?.classList.remove('overflow-hidden');
  };

  async openModal() {
    if (+new Date(localStorage.tokenExpiredAt) > Date.now()) return;

    document.scrollingElement?.classList.add('overflow-hidden');

    guard.on('close', this.closeModal);

    const { token, tokenExpiredAt } = await guard.start('#authing-modal');

    localStorage.tokenExpiredAt = tokenExpiredAt;

    await userStore.signInAuthing(token!);

    this.closeModal();
  }

  captureInput = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    this.openModal();
  };

  render() {
    const { className, autoCover, children } = this.props,
      { authorized } = this;

    return (
      <>
        <Head>
          <link
            rel="stylesheet"
            href="https://cdn.authing.co/packages/guard/5.1.2/guard.min.css"
          />
        </Head>
        <div
          className={className}
          onClickCapture={
            autoCover || authorized ? undefined : this.captureInput
          }
        >
          {(!autoCover || authorized) && children}
        </div>
      </>
    );
  }
}
