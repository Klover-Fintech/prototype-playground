"use client";

import { useState } from "react";
import { Tldraw } from "tldraw";
import { useSyncDemo } from "@tldraw/sync";
import "tldraw/tldraw.css";
import styled from "styled-components";
import { Button } from "@attain-sre/attain-design-system";

const WhiteboardPanel = styled.div`
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

function CollaborativeTldraw({ roomId }: { roomId: string }) {
  const store = useSyncDemo({ roomId });

  return (
    <WhiteboardPanel>
      <Tldraw store={store} autoFocus />
    </WhiteboardPanel>
  );
}

interface CollaborationOverlayProps {
  roomId: string;
}

export default function CollaborationOverlay({
  roomId,
}: CollaborationOverlayProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <>
          <CollaborativeTldraw roomId={roomId} />
          <CollabBanner>Collaboration mode — draw to annotate</CollabBanner>
        </>
      )}

      <Button
        variant="contained"
        color={open ? "error" : "primary"}
        onClick={() => setOpen(!open)}
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
          zIndex: 10,
          borderRadius: "20px",
          textTransform: "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        {open ? "Close Whiteboard" : "Collaborate"}
      </Button>
    </>
  );
}
