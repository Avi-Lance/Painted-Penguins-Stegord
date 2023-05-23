import React from 'react';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';

const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Chat', '1'),
  getItem('Find Friends', '2'),
  getItem('My Profile', '3'),
];

export default function Sidebar() {
  return (
    <Sider>
      <Menu theme="dark" mode="inline" items={items} />
    </Sider>
  );
}
