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
  background: #444;
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

export const ButtonRow = styled.div`
  display: flex;
  gap: 4px;
`;

export const ReverseButtonRow = styled(ButtonRow)`
  flex-flow: row-reverse;
`;
