import styled from "styled-components";
import { Button } from "@attain-sre/attain-design-system";

/* Overlay canvas follows prototype scroll (one-way: prototype scroll → overlay). Panning the whiteboard does not scroll the prototype. */
export const WhiteboardPanel = styled.div<{ $scrollTop: number }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
  pointer-events: none;

  & > .tl-container {
    pointer-events: auto;
  }

  .tl-background {
    background: transparent !important;
  }

  .tl-canvas {
    background: transparent !important;
    transform: translateY(-${({ $scrollTop }) => $scrollTop}px);
    will-change: transform;
  }

  .tl-grid {
    display: none !important;
  }
`;

export const CollabBanner = styled.div`
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 11;
  background: rgba(26, 115, 232, 0.9);
  color: #fff;
  padding: 4px 14px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  pointer-events: none;
  white-space: nowrap;
`;

export const CollabButtonWrap = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 10;
  pointer-events: auto;
`;

export const CollabButton = styled(Button)`
  border-radius: 20px;
  text-transform: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;
