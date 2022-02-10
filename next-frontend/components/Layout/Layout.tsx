import React, { useEffect, useState } from "react";
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
import { ButtonBox } from "./Layout.style";

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

  const [width, setWidth] = useState<number>(0);
  const handleWindowSizeChange = () => {
    if (typeof window !== "undefined") {
      setWidth(window?.innerWidth);
    }
  };

  useEffect(() => {
    handleWindowSizeChange();
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  return (
    <style.Container>
      <Menu fixed="top" inverted>
        <Container style={{ height: 50 }}>
          <Link href="/gates" passHref={true}>
            <Menu.Item header>
              <style.Logo src="/logo_white.svg" />
            </Menu.Item>
          </Link>
          {isMobile ? (
            <Menu.Menu position="right">
              <Dropdown item text="Menu">
                <Dropdown.Menu>
                  <Dropdown.Header
                    icon="user"
                    content={session.data?.user?.name}
                  />
                  <Dropdown.Divider />
                  <Link href="/gates" passHref={true}>
                    <Dropdown.Item>
                      <Icon name="unlock" /> Gates
                    </Dropdown.Item>
                  </Link>
                  <Link href="/users" passHref={true}>
                    <Dropdown.Item>
                      <Icon name="users" /> Users
                    </Dropdown.Item>
                  </Link>
                  <Link href="/logs" passHref={true}>
                    <Dropdown.Item>
                      <Icon name="list" /> Access Log
                    </Dropdown.Item>
                  </Link>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={() =>
                      signOut({ redirect: false }).then(() => router.push("/"))
                    }
                  >
                    <Icon name="sign-out" /> Sign out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Menu>
          ) : (
            <>
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
            </>
          )}
        </Container>
      </Menu>
      <Container>
        <style.Bar>
          <Header as="h2">{title}</Header>
          <ButtonBox>{buttons}</ButtonBox>
        </style.Bar>
        {segmented ? <Segment>{children}</Segment> : children}
      </Container>
    </style.Container>
  );
};
