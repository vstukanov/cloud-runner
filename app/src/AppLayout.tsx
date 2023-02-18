import React from 'react';
import { Avatar, Col, Dropdown, Layout, Menu, Row } from 'antd';
import _ from 'lodash';
import { createUseStyles } from 'react-jss';
import { Link, useLocation } from 'react-router-dom';
import { UserOutlined, DownOutlined, LogoutOutlined } from '@ant-design/icons';

import { useSession } from './providers/SessionProvider';
import { AppMenuItems } from './AppMenu';

const useStyles = createUseStyles({
  layout: {
    minHeight: '100vh',
  },

  menu: {
    position: 'fixed',
    zIndex: 1,
    top: 0,
    paddingTop: 64,
    height: '100vh',
    backgroundColor: 'white',
  },

  content: {
    paddingTop: 8,
    paddingLeft: 200,
    backgroundColor: 'white',
  },

  header: {
    backgroundColor: 'white',
    boxShadow: '1px 1px 12px 0px rgba(0,0,0,0.15)',
    height: 64,
    top: 0,
    zIndex: 2,
    width: '100%',
    position: 'fixed',
    padding: '0 24px',
  },

  accountWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer',
    height: 32,
    marginTop: 16,
  },

  accountContent: {
    paddingLeft: 12,
    paddingRight: 12,
    display: 'flex',
    flexDirection: 'column',
    height: 56,
    justifyContent: 'center',
  },

  accountText: {
    height: '1.2em',
    lineHeight: '1.2em',
  },

  headerLogo: {
    height: 34,
    objectFit: 'cover',
  },

  headerTitle: {
    fontSize: 16,
    color: 'black',
    padding: 0,
    margin: 0,
  },
});

function AppMenu() {
  const location = useLocation();

  const menuItems = AppMenuItems;

  const selectedKeys = menuItems
    .filter((mi) => _.startsWith(location.pathname, mi.path))
    .map((mi) => mi.key);

  const menuGroups = _.groupBy(menuItems, 'group');
  const groups = Object.keys(menuGroups) as string[];

  return (
    <Menu
      theme="light"
      mode="inline"
      selectedKeys={selectedKeys}
      style={{ height: '100%', paddingTop: 10, backgroundColor: '#fafafa' }}
    >
      {groups.map((group) => (
        <Menu.ItemGroup title={group} key={group}>
          {menuGroups[group].map(({ key, title, path }) => (
            <Menu.Item key={key}>
              <Link to={path}>{title}</Link>
            </Menu.Item>
          ))}
        </Menu.ItemGroup>
      ))}
    </Menu>
  );
}

function AccountMenuItem() {
  const { user, logout } = useSession();
  const classes = useStyles();

  const menu = (
    <Menu>
      <Menu.Item icon={<LogoutOutlined />} onClick={logout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Dropdown
        overlay={menu}
        placement="bottomRight"
        arrow
        trigger={['click']}
      >
        <div className={classes.accountWrapper}>
          <Avatar shape="square" icon={<UserOutlined />} />
          <div className={classes.accountContent}>
            <span className={classes.accountText}>User name</span>
          </div>
          <DownOutlined />
        </div>
      </Dropdown>
    </div>
  );
}

export function AppLayout(props: any) {
  const classes = useStyles();

  return (
    <Layout className={classes.layout}>
      <Layout.Header className={classes.header}>
        <Row wrap={false}>
          <Col flex={1} style={{ alignItems: 'center' }}>
            <Link to="/">
              <h1 className={classes.headerTitle}>Cloud Runner</h1>
            </Link>
          </Col>
          <Col flex={0}>
            <AccountMenuItem />
          </Col>
        </Row>
      </Layout.Header>

      <Layout style={{ paddingTop: 64 }}>
        <Layout.Sider className={classes.menu}>
          <AppMenu />
        </Layout.Sider>

        <Layout.Content className={classes.content}>
          {props.children}
        </Layout.Content>
      </Layout>
    </Layout>
  );
}
