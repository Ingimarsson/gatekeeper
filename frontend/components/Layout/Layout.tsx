import React, { useEffect, useState } from "react";
import {
  Container,
  Dropdown,
  Flag,
  Header,
  Icon,
  Menu,
  Segment,
} from "semantic-ui-react";
import Link from "next/link";
import i18n from "../../i18n";
import * as style from "./Layout.style";
import { ButtonBox } from "./Layout.style";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

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
                      <Icon name="unlock" /> {t("gates", "Gates")}
                    </Dropdown.Item>
                  </Link>
                  <Link href="/users" passHref={true}>
                    <Dropdown.Item>
                      <Icon name="users" /> {t("users", "Users")}
                    </Dropdown.Item>
                  </Link>
                  <Link href="/logs" passHref={true}>
                    <Dropdown.Item>
                      <Icon name="list" /> {t("access-log", "Access Log")}
                    </Dropdown.Item>
                  </Link>
                  <Dropdown.Divider />
                  <Link href="/alerts" passHref={true}>
                    <Menu.Item>
                      <Icon name="mail" /> {t("email-alerts", "Email Alerts")}
                    </Menu.Item>
                  </Link>
                  <Link href="/status" passHref={true}>
                    <Menu.Item>
                      <Icon name="hdd" /> {t("system-status", "System Status")}
                    </Menu.Item>
                  </Link>
                  <Dropdown.Divider />
                  {i18n.language === "en" ? (
                    <Menu.Item onClick={() => changeLanguage("is")}>
                      <Flag name="is" /> Íslenska
                    </Menu.Item>
                  ) : (
                    <Menu.Item onClick={() => changeLanguage("en")}>
                      <Flag name="gb" /> English
                    </Menu.Item>
                  )}
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={() =>
                      signOut({ redirect: false }).then(() => router.push("/"))
                    }
                  >
                    <Icon name="sign-out" /> {t("sign-out", "Sign Out")}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Menu>
          ) : (
            <>
              <Link href="/gates" passHref={true}>
                <Menu.Item>
                  <Icon name="unlock" /> {t("gates", "Gates")}
                </Menu.Item>
              </Link>
              <Link href="/users" passHref={true}>
                <Menu.Item>
                  <Icon name="users" /> {t("users", "Users")}
                </Menu.Item>
              </Link>
              <Link href="/logs" passHref={true}>
                <Menu.Item>
                  <Icon name="list" /> {t("access-log", "Access Log")}
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
                    {" "}
                    {i18n.language === "en" ? (
                      <Menu.Item onClick={() => changeLanguage("is")}>
                        <Flag name="is" /> Íslenska
                      </Menu.Item>
                    ) : (
                      <Menu.Item onClick={() => changeLanguage("en")}>
                        <Flag name="gb" /> English
                      </Menu.Item>
                    )}
                    <Dropdown.Divider />
                    <Link href="/alerts" passHref={true}>
                      <Menu.Item>
                        <Icon name="mail" /> {t("email-alerts", "Email Alerts")}
                      </Menu.Item>
                    </Link>
                    <Link href="/status" passHref={true}>
                      <Menu.Item>
                        <Icon name="hdd" />{" "}
                        {t("system-status", "System Status")}
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
                      <Icon name="sign-out" /> {t("sign-out", "Sign Out")}
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
