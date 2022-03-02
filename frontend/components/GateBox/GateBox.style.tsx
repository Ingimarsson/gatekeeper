import styled from "styled-components";
import { Segment } from "semantic-ui-react";

export const Box = styled(Segment)`
  margin-bottom: 20px !important;
  overflow: hidden;
`;

export const GridContainer = styled.div`
  margin: -16px;
  overflow: hidden;
  display: flex;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

export const StreamColumn = styled.div`
  flex-grow: 1;
  flex-basis: 32px;
`;

export const ControlsColumn = styled.div`
  margin: 16px;
  flex-grow: 1;
  flex-basis: 0;

  @media (max-width: 600px) {
    margin-top: 8px;
  }
`;

export const LiveStreamBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
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
  flex-direction: column;
  @media (max-width: 600px) {
    align-items: center;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
`;

export const ReverseButtonRow = styled(ButtonRow)`
  flex-flow: row-reverse;
  margin-bottom: 0px;
`;
