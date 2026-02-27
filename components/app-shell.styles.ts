import Link from "next/link";
import styled from "styled-components";
import { theme } from "@attain-sre/attain-design-system";

export const SIDEBAR_WIDTH = 260;
export const HEADER_HEIGHT = 64;

export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const HeaderBar = styled.header<{ $collabHidden?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ $collabHidden }) => ($collabHidden ? 0 : theme.spacing.xs)};
  height: ${({ $collabHidden }) => ($collabHidden ? 0 : HEADER_HEIGHT)}px;
  min-height: 0;
  border-bottom: ${({ $collabHidden }) =>
    $collabHidden ? "none" : "1px solid #e0e0e0"};
  background: #fff;
  flex-shrink: 0;
  z-index: 10;
  overflow: hidden;
  transition:
    height 0.25s ease,
    padding 0.25s ease,
    border-width 0.25s ease;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 6px;
  color: #666;
  font-size: 18px;

  &:hover {
    background: #f0f0f0;
  }
`;

export const Logo = styled(Link)`
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  text-decoration: none;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Body = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

export const Sidebar = styled.aside<{ $collapsed: boolean }>`
  width: ${({ $collapsed }) => ($collapsed ? 0 : SIDEBAR_WIDTH)}px;
  min-width: ${({ $collapsed }) => ($collapsed ? 0 : SIDEBAR_WIDTH)}px;
  border-right: ${({ $collapsed }) =>
    $collapsed ? "none" : "1px solid #e0e0e0"};
  background: #fafafa;
  overflow-y: auto;
  overflow-x: hidden;
  transition:
    width 0.25s ease,
    min-width 0.25s ease,
    border-width 0.25s ease;
  flex-shrink: 0;
`;

export const SidebarContent = styled.div`
  padding: 16px 0;
`;

export const PersonGroup = styled.div`
  margin-bottom: 8px;
`;

export const PersonLabel = styled.div`
  padding: 6px 16px;
  font-size: 11px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const NavLink = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 32px 7px 24px;
  font-size: 13px;
  color: ${({ $active }) => ($active ? "#1a73e8" : "#333")};
  background: ${({ $active }) => ($active ? "#e8f0fe" : "transparent")};
  text-decoration: none;
  transition: background 0.1s ease;
  flex: 1;
  min-width: 0;

  &:hover {
    background: ${({ $active }) => ($active ? "#e8f0fe" : "#f0f0f0")};
  }
`;

export const TypeBadge = styled.span`
  font-size: 10px;
  color: #999;
  text-transform: uppercase;
  margin-left: auto;
  letter-spacing: 0.3px;
`;

export const NavItemRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  &:hover .nav-menu-btn {
    opacity: 1;
  }
`;

export const MenuButtonWrap = styled.div`
  position: relative;
`;

export const MenuBtn = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  color: #999;
  opacity: 0;
  transition: opacity 0.1s ease;
  z-index: 1;

  &:hover {
    background: #e0e0e0;
    color: #333;
  }
`;

export const ContextMenu = styled.div`
  position: absolute;
  right: 4px;
  top: 100%;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 20;
  min-width: 120px;
  overflow: hidden;
`;

export const MenuItem = styled.button<{ $danger?: boolean }>`
  display: block;
  width: 100%;
  padding: 8px 14px;
  font-size: 13px;
  text-align: left;
  border: none;
  background: none;
  cursor: pointer;
  color: ${({ $danger }) => ($danger ? "#c62828" : "#333")};

  &:hover {
    background: ${({ $danger }) => ($danger ? "#fce8e6" : "#f5f5f5")};
  }
`;

export const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  background: #fff;
  position: relative;
`;

export const CollaborationOverlayWrapper = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  height: 0;
  flex-shrink: 0;
  z-index: 4;
  pointer-events: none;
  overflow: visible;
`;

export const CollaborationOverlayViewport = styled.div<{
  $fullHeight?: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: ${({ $fullHeight }) =>
    $fullHeight ? "100vh" : `calc(100vh - ${HEADER_HEIGHT}px)`};
`;
