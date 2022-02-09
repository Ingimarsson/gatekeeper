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
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const session = useSession();

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
              {session.data?.user?.name}
            </Menu.Item>
            <Menu.Item
              onClick={() =>
                signOut({ redirect: false }).then(() => router.push("/"))
              }
            >
              <Icon name="sign-out" /> Sign out
            </Menu.Item>
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
