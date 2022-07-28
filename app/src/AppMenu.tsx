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
    key: 'persons',
    path: '/persons',
    title: 'Persons',
    group: 'Content',
  },
  {
    key: 'rays',
    path: '/rays',
    title: 'Rays',
    group: 'Content',
  },
  {
    key: 'raylists',
    path: '/raylists',
    title: 'Raylists',
    group: 'Content',
  },
  {
    key: 'categories',
    path: '/categories',
    title: 'Categories',
    group: 'Content',
  },
  {
    key: 'archetypes',
    path: '/archetypes',
    title: 'Archetypes',
    group: 'Content',
  },

  {
    key: 'users',
    path: '/users',
    title: 'User Management',
    group: 'Users',
  },
  {
    key: 'devices',
    path: '/devices',
    title: 'Device Management',
    group: 'Devices',
  },
];
