import styled from "styled-components";

export const LoginPageWrap = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

export const LoginCard = styled.div`
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 48px 40px;
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

export const LoginTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
`;

export const LoginSubtitle = styled.p`
  font-size: 15px;
  color: #666;
  margin-bottom: 32px;
`;

export const GoogleButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: #fff;
  border: 1px solid #dadce0;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 500;
  color: #3c4043;
  cursor: pointer;
`;
