"use client";

import { useState, useEffect } from "react";
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

const Loading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-size: 14px;
`;

export default function EmbedPrototypePage() {
  const { person, slug } = useParams<{ person: string; slug: string }>();
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/prototype-meta/${person}/${slug}`)
      .then((res) => res.json())
      .then((data) => setUrl(data.externalUrl || null))
      .catch(() => {});
  }, [person, slug]);

  if (!url) {
    return (
      <Wrapper>
        <Loading>Loading...</Loading>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Frame src={url} />
    </Wrapper>
  );
}
