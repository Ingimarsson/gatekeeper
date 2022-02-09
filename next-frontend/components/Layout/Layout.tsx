import React from "react";
import {
  Container,
  Menu,
  Dropdown,
  Segment,
  Header,
  Button,
  Icon,
} from "semantic-ui-react";
import Link from "next/link";

import * as style from "./Layout.style";

interface LayoutProps {
  title: string;
  segmented?: boolean;
  buttons: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  title,
  segmented = true,
  buttons = null,
  children,
}) => {
  return (
    <style.Container>
      <Menu fixed="top" inverted>
        <Container style={{ height: 50 }}>
          <Menu.Item header>
            <style.Logo src="/logo_white.svg" />
          </Menu.Item>
          <Link href="/gates" passHref={true}>
            <Menu.Item>
              <Icon name="unlock" /> Gates
            </Menu.Item>
          </Link>
          <Link href="/users" passHref={true}>
            <Menu.Item>
              <Icon name="users" /> Users
            </Menu.Item>
          </Link>
          <Link href="/logs" passHref={true}>
            <Menu.Item>
              <Icon name="list" /> Access Log
            </Menu.Item>
          </Link>
          <Menu.Menu position="right">
            <Menu.Item>
              <Icon name="user" />
              Brynjar Ingimarsson
            </Menu.Item>
            <Link href="/users" passHref={true}>
              <Menu.Item>
                <Icon name="sign-out" /> Sign out
              </Menu.Item>
            </Link>
          </Menu.Menu>
        </Container>
      </Menu>
      <Container>
        <style.Bar>
          <Header as="h2">{title}</Header>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {buttons}
          </div>
        </style.Bar>
        {segmented ? <Segment>{children}</Segment> : children}
      </Container>
    </style.Container>
  );
};
