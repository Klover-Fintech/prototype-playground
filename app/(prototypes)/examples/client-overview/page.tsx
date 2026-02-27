"use client";

import { Button, Card } from "@attain-sre/attain-design-system";
import * as Styled from "./page.styles";

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
    <Styled.PageContent>
      <Styled.SectionTitle>Client Portfolio</Styled.SectionTitle>
      <Styled.Subtitle>
        Overview of active and pending client accounts for Q1 2026.
      </Styled.Subtitle>

      <Styled.StatsRow>
        <Card>
          <Styled.StatValue $color="#1a73e8">6</Styled.StatValue>
          <Styled.StatLabel>Total Clients</Styled.StatLabel>
        </Card>
        <Card>
          <Styled.StatValue $color="#1e7e34">$1.76M</Styled.StatValue>
          <Styled.StatLabel>Total Value</Styled.StatLabel>
        </Card>
        <Card>
          <Styled.StatValue $color="#1a73e8">4</Styled.StatValue>
          <Styled.StatLabel>Active</Styled.StatLabel>
        </Card>
        <Card>
          <Styled.StatValue $color="#b45309">2</Styled.StatValue>
          <Styled.StatLabel>Pending</Styled.StatLabel>
        </Card>
      </Styled.StatsRow>

      <Styled.SectionTitle>Client List</Styled.SectionTitle>
      <Styled.TableWrapper>
        <Styled.Table>
          <thead>
            <tr>
              <Styled.Th>Company</Styled.Th>
              <Styled.Th>Contact</Styled.Th>
              <Styled.Th>Value</Styled.Th>
              <Styled.Th>Status</Styled.Th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.name}>
                <Styled.Td $bold>{c.name}</Styled.Td>
                <Styled.Td>{c.contact}</Styled.Td>
                <Styled.Td>{c.value}</Styled.Td>
                <Styled.Td>
                  <Styled.StatusBadge $status={c.status}>
                    {c.status}
                  </Styled.StatusBadge>
                </Styled.Td>
              </tr>
            ))}
          </tbody>
        </Styled.Table>
      </Styled.TableWrapper>

      <Button variant="contained" color="primary">
        Add New Client
      </Button>
    </Styled.PageContent>
  );
}
