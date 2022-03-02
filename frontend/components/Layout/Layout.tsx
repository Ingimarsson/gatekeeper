import React, { useEffect, useState } from "react";
import {
  Container,
  Dropdown,
  Header,
  Icon,
  Menu,
  Segment,
} from "semantic-ui-react";
import Link from "next/link";

import * as style from "./Layout.style";
import { ButtonBox } from "./Layout.style";
import { signOut, useSession } from "next-auth/react";
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
                  <Link href="/alerts" passHref={true}>
                    <Menu.Item>
                      <Icon name="mail" /> Email Alerts
                    </Menu.Item>
                  </Link>
                  <Link href="/status" passHref={true}>
                    <Menu.Item>
                      <Icon name="hdd" /> System Status
                    </Menu.Item>
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
                {/*
                <Link href="/logs" passHref={true}>
                  <Menu.Item>
                    <Icon name="desktop" /> Live View
                  </Menu.Item>
                </Link>
                */}
                <Dropdown
                  item
                  icon="user"
                  text={session.data?.user?.name ?? ""}
                  style={{ display: "flex", flexDirection: "row-reverse" }}
                >
                  <Dropdown.Menu>
                    <Link href="/alerts" passHref={true}>
                      <Menu.Item>
                        <Icon name="mail" /> Email Alerts
                      </Menu.Item>
                    </Link>
                    <Link href="/status" passHref={true}>
                      <Menu.Item>
                        <Icon name="hdd" /> System Status
                      </Menu.Item>
                    </Link>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={() =>
                        signOut({ redirect: false }).then(() =>
                          router.push("/")
                        )
                      }
                    >
                      <Icon name="sign-out" /> Sign out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
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
