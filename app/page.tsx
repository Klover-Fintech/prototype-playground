"use client";

import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 48px 24px;
  color: #999;
`;

const Inner = styled.div`
  text-align: center;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 15px;
  line-height: 1.6;
`;

export default function Home() {
  return (
    <Container>
      <Inner>
        <Title>Welcome to Prototype Playground</Title>
        <Subtitle>
          Select a prototype from the sidebar, or create a new one.
        </Subtitle>
      </Inner>
    </Container>
  );
}
