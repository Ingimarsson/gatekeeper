import styled from "styled-components";

export const Container = styled.div`
  margin-top: 80px;
`;

export const Logo = styled.img`
  width: 100px !important;
`;

export const Bar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin-bottom: 0 !important;
  }

  @media (max-width: 600px) {
    flex-wrap: wrap;
    gap: 10px;
  }
`;
