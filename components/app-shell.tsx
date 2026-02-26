"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import styled from "styled-components";
import {
  Button,
  IconButton,
  Avatar,
  theme,
} from "@attain-sre/attain-design-system";
import { PlusIcon } from "@phosphor-icons/react";
import type { Prototype } from "@/lib/prototypes";

const CollaborationOverlay = dynamic(
  () => import("@/components/collaboration-overlay"),
  { ssr: false },
);

const SIDEBAR_WIDTH = 260;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const HeaderBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.xs};
  height: 64px;
  border-bottom: 1px solid #e0e0e0;
  background: #fff;
  flex-shrink: 0;
  z-index: 10;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ToggleButton = styled.button`
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

const Logo = styled(Link)`
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  text-decoration: none;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AvatarMenu = styled.div`
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

const AvatarMenuName = styled.div`
  padding: 10px 14px 4px;
  font-size: 13px;
  font-weight: 600;
  color: #333;
`;

const AvatarMenuEmail = styled.div`
  padding: 0 14px 8px;
  font-size: 11px;
  color: #999;
  border-bottom: 1px solid #eee;
  margin-bottom: 4px;
`;

const AvatarMenuItem = styled.button`
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

const Body = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const Sidebar = styled.aside<{ $collapsed: boolean }>`
  width: ${({ $collapsed }) => ($collapsed ? 0 : SIDEBAR_WIDTH)}px;
  min-width: ${({ $collapsed }) => ($collapsed ? 0 : SIDEBAR_WIDTH)}px;
  border-right: ${({ $collapsed }) =>
    $collapsed ? "none" : "1px solid #e0e0e0"};
  background: #fafafa;
  overflow-y: auto;
  overflow-x: hidden;
  transition:
    width 0.2s ease,
    min-width 0.2s ease;
  flex-shrink: 0;
`;

const SidebarContent = styled.div`
  padding: 16px 0;
`;

const PersonGroup = styled.div`
  margin-bottom: 8px;
`;

const PersonLabel = styled.div`
  padding: 6px 16px;
  font-size: 11px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const NavLink = styled(Link)<{ $active: boolean }>`
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

const TypeBadge = styled.span`
  font-size: 10px;
  color: #999;
  text-transform: uppercase;
  margin-left: auto;
  letter-spacing: 0.3px;
`;

const NavItemRow = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  &:hover .nav-menu-btn {
    opacity: 1;
  }
`;

const MenuBtn = styled.button`
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

const ContextMenu = styled.div`
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

const MenuItem = styled.button<{ $danger?: boolean }>`
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

const Overlay = styled.div`
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

const Dialog = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
`;

const DialogTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
`;

const DialogText = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 20px;
`;

const DialogActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const DialogBtn = styled.button<{ $danger?: boolean }>`
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

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  background: #fff;
  position: relative;
`;

interface AppShellProps {
  children: React.ReactNode;
}

function formatSlug(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function personFromEmail(email: string): string {
  const local = email.split("@")[0].toLowerCase();
  if (local.includes(".")) {
    const parts = local.split(".");
    return (parts[0][0] + parts.slice(1).join("")).replace(/[^a-z0-9]/g, "");
  }
  return local.replace(/[^a-z0-9]/g, "");
}

function UserMenu() {
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
    <div ref={ref} style={{ position: "relative" }}>
      <IconButton
        onClick={() => status === "authenticated" && setOpen(!open)}
        size="small"
      >
        <Avatar>{initials}</Avatar>
      </IconButton>
      {open && session?.user && (
        <AvatarMenu>
          {session.user.name && (
            <AvatarMenuName>{session.user.name}</AvatarMenuName>
          )}
          {session.user.email && (
            <AvatarMenuEmail>{session.user.email}</AvatarMenuEmail>
          )}
          <AvatarMenuItem onClick={() => signOut()}>Logout</AvatarMenuItem>
        </AvatarMenu>
      )}
    </div>
  );
}

