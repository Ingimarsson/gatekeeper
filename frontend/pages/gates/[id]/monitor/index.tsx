import type { NextPage } from "next";
import styled from "styled-components";
import Head from "next/head";
import React, { useState } from "react";

const Container = styled.div`
  background: #111;
  width: 100vw;
  display: flex;
  color: #eee;
  font-weight: 700;
  font-family: Roboto;
  flex-wrap: wrap-reverse;
`;

const MainColumn = styled.div`
  height: 100vh;
  flex-basis: 0;
  flex-grow: 3;

  @media (max-width: 600px) {
    display: none;
  }
`;

const SideColumn = styled.div`
  height: 100vh;
  background: #262626;
  flex-basis: 0;
  flex-grow: 1;
  display: flex;
  flex-flow: column;
  position: relative;
`;

const SideImage = styled.div`
  width: 100%;
  background: #111;
`;

const Status = styled.div`
  width: 100%;
  height: 9vh;
  line-height: 1.4;
  font-size: 6vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #333;
  font-weight: 700;
`;

const Reading = styled.div`
  display: flex;
  background: #333;
`;

const ReadingColumn = styled.div`
  height: 6vh;
  font-size: 3vh;
  flex-grow: 1;
  flex-basis: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
`;

const SideBox = styled.div`
  margin: 20px;
  font-size: 2.1vh;
  color: #eee;

  tr {
    height: 4.2vh;
  }
`;

const HistoryBox = styled.div`
  width: 100%;
  padding: 10px 20px;
  position: absolute;
  bottom: 0;
  font-size: 1.6vh;
  color: #ccc;
  background: #333;
  tr {
    height: 3.3vh;
  }
`;

const GateMonitor: NextPage = () => {
  return (
    <Container>
      <Head>
        <title>Live - Gatekeeper</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <MainColumn>
        <img
          src="/overview.jpg"
          style={{ height: "100%", width: "100%", objectFit: "cover" }}
        />
      </MainColumn>
      <SideColumn>
        <SideImage>
          {" "}
          <img
            src="/plate.jpg"
            style={{ height: "100%", width: "100%", objectFit: "cover" }}
          />
        </SideImage>
        <Status>RA232</Status>
        <Reading>
          <ReadingColumn style={{ background: "#922" }}>EXPIRED</ReadingColumn>
        </Reading>
        <SideBox>
          <table style={{ width: "100%" }}>
            <tr>
              <td style={{ color: "#ccc" }}>User</td>
              <td style={{ textAlign: "right" }}>Tjaldgestur</td>
            </tr>
            <tr>
              <td style={{ color: "#ccc" }}>Valid From</td>
              <td style={{ textAlign: "right" }}>01.03.2021 08:00</td>
            </tr>
            <tr>
              <td style={{ color: "#ccc" }}>Valid Until</td>
              <td style={{ textAlign: "right" }}>04.03.2021 14:00</td>
            </tr>
            <tr>
              <td style={{ color: "#ccc" }}>Adults</td>
              <td style={{ textAlign: "right" }}>2</td>
            </tr>
            <tr>
              <td style={{ color: "#ccc" }}>Children</td>
              <td style={{ textAlign: "right" }}>3</td>
            </tr>
          </table>
        </SideBox>
        <HistoryBox>
          {" "}
          <table style={{ width: "100%" }}>
            {Array(5)
              .fill(0)
              .map((idx, x) => (
                <tr key={idx}>
                  <td>Tjaldgestur</td>
                  <td>RA232</td>
                  <td style={{ textAlign: "right" }}>
                    {x * 2 + 2}m {x * 7}s
                  </td>
                </tr>
              ))}
          </table>
        </HistoryBox>
      </SideColumn>
    </Container>
  );
};

export default GateMonitor;
