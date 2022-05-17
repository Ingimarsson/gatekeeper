import styled from "styled-components";

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-wrap: wrap-reverse;
  position: relative;
`;

export const MainColumn = styled.div`
  height: 100vh;
  flex-basis: 0;
  flex-grow: 3;

  @media (max-width: 600px) {
    display: none;
  }
`;

export const SideColumn = styled.div`
  height: 100vh;
  background: #181818;
  flex-basis: 0;
  flex-grow: 1;
  display: flex;
  flex-flow: column;
  position: relative;
`;

export const SideImage = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  background: #111;
`;

export const Status = styled.div`
  width: 100%;
  height: 9vh;
  line-height: 1.4;
  font-size: 5vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #222;
  font-weight: 700;
`;

export const Reading = styled.div`
  display: flex;
  background: #222;
`;

export const ReadingColumn = styled.div`
  height: 6vh;
  font-size: 3vh;
  flex-grow: 1;
  flex-basis: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
`;

export const SideBox = styled.div`
  margin: 20px;
  font-size: 2.1vh;
  color: #eee;

  tr {
    height: 4.2vh;
  }
`;

export const HistoryBox = styled.div`
  width: 100%;
  padding: 10px 20px;
  position: absolute;
  bottom: 0;
  font-size: 1.6vh;
  color: #ccc;
  background: #222;
  tr {
    height: 3.3vh;
  }
`;

export const LabelRow = styled.div`
  display: flex;
  gap: 10px;
`;

export const Image = styled.img`
  height: 100%;
  width: 100%;
  object-fit: contain;
  text-indent: -10000px;
`;

export const CameraColumn = styled.div`
  margin-top: 6vh;
  height: 94vh;
  flex-basis: 0;
  flex-grow: 1;
`;

export const CameraCell = styled.div`
  height: 50%;
  width: 100%;
  position: relative;
`;

export const CameraLabel = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  color: #fff;
  background: #000b;
  padding: 1vh 1.5vh;
  font-size: 2vh;
  display: flex;
  flex-align: center;
`;
