"use client";

import { useCallback } from "react";
import { Tldraw } from "tldraw";
import type { Editor } from "tldraw";
import { useSyncDemo } from "@tldraw/sync";
import "tldraw/tldraw.css";
import { usePrototypeScroll } from "@/context/prototype-scroll-context";
import * as Styled from "./collaboration-overlay.styles";

function CollaborativeTldraw({
  roomId,
  scrollTop,
}: {
  roomId: string;
  scrollTop: number;
}) {
  const store = useSyncDemo({ roomId });
  const onMount = useCallback((editor: Editor) => {
    editor.setCameraOptions({ isLocked: true });
    editor.updateInstanceState({ isFocusMode: false });
    const interval = setInterval(() => {
      if (editor.getInstanceState().isFocusMode) {
        editor.updateInstanceState({ isFocusMode: false });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const licenseKey = process.env.NEXT_PUBLIC_TLDRAW_LICENSE_KEY ?? undefined;

  return (
    <Styled.WhiteboardPanel $scrollTop={scrollTop}>
      <Tldraw
        store={store}
        autoFocus
        onMount={onMount}
        licenseKey={licenseKey}
        components={{
          ZoomMenu: null,
          Minimap: null,
          TopPanel: null,
          PageMenu: null,
          ActionsMenu: null,
          HelpMenu: null,
        }}
      />
    </Styled.WhiteboardPanel>
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
          <Styled.CollabBanner>
            Collaboration mode — draw to annotate
          </Styled.CollabBanner>
        </>
      )}

      <Styled.CollabButtonWrap>
        <Styled.CollabButton
          variant="contained"
          color={open ? "error" : "primary"}
          onClick={() => onOpenChange(!open)}
        >
          {open ? "Close Whiteboard" : "Collaborate"}
        </Styled.CollabButton>
      </Styled.CollabButtonWrap>
    </>
  );
}
