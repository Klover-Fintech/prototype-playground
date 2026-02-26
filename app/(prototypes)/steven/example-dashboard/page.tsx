"use client";

import styled from "styled-components";
import { Button } from "@attain-sre/attain-design-system";
import { Card } from "@attain-sre/attain-design-system";
import { TextField } from "@attain-sre/attain-design-system";
import PrototypeShell from "@/components/prototype-shell";

const PageContent = styled.div`
  padding: 32px 24px;
  max-width: 960px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
`;

const Description = styled.p`
  font-size: 15px;
  color: #666;
  margin-bottom: 24px;
  line-height: 1.6;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const MetricValue = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: #1a73e8;
  margin-bottom: 4px;
`;

const MetricLabel = styled.div`
  font-size: 14px;
  color: #666;
`;

const FormRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
`;

export default function ExampleDashboard() {
  return (
    <PrototypeShell name="Example Dashboard">
      <PageContent>
        <SectionTitle>Dashboard Overview</SectionTitle>
        <Description>
          This example prototype uses the Attain Design System components. It
          demonstrates how to combine Card, Button, and TextField in a prototype
          page.
        </Description>

        <CardGrid>
          <Card>
            <MetricValue>1,247</MetricValue>
            <MetricLabel>Active Accounts</MetricLabel>
          </Card>
          <Card>
            <MetricValue>$842K</MetricValue>
            <MetricLabel>Pipeline Value</MetricLabel>
          </Card>
          <Card>
            <MetricValue>94%</MetricValue>
            <MetricLabel>Retention Rate</MetricLabel>
          </Card>
        </CardGrid>

        <SectionTitle>Quick Search</SectionTitle>
        <FormRow>
          <TextField
            label="Search accounts"
            variant="outlined"
            size="small"
            sx={{ flex: 1, minWidth: 200 }}
          />
          <Button variant="contained" color="primary">
            Search
          </Button>
        </FormRow>

        <SectionTitle>Actions</SectionTitle>
        <ButtonRow>
          <Button variant="contained" color="primary">
            New Account
          </Button>
          <Button variant="outlined" color="secondary">
            Export Report
          </Button>
          <Button variant="outlined" color="subtle">
            Settings
          </Button>
        </ButtonRow>
      </PageContent>
    </PrototypeShell>
  );
}
