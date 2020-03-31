import React, { useEffect } from 'react';
import { Layout, Menu, Badge } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { RouteComponentProps } from 'react-router-dom';

export interface MenuItem {
  key?: string;
  name: string;
  icon?: string;
  path?: string;
  count?: number;
  type?: string;
  children?: MenuItem[];
}

export interface MenuViewProps {
  menudata: MenuItem[];
  history: RouteComponentProps['history'];
  pathname: string;
}
const { SubMenu, Item } = Menu;

export default function MenuView({
  pathname,
  menudata,
  history,
}: MenuViewProps) {
  if (!menudata.length) return null;

  const { path, name } = find(menudata, pathname);

  useEffect(() => {
    document.title = name ?? 'Title';
  }, [name]);

  const defaultOpenKeys = menudata.map(({ name }) => name);

  return (
    <Layout.Sider
      width={200}
      theme="light"
      style={{ backgroundColor: 'white' }}>
      <Menu
        key={defaultOpenKeys.join('-')}
        style={{ height: '100%', borderRight: 0 }}
        defaultOpenKeys={defaultOpenKeys}
        selectedKeys={path ? [path] : []}
        mode="inline">
        {render(menudata, history)}
      </Menu>
    </Layout.Sider>
  );
}

const render = (data: MenuItem[], history: RouteComponentProps['history']) => {
  return data.map(({ name, icon, path, count, children, type }, index) =>
    children && children.length ? (
      <SubMenu
        key={name}
        title={
          <span>
            <SettingOutlined />
            <span>{name}</span>
          </span>
        }>
        {render(children, history)}
      </SubMenu>
    ) : (
      <Item
        key={path}
        title={name.length > 10 ? name : undefined}
        onClick={() => {
          if (type == 'open') {
            window.open('/#' + path);
          } else {
            history.replace(path!);
          }
        }}>
        {Boolean(icon) && <SettingOutlined />}
        {name} <Badge count={count} />
      </Item>
    )
  );
};

const find = (data, full, pathname = { path: '', name: '' }) =>
  data.reduce((pn, { path, name, children }) => {
    if (children) {
      return find(children, full, pn);
    }
    if (
      path.length > pn.path.length &&
      full.replace(/\/\d+/g, '').startsWith(path.replace(/\/\d+/g, ''))
    ) {
      return { path, name };
    }
    return pn;
  }, pathname);
