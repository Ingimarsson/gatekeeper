import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Button, Form, Header, Icon, Message } from "semantic-ui-react";
import styled from "styled-components";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { getSession, signIn, signOut } from "next-auth/react";
import { useTranslation } from "react-i18next";

const Container = styled.div`
  background: #f8f8f8;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
`;

const Logo = styled.img`
  width: 300px;
  margin-bottom: 20px;
`;

const Box = styled.div`
  width: 340px;
  display: flex;
  flex-flow: column;
`;

const Footer = styled.span`
  color: #aaa;
  margin-top: 20px;
`;

interface LoginProps {
  signout?: boolean;
}

const Login: NextPage<LoginProps> = ({ signout = false }) => {
  const Router = useRouter();
  const { t } = useTranslation();

  const [data, setData] = useState({
    email: process.env.NEXT_MOCKING ? "harrison" : "",
    password: process.env.NEXT_MOCKING ? "ford!?123" : "",
  });

  useEffect(() => {
    if (signout) signOut({ redirect: false }).then(() => Router.push("/"));
  }, [signout]);

  const [error, setError] = useState<boolean>(false);

  const doSignIn = () => {
    signIn("credentials", {
      email: data.email,
      password: data.password,
      callbackUrl: `${window.location.origin}/gates`,
      redirect: false,
    }).then((result: any) => {
      console.log(result);
      result?.ok ? Router.push("/gates") : setError(true);
    });
  };

  return (
    <Container>
      <Head>
        <title>{t("sign-in", "Sign in")} - Gatekeeper</title>
      </Head>
      <Logo src="logo.svg"></Logo>
      <Header as="h3">
        {t("sign-in-to-account", "Sign in to your account")}
      </Header>
      <Box>
        <Form size="large">
          <Form.Input
            name="email"
            value={data.email}
            onChange={(e: { target: { value: any } }) =>
              setData({ ...data, email: e.target.value })
            }
            fluid
            icon="user"
            iconPosition="left"
            placeholder={t("email", "Email")}
          />
          <Form.Input
            name="password"
            value={data.password}
            onChange={(e: { target: { value: any } }) =>
              setData({ ...data, password: e.target.value })
            }
            fluid
            icon="lock"
            iconPosition="left"
            placeholder={t("password", "Password")}
            type="password"
          />
          <Button primary fluid size="large" onClick={() => doSignIn()}>
            {t("sign-in", "Sign in")}
          </Button>
        </Form>
        {error && (
          <Message error icon>
            <Icon name="exclamation triangle" />
            <Message.Content>
              <Message.Header>
                {t("sign-in-failed", "Sign in failed.")}
              </Message.Header>
              <p>
                {t(
                  "sign-in-failed-details",
                  "Make sure that your email and password are typed correctly."
                )}
              </p>
            </Message.Content>
          </Message>
        )}
        {process.env.NEXT_MOCKING && (
          <Message icon>
            <Icon name="info circle" />
            <Message.Content>
              <Message.Header>This is a demo instance.</Message.Header>
              <p>
                This instance is not connected to a real backend, it displays
                mock data instead.
              </p>
            </Message.Content>
          </Message>
        )}
      </Box>
      <Footer>Copyright &copy; Brynjar Ingimarsson 2020-2022</Footer>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  const signout = context.query.signout === "true";

  if (session && !signout) {
    return {
      redirect: {
        destination: "/gates",
        permanent: false,
      },
    };
  }
  return {
    props: {
      signout,
    },
  };
};

export default Login;
