"use client";

import styled from "styled-components";
import { Button } from "@attain-sre/attain-design-system";
import { Card } from "@attain-sre/attain-design-system";

const PageContent = styled.div`
  padding: 32px 24px;
  max-width: 1040px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 24px;
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 2px;
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableWrapper = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 24px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #666;
  background: #fafafa;
  border-bottom: 1px solid #e0e0e0;
`;

const Td = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  border-bottom: 1px solid #f0f0f0;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${({ $status }) =>
    $status === "active"
      ? "#e6f4ea"
      : $status === "pending"
        ? "#fef7e0"
        : "#fce8e6"};
  color: ${({ $status }) =>
    $status === "active"
      ? "#1e7e34"
      : $status === "pending"
        ? "#b45309"
        : "#c62828"};
`;

const clients = [
  {
    name: "Acme Corp",
    contact: "Sarah Chen",
    value: "$240K",
    status: "active",
  },
  {
    name: "Globex Inc",
    contact: "Mike Ross",
    value: "$185K",
    status: "active",
  },
  {
    name: "Initech",
    contact: "Bill Lumbergh",
    value: "$92K",
    status: "pending",
  },
  {
    name: "Umbrella Co",
    contact: "Jill Valentine",
    value: "$310K",
    status: "active",
  },
  {
    name: "Stark Industries",
    contact: "Pepper Potts",
    value: "$520K",
    status: "pending",
  },
  {
    name: "Wayne Enterprises",
    contact: "Lucius Fox",
    value: "$415K",
    status: "active",
  },
];

export default function ClientOverview() {
  return (
    <PageContent>
      <SectionTitle>Client Portfolio</SectionTitle>
      <Subtitle>
        Overview of active and pending client accounts for Q1 2026.
      </Subtitle>

      <StatsRow>
        <Card>
          <StatValue style={{ color: "#1a73e8" }}>6</StatValue>
          <StatLabel>Total Clients</StatLabel>
        </Card>
        <Card>
          <StatValue style={{ color: "#1e7e34" }}>$1.76M</StatValue>
          <StatLabel>Total Value</StatLabel>
        </Card>
        <Card>
          <StatValue style={{ color: "#1a73e8" }}>4</StatValue>
          <StatLabel>Active</StatLabel>
        </Card>
        <Card>
          <StatValue style={{ color: "#b45309" }}>2</StatValue>
          <StatLabel>Pending</StatLabel>
        </Card>
      </StatsRow>

      <SectionTitle>Client List</SectionTitle>
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th>Company</Th>
              <Th>Contact</Th>
              <Th>Value</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.name}>
                <Td style={{ fontWeight: 500 }}>{c.name}</Td>
                <Td>{c.contact}</Td>
                <Td>{c.value}</Td>
                <Td>
                  <StatusBadge $status={c.status}>{c.status}</StatusBadge>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>

      <Button variant="contained" color="primary">
        Add New Client
      </Button>
    </PageContent>
  );
}
