import { CodeType } from "../types";
import { Icon, Popup } from "semantic-ui-react";
import styled from "styled-components";

interface CodeProps {
  code: CodeType;
}

const BoxStyle = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

export const Code = ({ code }: CodeProps) => {
  const hiddenText = <>&#183;&#183;&#183;&#183;&#183;&#183;&#183;&#183;</>;

  if (code?.pin && code?.card) {
    return (
      <BoxStyle>
        {hiddenText}
        <Popup trigger={<Icon name="eye" />}>
          PIN: {code?.pin}
          <br />
          Card: {code?.card}
        </Popup>
      </BoxStyle>
    );
  } else if (code?.pin) {
    return (
      <BoxStyle>
        {hiddenText}
        <Popup trigger={<Icon name="eye" />}>PIN: {code?.pin}</Popup>
      </BoxStyle>
    );
  } else if (code?.card) {
    return (
      <BoxStyle>
        {hiddenText}
        <Popup trigger={<Icon name="eye" />}>Card: {code?.card}</Popup>
      </BoxStyle>
    );
  } else if (code?.plate) {
    return <div>{code?.plate}</div>;
  } else {
    return <div>{hiddenText}</div>;
  }
};
