import styled from "styled-components";
import { theme, TextField } from "@attain-sre/attain-design-system";

export const Page = styled.div`
  min-height: 100vh;
  background: #fafafa;
`;

export const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.borderDark};
  background: #fff;
`;

export const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing.xl} ${theme.spacing.lg};
`;

export const NameRow = styled.div`
  align-items: center;
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

export const NameInput = styled(TextField)`
  background-color: white;
`;

export const TabBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  border-bottom: 1px solid ${theme.colors.borderDark};
  margin-bottom: 0;
`;

export const TabsWrap = styled.div`
  flex: 1;
`;

export const EditorWrapper = styled.div`
  border: 1px solid ${theme.colors.borderDark};
  border-top: none;
  border-radius: 0 0 ${theme.spacing.xs} ${theme.spacing.xs};
  overflow: hidden;
  background: #fff;
  margin-bottom: ${theme.spacing.lg};
`;

export const DropZone = styled.div<{ $dragging: boolean }>`
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.xxl};
  background: ${({ $dragging }) => ($dragging ? "#e8f0fe" : "#fafafa")};
  border: 2px dashed ${({ $dragging }) => ($dragging ? "#1a73e8" : "#ddd")};
  border-radius: 0 0 ${theme.spacing.xs} ${theme.spacing.xs};
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
`;

export const DropText = styled.p`
  font-size: 16px;
  color: #666;
`;

export const DropSubtext = styled.p`
  font-size: 13px;
  color: #999;
`;

export const PreviewSection = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

export const PreviewFrame = styled.iframe`
  width: 100%;
  height: 400px;
  border: 1px solid ${theme.colors.borderDark};
  border-radius: ${theme.spacing.xs};
  background: #fff;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  align-items: center;
  flex-direction: row-reverse;
`;

export const SuccessBanner = styled.div`
  padding: 16px 20px;
  background: #e6f4ea;
  border: 1px solid #a8dab5;
  border-radius: 8px;
  margin-bottom: ${theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SuccessText = styled.span`
  font-size: 15px;
  color: #1e7e34;
`;

export const SuccessLink = styled.a`
  font-size: 14px;
  font-weight: 500;
  color: #1a73e8;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

export const ErrorBanner = styled.div`
  padding: 16px 20px;
  background: #fce8e6;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  margin-bottom: ${theme.spacing.lg};
  font-size: 14px;
  color: #c62828;
`;

export const CheckboxRow = styled.label`
  ${theme.typography.label}
  align-items: center;
  display: flex;
  cursor: pointer;
  margin-left: auto;
`;

export const PageHeading = styled.h1`
  font-size: 2rem;
  font-weight: 500;
  margin: 0 0 ${theme.spacing.lg} 0;
`;

export const LoadingBlock = styled.div`
  padding: ${theme.spacing.xxl};
  text-align: center;
  color: #999;
`;

export const VisuallyHiddenInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;
