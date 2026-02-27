"use client";

import { useSyncExternalStore, useState } from "react";
import { Button, TextField } from "@attain-sre/attain-design-system";
import * as Styled from "./page.styles";

function emptySubscribe() {
  return () => {};
}
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

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
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
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

  if (!mounted) return null;

  return (
    <Styled.PageContent>
      <Styled.SectionTitle>Pricing Calculator</Styled.SectionTitle>
      <Styled.Subtitle>
        Build a custom quote for your client in seconds.
      </Styled.Subtitle>

      <Styled.SectionTitleSmall>1. Select a tier</Styled.SectionTitleSmall>
      <Styled.TierCards>
        {tiers.map((t) => (
          <Styled.TierCard
            key={t.id}
            $selected={selectedTier === t.id}
            onClick={() => setSelectedTier(t.id)}
          >
            <Styled.TierName>{t.name}</Styled.TierName>
            <Styled.TierPrice>${t.price}/seat/mo</Styled.TierPrice>
            {t.features.map((f) => (
              <Styled.TierFeature key={f}>{f}</Styled.TierFeature>
            ))}
          </Styled.TierCard>
        ))}
      </Styled.TierCards>

      <Styled.SectionTitleSmall>2. Configure</Styled.SectionTitleSmall>
      <Styled.FormGrid>
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
      </Styled.FormGrid>

      <Styled.SectionTitleSmall>3. Quote Summary</Styled.SectionTitleSmall>
      <Styled.ResultCard>
        <Styled.ResultRow>
          <span>{tier.name} tier</span>
          <span>${tier.price}/seat/mo</span>
        </Styled.ResultRow>
        <Styled.ResultRow>
          <span>Seats</span>
          <span>{seatCount}</span>
        </Styled.ResultRow>
        <Styled.ResultRow>
          <span>Monthly subtotal</span>
          <span>${monthly.toLocaleString()}</span>
        </Styled.ResultRow>
        <Styled.ResultRow>
          <span>Contract ({monthCount} months)</span>
          <span>${total.toLocaleString()}</span>
        </Styled.ResultRow>
        {discount > 0 && (
          <Styled.ResultRow>
            <span>Annual discount (10%)</span>
            <Styled.DiscountAmount>
              -${(total * discount).toLocaleString()}
            </Styled.DiscountAmount>
          </Styled.ResultRow>
        )}
        <Styled.ResultRow>
          <span>Total</span>
          <span>${finalTotal.toLocaleString()}</span>
        </Styled.ResultRow>
      </Styled.ResultCard>

      <Button variant="contained" color="primary">
        Export Quote as PDF
      </Button>
    </Styled.PageContent>
  );
}
