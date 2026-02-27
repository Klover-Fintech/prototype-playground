import styled from "styled-components";

export const PageContent = styled.div`
  padding: 32px 24px;
  max-width: 720px;
  margin: 0 auto;
`;

export const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
`;

export const SectionTitleSmall = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
`;

export const DiscountAmount = styled.span`
  color: #1e7e34;
`;

export const Subtitle = styled.p`
  font-size: 15px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 32px;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const TierCards = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const TierCard = styled.div<{ $selected: boolean }>`
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

export const TierName = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const TierPrice = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #1a73e8;
  margin-bottom: 8px;
`;

export const TierFeature = styled.div`
  font-size: 13px;
  color: #666;
  margin-bottom: 2px;
`;

export const ResultCard = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
`;

export const ResultRow = styled.div`
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
