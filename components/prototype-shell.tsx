"use client";

import styled from "styled-components";

const Shell = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  border-bottom: 1px solid #e0e0e0;
  background: #fff;
`;

const BackLink = styled.a`
  font-size: 14px;
  color: #1a73e8;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const PrototypeName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const Content = styled.main`
  flex: 1;
`;

interface PrototypeShellProps {
  name: string;
  children: React.ReactNode;
}

export default function PrototypeShell({
  name,
  children,
}: PrototypeShellProps) {
  return (
    <Shell>
      <TopBar>
        <BackLink href="/">&#8592; All Prototypes</BackLink>
        <PrototypeName>{name}</PrototypeName>
      </TopBar>
      <Content>{children}</Content>
    </Shell>
  );
}
