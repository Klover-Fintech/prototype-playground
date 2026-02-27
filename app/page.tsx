"use client";

import * as Styled from "./page.styles";

export default function Home() {
  return (
    <Styled.Container>
      <Styled.Inner>
        <Styled.Title>Welcome to Prototype Playground</Styled.Title>
        <Styled.Subtitle>
          Select a prototype from the sidebar, or create a new one.
        </Styled.Subtitle>
      </Styled.Inner>
    </Styled.Container>
  );
}
