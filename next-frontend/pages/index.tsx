import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Header, Segment, Form, Button } from "semantic-ui-react";
import styled from "styled-components";
import Head from "next/head";
import React, { useState } from "react";
import {
  useSession,
  signIn,
  signOut,
  getSession,
  SignInResponse,
} from "next-auth/react";
import { User } from "../types";
import axios from "axios";
import { GetServerSideProps } from "next";

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

const Box = styled(Segment)`
  width: 340px;
`;

const Footer = styled.span`
  color: #aaa;
  margin-top: 20px;
`;

interface LoginData {
  username: string;
  password: string;
}

const Login: NextPage = () => {
  const Router = useRouter();
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const doSignIn = () => {
    signIn("credentials", {
      username: data.username,
      password: data.password,
      callbackUrl: `${window.location.origin}/gates`,
      redirect: false,
    }).then((result: any) => Router.push(result?.url));
  };

  return (
    <Container>
      <Head>
        <title>Sign in - Gatekeeper</title>
      </Head>
      <Logo src="logo.svg"></Logo>
      <Header as="h3">Sign in to your account</Header>
      <Form size="large">
        <Box>
          <Form.Input
            name="username"
            value={data.username}
            onChange={(e: { target: { value: any } }) =>
              setData({ ...data, username: e.target.value })
            }
            fluid
            icon="user"
            iconPosition="left"
            placeholder="Username"
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
        </Box>
      </Form>
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
