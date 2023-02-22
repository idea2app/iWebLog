import { observer } from 'mobx-react';
import { FC } from 'react';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';

import { i18n } from '../models/Translation';
import userStore from '../models/User';
import { SessionBox } from './SessionBox';

const { t } = i18n;

export const UserMenu: FC = observer(() => (
  <SessionBox>
    {userStore.session ? (
      <DropdownButton
        title={userStore.session.nickName || userStore.session.mobilePhone}
      >
        <Dropdown.Item onClick={() => userStore.signOut()}>
          {t('sign_out')}
        </Dropdown.Item>
      </DropdownButton>
    ) : (
      <Button>{t('sign_in')}</Button>
    )}
  </SessionBox>
));
