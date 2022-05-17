import React, { useEffect, useState } from "react";
import { Modal } from "../../pages/cockpit";

interface InstructionsModalProps {
  close: () => void;
}

export const InstructionsModal = ({ close }: InstructionsModalProps) => {
  const [time, setTime] = useState<number>(30);

  // Set up clock interval.
  useEffect(() => {
    const id = setInterval(() => {
      if (time <= 1) {
        close();
      }
      setTime(time - 1);
    }, 1000);

    return () => clearInterval(id);
  }, [time]);

  return (
    <Modal>
      <h1>Cockpit Mode</h1>
      <h3>Welcome to the fullscreen mode of Gatekeeper</h3>
      <div
        style={{
          height: "40vh",
          width: "60vw",
          margin: "3vw",
          display: "flex",
        }}
      >
        <div
          style={{
            width: "55%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img src="/keypad.svg" style={{ height: "100%" }} />
        </div>
        <div style={{ width: "45%", height: "100%" }}>
          <table>
            <tr>
              <td style={{ width: "6vw" }}>
                <h3>[1-9]</h3>
              </td>
              <td>
                <h3>Select screen</h3>
              </td>
            </tr>
            <br />
            <tr>
              <td>
                <h3>[+]</h3>
              </td>
              <td>
                <h3>Open gate</h3>
              </td>
            </tr>
            <tr>
              <td>
                <h3>[-]</h3>
              </td>
              <td>
                <h3>Close gate</h3>
              </td>
            </tr>
            <tr>
              <td>
                <h3>[ENTER]</h3>
              </td>
              <td>
                <h3>Confirm action</h3>
              </td>
            </tr>
            <tr>
              <td>
                <h3>[.]</h3>
              </td>
              <td>
                <h3>Cancel</h3>
              </td>
            </tr>
            <br />
            <tr>
              <td>
                <h3>[*]</h3>
              </td>
              <td>
                <h3>Toggle fixed / rotating screen</h3>
              </td>
            </tr>
            <tr>
              <td>
                <h3>[/]</h3>
              </td>
              <td>
                <h3>Refresh display</h3>
              </td>
            </tr>
          </table>
          <br />
          <h3>Press [ENTER] to close this help screen</h3>
          <h3>This screen closes in {time} seconds</h3>
        </div>
      </div>
    </Modal>
  );
};
