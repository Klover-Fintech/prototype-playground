"use client";

import { useRef } from "react";
import { Tldraw } from "tldraw";
import type { Editor } from "tldraw";
import { useSyncDemo } from "@tldraw/sync";
import "tldraw/tldraw.css";
import styled from "styled-components";
import { Button } from "@attain-sre/attain-design-system";
import { usePrototypeScroll } from "@/context/prototype-scroll-context";

/* Overlay canvas follows prototype scroll (one-way: prototype scroll → overlay). Panning the whiteboard does not scroll the prototype. */
const WhiteboardPanel = styled.div<{ $scrollTop: number }>`
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

const CollabBanner = styled.div`
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

function CollaborativeTldraw({
  roomId,
  scrollTop,
}: {
  roomId: string;
  scrollTop: number;
}) {
  const store = useSyncDemo({ roomId });
  const onMount = useRef((editor: Editor) => {
    editor.setCameraOptions({ isLocked: true });
    editor.updateInstanceState({ isFocusMode: false });
    const interval = setInterval(() => {
      if (editor.getInstanceState().isFocusMode) {
        editor.updateInstanceState({ isFocusMode: false });
      }
    }, 1000);
    return () => clearInterval(interval);
  });
  const licenseKey = process.env.NEXT_PUBLIC_TLDRAW_LICENSE_KEY ?? undefined;

  return (
    <WhiteboardPanel $scrollTop={scrollTop}>
      <Tldraw
        store={store}
        autoFocus
        onMount={onMount.current}
        licenseKey={licenseKey}
      />
    </WhiteboardPanel>
  );
}

export interface CollaborationOverlayProps {
  roomId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CollaborationOverlay({
  roomId,
  open,
  onOpenChange,
}: CollaborationOverlayProps) {
  const { scrollTop } = usePrototypeScroll();

  return (
    <>
      {open && (
        <>
          <CollaborativeTldraw roomId={roomId} scrollTop={scrollTop} />
          <CollabBanner>Collaboration mode — draw to annotate</CollabBanner>
        </>
      )}

      <div
        style={{
          position: "absolute",
          bottom: 16,
          right: 16,
          zIndex: 10,
          pointerEvents: "auto",
        }}
      >
        <Button
          variant="contained"
          color={open ? "error" : "primary"}
          onClick={() => onOpenChange(!open)}
          sx={{
            borderRadius: "20px",
            textTransform: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          {open ? "Close Whiteboard" : "Collaborate"}
        </Button>
      </div>
    </>
  );
}
