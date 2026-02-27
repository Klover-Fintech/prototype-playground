"use client";

import type { ReactNode } from "react";
import * as Styled from "./confirm-dialog.styles";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  loadingLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = "Cancel",
  loadingLabel,
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <Styled.Overlay onClick={() => !loading && onCancel()}>
      <Styled.Dialog onClick={(e) => e.stopPropagation()}>
        <Styled.DialogTitle>{title}</Styled.DialogTitle>
        <Styled.DialogText>{message}</Styled.DialogText>
        <Styled.DialogActions>
          <Styled.DialogBtn onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Styled.DialogBtn>
          <Styled.DialogBtn
            $danger={danger}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && loadingLabel ? loadingLabel : confirmLabel}
          </Styled.DialogBtn>
        </Styled.DialogActions>
      </Styled.Dialog>
    </Styled.Overlay>
  );
}
