import styled from "styled-components";

export const UserMenuWrap = styled.div`
  position: relative;
`;

export const AvatarMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 6px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 30;
  min-width: 160px;
  overflow: hidden;
  padding: 4px 0;
`;

export const AvatarMenuName = styled.div`
  padding: 10px 14px 4px;
  font-size: 13px;
  font-weight: 600;
  color: #333;
`;

export const AvatarMenuEmail = styled.div`
  padding: 0 14px 8px;
  font-size: 11px;
  color: #999;
  border-bottom: 1px solid #eee;
  margin-bottom: 4px;
`;

export const AvatarMenuItem = styled.button`
  display: block;
  width: 100%;
  padding: 8px 14px;
  font-size: 13px;
  text-align: left;
  border: none;
  background: none;
  cursor: pointer;
  color: #333;

  &:hover {
    background: #f5f5f5;
  }
`;