export default function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [entries, setEntries] = useState<[string, Prototype[]][]>([]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Prototype | null>(null);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    fetch("/api/prototypes")
      .then((res) => res.json())
      .then((data) => setEntries(data))
      .catch(() => {});
  }, []);

  const currentPerson = session?.user?.email
    ? personFromEmail(session.user.email)
    : "";

  const excludedPaths = ["/", "/login", "/publish"];
  const isPrototypePage =
    !excludedPaths.includes(pathname) && !pathname.startsWith("/publish");

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openMenu]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `/api/publish/${deleteTarget.person}/${deleteTarget.slug}`,
        { method: "DELETE" },
      );
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete");
        return;
      }
      setDeleteTarget(null);
      router.push("/");
      window.location.reload();
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <Layout>
      <HeaderBar>
        <HeaderLeft>
          <ToggleButton onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? "\u2630" : "\u2630"}
          </ToggleButton>
          <Logo href="/">Prototype Playground</Logo>
        </HeaderLeft>

        <HeaderRight>
          <Button
            variant="contained"
            href="/publish"
            startIcon={<PlusIcon weight="bold" />}
          >
            Create Prototype
          </Button>

          <UserMenu />
        </HeaderRight>
      </HeaderBar>

      <Body>
        <Sidebar $collapsed={collapsed}>
          <SidebarContent>
            {entries.map(([person, prototypes]) => (
              <PersonGroup key={person}>
                <PersonLabel>{person}</PersonLabel>
                {prototypes.map((proto) => {
                  const isOwned =
                    proto.type === "html" && proto.person === currentPerson;
                  const menuKey = `${proto.person}/${proto.slug}`;

                  return (
                    <NavItemRow key={proto.href}>
                      <NavLink
                        href={proto.href}
                        $active={
                          pathname === proto.href ||
                          pathname === proto.href.replace(/\/$/, "")
                        }
                      >
                        {proto.name || formatSlug(proto.slug)}
                        <TypeBadge>{proto.type}</TypeBadge>
                      </NavLink>
                      {isOwned && (
                        <div
                          ref={openMenu === menuKey ? menuRef : null}
                          style={{ position: "relative" }}
                        >
                          <MenuBtn
                            className="nav-menu-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenu(
                                openMenu === menuKey ? null : menuKey,
                              );
                            }}
                          >
                            &#8943;
                          </MenuBtn>
                          {openMenu === menuKey && (
                            <ContextMenu>
                              <MenuItem
                                onClick={() => {
                                  setOpenMenu(null);
                                  router.push(
                                    `/publish?person=${proto.person}&slug=${proto.slug}`,
                                  );
                                }}
                              >
                                Edit
                              </MenuItem>
                              <MenuItem
                                $danger
                                onClick={() => {
                                  setOpenMenu(null);
                                  setDeleteTarget(proto);
                                }}
                              >
                                Delete
                              </MenuItem>
                            </ContextMenu>
                          )}
                        </div>
                      )}
                    </NavItemRow>
                  );
                })}
              </PersonGroup>
            ))}
          </SidebarContent>
        </Sidebar>
        <MainContent>
          {children}
          {isPrototypePage && (
            <CollaborationOverlay
              roomId={`prototype-${pathname.replace(/\//g, "-").replace(/^-|-$/g, "")}`}
            />
          )}
        </MainContent>
      </Body>

      {deleteTarget && (
        <Overlay onClick={() => !deleting && setDeleteTarget(null)}>
          <Dialog onClick={(e) => e.stopPropagation()}>
            <DialogTitle>Delete prototype?</DialogTitle>
            <DialogText>
              Are you sure you want to delete{" "}
              <strong>
                {deleteTarget.name || formatSlug(deleteTarget.slug)}
              </strong>
              ? This will remove it from the repository and cannot be undone.
            </DialogText>
            <DialogActions>
              <DialogBtn
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </DialogBtn>
              <DialogBtn $danger onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Delete"}
              </DialogBtn>
            </DialogActions>
          </Dialog>
        </Overlay>
      )}
    </Layout>
  );
}
