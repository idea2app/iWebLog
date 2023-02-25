import { Option, Select } from 'idea-react';
import { observer } from 'mobx-react';
import { FC } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';

import { i18n, LanguageName } from '../models/Translation';
import { UserMenu } from './UserMenu';

const Name = process.env.NEXT_PUBLIC_SITE_NAME || '';

export const MainNavigator: FC = observer(() => {
  const { currentLanguage, t } = i18n;

  return (
    <Navbar
      bg="primary"
      variant="dark"
      fixed="top"
      expand="sm"
      collapseOnSelect
    >
      <Container>
        <Navbar.Brand href="/">{Name}</Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-inner" />

        <Navbar.Collapse id="navbar-inner">
          <Nav className="me-auto">
            <Nav.Link
              target="_blank"
              href="https://github.com/TechQuery/father-anthology"
            >
              {t('source_code')}
            </Nav.Link>
          </Nav>

          <div className="d-flex flex-column flex-sm-row gap-3">
            <UserMenu />

            <Select
              value={currentLanguage}
              onChange={key =>
                i18n.changeLanguage(key as typeof currentLanguage)
              }
            >
              {Object.entries(LanguageName).map(([key, name]) => (
                <Option key={key} value={key}>
                  {name}
                </Option>
              ))}
            </Select>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
});
