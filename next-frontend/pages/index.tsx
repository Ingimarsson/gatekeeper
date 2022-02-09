import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Header, Segment, Form, Button } from "semantic-ui-react";
import styled from "styled-components";
import Head from "next/head";
import React from "react";

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

const Login: NextPage = () => {
  const Router = useRouter();
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
            fluid
            icon="user"
            iconPosition="left"
            placeholder="Username"
          />
          <Form.Input
            name="password"
            fluid
            icon="lock"
            iconPosition="left"
            placeholder="Password"
            type="password"
          />
          <Button
            primary
            fluid
            size="large"
            onClick={() => Router.push("/gates")}
          >
            Sign in
          </Button>
        </Box>
      </Form>
      <Footer>Copyright &copy; Brynjar Ingimarsson 2020-2022</Footer>
    </Container>
  );
};

export default Login;
