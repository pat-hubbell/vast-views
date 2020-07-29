import React from "react";
import styled from "styled-components";
import { FormControlLabel, Switch } from "@material-ui/core";

import ImageOptions from "./ImageOptions";

export default function Header() {
  return (
    <>
      <Head.Container id="header-container">
        <Head.Left>
          <ImageOptions />
        </Head.Left>
        <Head.Middle>
          <Head.Title id="header-title">Vast Views</Head.Title>
        </Head.Middle>
        <Head.Right>
          <FormControlLabel control={<Switch />} label="Light" />
        </Head.Right>
      </Head.Container>
      <Head.Line />
    </>
  );
}

const ContentContainer = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
`;

const Head = {
  Container: styled.div`
    background-color: var(--header-background-color);
    background-image: var(--header-background-image);
    display: flex;
    height: 5rem;
    position: fixed;
    top: 0;
    width: 100%;
  `,
  Left: styled(ContentContainer)`
    position: relative;
    width: 30%;
  `,
  Middle: styled(ContentContainer)`
    width: 40%;
  `,
  Right: styled(ContentContainer)`
    width: 30%;
  `,
  Title: styled.h1`
    color: var(--primary);
    font-size: 2.3rem;
    letter-spacing: 3px;
    margin: 0;
  `,
  Line: styled.div`
    background-color: var(--gray);
    height: 1px;
    opacity: 0.37;
    width: 100%;
  `,
};
