"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { IconButton, Avatar } from "@attain-sre/attain-design-system";
import * as Styled from "./user-menu.styles";

export function UserMenu() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const initials =
    status === "authenticated" && session?.user?.name
      ? session.user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
      : "\u00A0";

  return (
    <Styled.UserMenuWrap ref={ref}>
      <IconButton
        onClick={() => status === "authenticated" && setOpen(!open)}
        size="small"
      >
        <Avatar>{initials}</Avatar>
      </IconButton>
      {open && session?.user && (
        <Styled.AvatarMenu>
          {session.user.name && (
            <Styled.AvatarMenuName>{session.user.name}</Styled.AvatarMenuName>
          )}
          {session.user.email && (
            <Styled.AvatarMenuEmail>
              {session.user.email}
            </Styled.AvatarMenuEmail>
          )}
          <Styled.AvatarMenuItem onClick={() => signOut()}>
            Logout
          </Styled.AvatarMenuItem>
        </Styled.AvatarMenu>
      )}
    </Styled.UserMenuWrap>
  );
}
