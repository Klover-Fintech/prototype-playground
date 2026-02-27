import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

export const Dialog = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
`;

export const DialogTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
`;

export const DialogText = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 20px;
`;

export const DialogActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

export const DialogBtn = styled.button<{ $danger?: boolean }>`
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 5px;
  border: 1px solid ${({ $danger }) => ($danger ? "#c62828" : "#ddd")};
  background: ${({ $danger }) => ($danger ? "#c62828" : "#fff")};
  color: ${({ $danger }) => ($danger ? "#fff" : "#333")};
  cursor: pointer;

  &:hover {
    background: ${({ $danger }) => ($danger ? "#b71c1c" : "#f5f5f5")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
