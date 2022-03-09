import type { NextPage } from "next";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Button, Form, Header, Icon, Message } from "semantic-ui-react";
import styled from "styled-components";
import Head from "next/head";
import React, { useState } from "react";
import { getSession, signIn } from "next-auth/react";

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

const Login: NextPage = () => {
  const Router = useRouter();
  const [data, setData] = useState({
    email: process.env.NEXT_MOCKING ? "harrison" : "",
    password: process.env.NEXT_MOCKING ? "ford!?123" : "",
  });

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
        <title>Sign in - Gatekeeper</title>
      </Head>
      <Logo src="logo.svg"></Logo>
      <Header as="h3">Sign in to your account</Header>
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
            placeholder="Email"
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
            placeholder="Password"
            type="password"
          />
          <Button primary fluid size="large" onClick={() => doSignIn()}>
            Sign in
          </Button>
        </Form>
        {error && (
          <Message error icon>
            <Icon name="exclamation triangle" />
            <Message.Content>
              <Message.Header>Sign in failed.</Message.Header>
              <p>Make sure that your email and password are typed correctly.</p>
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

  if (session) {
    return {
      redirect: {
        destination: "/gates",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default Login;
