import styled from "styled-components";
import { Segment } from "semantic-ui-react";

export const Box = styled(Segment)`
  margin-bottom: 20px !important;
`;

export const LiveStreamBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
  width: 100%;
  max-width: 250px;
  margin: 0 auto;
  background: #444;

  @media (max-width: 600px) {
    max-width: none;
    height: auto;
    aspect-ratio: 1.5;
  }
`;

export const Logo = styled.img`
  width: 100px;
`;

export const ControlsBox = styled.div`
  height: 150px;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
`;

export const TopControlsBox = styled.div`
  display: flex;
  flex-flow: wrap;
  align-items: center;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 4px;
`;

export const ReverseButtonRow = styled(ButtonRow)`
  flex-flow: row-reverse;
`;
