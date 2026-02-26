"use client";

import styled from "styled-components";
import { useSession, signOut } from "next-auth/react";
import type { Prototype } from "@/lib/prototypes";

const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 48px 24px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 48px;
`;

const HeaderLeft = styled.div``;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #666;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`;

const UserAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

const UserName = styled.span`
  font-size: 14px;
  color: #666;
`;

const SignOutButton = styled.button`
  font-size: 13px;
  color: #999;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #333;
  }
`;

const PersonSection = styled.section`
  margin-bottom: 40px;
`;

const PersonName = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  text-transform: capitalize;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const Card = styled.a`
  display: block;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:hover {
    border-color: #1a73e8;
    box-shadow: 0 2px 8px rgba(26, 115, 232, 0.1);
  }
`;

const CardTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 4px;
`;

const CardMeta = styled.span`
  font-size: 13px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 24px;
  color: #999;
`;

const EmptyTitle = styled.h2`
  font-size: 20px;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
`;

export default function DirectoryPage({
  entries,
}: {
  entries: [string, Prototype[]][];
}) {
  const { data: session } = useSession();

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Title>Prototype Playground</Title>
          <Subtitle>A shared space for sales prototypes</Subtitle>
        </HeaderLeft>
        {session?.user && (
          <UserInfo>
            {session.user.image && (
              <UserAvatar
                src={session.user.image}
                alt={session.user.name ?? ""}
              />
            )}
            <div>
              <UserName>{session.user.name}</UserName>
              <br />
              <SignOutButton onClick={() => signOut()}>Sign out</SignOutButton>
            </div>
          </UserInfo>
        )}
      </Header>

      {entries.length === 0 ? (
        <EmptyState>
          <EmptyTitle>No prototypes yet</EmptyTitle>
          <p>
            Create a folder under <code>app/(prototypes)/your-name/</code> to
            get started.
          </p>
        </EmptyState>
      ) : (
        entries.map(([person, prototypes]) => (
          <PersonSection key={person}>
            <PersonName>{person}</PersonName>
            <Grid>
              {prototypes.map((proto) => (
                <Card
                  key={proto.href}
                  href={proto.href}
                  target={proto.type === "html" ? "_blank" : undefined}
                  rel={
                    proto.type === "html" ? "noopener noreferrer" : undefined
                  }
                >
                  <CardTitle>{proto.slug.replace(/-/g, " ")}</CardTitle>
                  <CardMeta>{proto.type}</CardMeta>
                </Card>
              ))}
            </Grid>
          </PersonSection>
        ))
      )}
    </Container>
  );
}
