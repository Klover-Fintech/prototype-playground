"use client";

import { useParams } from "next/navigation";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Frame = styled.iframe`
  width: 100%;
  flex: 1;
  border: none;
`;

export default function HtmlPrototypePage() {
  const { person, slug } = useParams<{ person: string; slug: string }>();

  return (
    <Wrapper>
      <Frame src={`/prototypes/${person}/${slug}/`} />
    </Wrapper>
  );
}
