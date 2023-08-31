import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import { FC } from 'react';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';

import { i18n } from '../models/Translation';
import userStore from '../models/User';

const SessionBox = dynamic(() => import('./SessionBox'), { ssr: false }),
  { t } = i18n;

const UserMenu: FC = observer(() => {
  const { session } = userStore;

  return session ? (
    <DropdownButton title={session.nickName || session.mobilePhone}>
      <Dropdown.Item onClick={() => userStore.signOut()}>
        {t('sign_out')}
      </Dropdown.Item>
    </DropdownButton>
  ) : (
    <SessionBox>
      <Button>{t('sign_in')}</Button>
    </SessionBox>
  );
});

export default UserMenu;
