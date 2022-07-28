import React from 'react';

export type MenuItemType = {
  key: string;
  Icon?: React.ComponentType;
  path: string;
  title: string;
  group: string;
};

export const AppMenuItems: MenuItemType[] = [
  {
    key: 'scripts',
    path: '/scripts',
    title: 'Scripts',
    group: 'Cloud Runner',
  },
  {
    key: 'history',
    path: '/history',
    title: 'History',
    group: 'Cloud Runner',
  },
  {
    key: 'settings-runners',
    path: '/settings/runners',
    title: 'Runners',
    group: 'Settings',
  },
  {
    key: 'settings-users',
    path: '/settings/users',
    title: 'Users',
    group: 'Settings',
  },
  {
    key: 'settings-groups',
    path: '/settings/groups',
    title: 'Groups',
    group: 'Settings',
  },
  {
    key: 'settings-permissions',
    path: '/settings/permissions',
    title: 'Permissions',
    group: 'Settings',
  },
  {
    key: 'settings-account',
    path: '/settings/account',
    title: 'Account',
    group: 'Settings',
  },
];
