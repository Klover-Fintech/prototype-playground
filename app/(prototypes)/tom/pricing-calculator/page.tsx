"use client";

import { useState } from "react";
import styled from "styled-components";
import { Button } from "@attain-sre/attain-design-system";
import { TextField } from "@attain-sre/attain-design-system";
import { Card } from "@attain-sre/attain-design-system";
import PrototypeShell from "@/components/prototype-shell";

const PageContent = styled.div`
  padding: 32px 24px;
  max-width: 720px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 32px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const TierCards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const TierCard = styled.div<{ $selected: boolean }>`
  border: 2px solid ${({ $selected }) => ($selected ? "#1a73e8" : "#e0e0e0")};
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: border-color 0.15s ease;
  background: ${({ $selected }) => ($selected ? "#f0f6ff" : "#fff")};

  &:hover {
    border-color: #1a73e8;
  }
`;

const TierName = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const TierPrice = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #1a73e8;
  margin-bottom: 8px;
`;

const TierFeature = styled.div`
  font-size: 13px;
  color: #666;
  margin-bottom: 2px;
`;

const ResultCard = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
`;

const ResultRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 15px;
  border-bottom: 1px solid #e8e8e8;

  &:last-child {
    border-bottom: none;
    font-weight: 600;
    font-size: 18px;
    padding-top: 12px;
  }
`;

const tiers = [
  {
    id: "starter",
    name: "Starter",
    price: 5,
    features: ["Up to 10K users", "Email support", "Basic analytics"],
  },
  {
    id: "growth",
    name: "Growth",
    price: 12,
    features: ["Up to 100K users", "Priority support", "Advanced analytics"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 25,
    features: ["Unlimited users", "Dedicated CSM", "Custom integrations"],
  },
];

export default function PricingCalculator() {
  const [selectedTier, setSelectedTier] = useState("growth");
  const [seats, setSeats] = useState("50");
  const [months, setMonths] = useState("12");

  const tier = tiers.find((t) => t.id === selectedTier)!;
  const seatCount = Math.max(1, parseInt(seats) || 1);
  const monthCount = Math.max(1, parseInt(months) || 1);
  const monthly = tier.price * seatCount;
  const total = monthly * monthCount;
  const discount = monthCount >= 12 ? 0.1 : 0;
  const finalTotal = total * (1 - discount);

  return (
    <PrototypeShell name="Pricing Calculator">
      <PageContent>
        <SectionTitle>Pricing Calculator</SectionTitle>
        <Subtitle>Build a custom quote for your client in seconds.</Subtitle>

        <SectionTitle style={{ fontSize: 18 }}>1. Select a tier</SectionTitle>
        <TierCards>
          {tiers.map((t) => (
            <TierCard
              key={t.id}
              $selected={selectedTier === t.id}
              onClick={() => setSelectedTier(t.id)}
            >
              <TierName>{t.name}</TierName>
              <TierPrice>${t.price}/seat/mo</TierPrice>
              {t.features.map((f) => (
                <TierFeature key={f}>{f}</TierFeature>
              ))}
            </TierCard>
          ))}
        </TierCards>

        <SectionTitle style={{ fontSize: 18 }}>2. Configure</SectionTitle>
        <FormGrid>
          <TextField
            label="Number of seats"
            type="number"
            variant="outlined"
            size="small"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
          />
          <TextField
            label="Contract length (months)"
            type="number"
            variant="outlined"
            size="small"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
          />
        </FormGrid>

        <SectionTitle style={{ fontSize: 18 }}>3. Quote Summary</SectionTitle>
        <ResultCard>
          <ResultRow>
            <span>{tier.name} tier</span>
            <span>${tier.price}/seat/mo</span>
          </ResultRow>
          <ResultRow>
            <span>Seats</span>
            <span>{seatCount}</span>
          </ResultRow>
          <ResultRow>
            <span>Monthly subtotal</span>
            <span>${monthly.toLocaleString()}</span>
          </ResultRow>
          <ResultRow>
            <span>Contract ({monthCount} months)</span>
            <span>${total.toLocaleString()}</span>
          </ResultRow>
          {discount > 0 && (
            <ResultRow>
              <span>Annual discount (10%)</span>
              <span style={{ color: "#1e7e34" }}>
                -${(total * discount).toLocaleString()}
              </span>
            </ResultRow>
          )}
          <ResultRow>
            <span>Total</span>
            <span>${finalTotal.toLocaleString()}</span>
          </ResultRow>
        </ResultCard>

        <Button variant="contained" color="primary">
          Export Quote as PDF
        </Button>
      </PageContent>
    </PrototypeShell>
  );
}
