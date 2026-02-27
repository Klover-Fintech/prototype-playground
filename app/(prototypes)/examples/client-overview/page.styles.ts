import styled from "styled-components";

export const PageContent = styled.div`
  padding: 32px 24px;
  max-width: 1040px;
  margin: 0 auto;
`;

export const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
`;

export const Subtitle = styled.p`
  font-size: 15px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 24px;
`;

export const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const StatValue = styled.div<{ $color?: string }>`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 2px;
  color: ${({ $color }) => $color ?? "inherit"};
`;

export const StatLabel = styled.div`
  font-size: 13px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const TableWrapper = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 24px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #666;
  background: #fafafa;
  border-bottom: 1px solid #e0e0e0;
`;

export const Td = styled.td<{ $bold?: boolean }>`
  padding: 12px 16px;
  font-size: 14px;
  border-bottom: 1px solid #f0f0f0;
  font-weight: ${({ $bold }) => ($bold ? 500 : "inherit")};
`;

export const StatusBadge = styled.span<{ $status: string }>`
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
