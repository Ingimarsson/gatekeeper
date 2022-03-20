import { MethodType } from "../types";
import { Icon, Popup } from "semantic-ui-react";
import styled from "styled-components";

interface CodeProps {
  type: MethodType;
  code: string | null;
}

const BoxStyle = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

export const Code = ({ type, code }: CodeProps) => {
  const hiddenText = <>&#183;&#183;&#183;&#183;&#183;&#183;&#183;&#183;</>;

  if (type.includes("keypad") && !code) {
    return <BoxStyle>{hiddenText}</BoxStyle>;
  } else if (type == "keypad-both") {
    return (
      <BoxStyle>
        {hiddenText}
        <Popup trigger={<Icon name="eye" />}>
          PIN: {code?.split("-")[0]}
          <br />
          Card: {code?.split("-")[1]}
        </Popup>
      </BoxStyle>
    );
  } else if (type == "keypad-pin") {
    return (
      <BoxStyle>
        {hiddenText}
        <Popup trigger={<Icon name="eye" />}>PIN: {code}</Popup>
      </BoxStyle>
    );
  } else if (type == "keypad-card") {
    return (
      <BoxStyle>
        {hiddenText}
        <Popup trigger={<Icon name="eye" />}>Card: {code}</Popup>
      </BoxStyle>
    );
  } else if (type == "plate") {
    return <div>{code}</div>;
  } else {
    return <div />;
  }
};
