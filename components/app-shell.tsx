"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@attain-sre/attain-design-system";
import { ListIcon, PlusIcon } from "@phosphor-icons/react";
import type { Prototype } from "@/lib/prototypes";
import { formatSlug, personFromEmail } from "@/lib/people";
import type { CollaborationOverlayProps } from "@/components/collaboration-overlay";
import { UserMenu } from "./user-menu";
import { ConfirmDialog } from "./confirm-dialog";
import { PrototypeScrollProvider } from "@/context/prototype-scroll-context";
import * as Styled from "./app-shell.styles";

const CollaborationOverlay = dynamic<CollaborationOverlayProps>(
  () => import("@/components/collaboration-overlay"),
  { ssr: false },
);

interface AppShellProps {
  children: React.ReactNode;
}

function CollaborationOverlayWithScroll({
  roomId,
  open,
  onOpenChange,
}: CollaborationOverlayProps) {
  return (
    <Styled.CollaborationOverlayViewport $fullHeight={open}>
      <CollaborationOverlay
        roomId={roomId}
        open={open}
        onOpenChange={onOpenChange}
      />
    </Styled.CollaborationOverlayViewport>
  );
}

export default function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [entries, setEntries] = useState<[string, Prototype[]][]>([]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Prototype | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const refetchPrototypes = useCallback(() => {
    fetch("/api/prototypes")
      .then((res) => {
        if (!res.ok) {
          setEntries([]);
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setEntries(data);
        else setEntries([]);
      })
      .catch(() => setEntries([]));
  }, []);

  useEffect(() => {
    refetchPrototypes();
  }, [refetchPrototypes, pathname]);

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
      refetchPrototypes();
      router.push("/");
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  if (pathname === "/login" || !session) {
    return <>{children}</>;
  }

  return (
    <Styled.Layout>
      <Styled.HeaderBar $collabHidden={overlayOpen}>
        <Styled.HeaderLeft>
          <Styled.ToggleButton onClick={() => setCollapsed(!collapsed)}>
            <ListIcon size={18} weight="bold" />
          </Styled.ToggleButton>
          <Styled.Logo href="/">Prototype Playground</Styled.Logo>
        </Styled.HeaderLeft>

        <Styled.HeaderRight>
          <Button
            variant="contained"
            href="/publish"
            startIcon={<PlusIcon weight="bold" />}
          >
            Create Prototype
          </Button>

          <UserMenu />
        </Styled.HeaderRight>
      </Styled.HeaderBar>

      <Styled.Body>
        <Styled.Sidebar $collapsed={collapsed || overlayOpen}>
          <Styled.SidebarContent>
            {entries.map(([person, prototypes]) => (
              <Styled.PersonGroup key={person}>
                <Styled.PersonLabel>{person}</Styled.PersonLabel>
                {prototypes.map((proto) => {
                  const isOwned =
                    proto.type === "html" && proto.person === currentPerson;
                  const menuKey = `${proto.person}/${proto.slug}`;

                  return (
                    <Styled.NavItemRow key={proto.href}>
                      <Styled.NavLink
                        href={proto.href}
                        $active={
                          pathname === proto.href ||
                          pathname === proto.href.replace(/\/$/, "")
                        }
                      >
                        {proto.name || formatSlug(proto.slug)}
                        <Styled.TypeBadge>{proto.type}</Styled.TypeBadge>
                      </Styled.NavLink>
                      {isOwned && (
                        <Styled.MenuButtonWrap
                          ref={openMenu === menuKey ? menuRef : null}
                        >
                          <Styled.MenuBtn
                            className="nav-menu-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenu(
                                openMenu === menuKey ? null : menuKey,
                              );
                            }}
                          >
                            &#8943;
                          </Styled.MenuBtn>
                          {openMenu === menuKey && (
                            <Styled.ContextMenu>
                              <Styled.MenuItem
                                onClick={() => {
                                  setOpenMenu(null);
                                  router.push(
                                    `/publish?person=${proto.person}&slug=${proto.slug}`,
                                  );
                                }}
                              >
                                Edit
                              </Styled.MenuItem>
                              <Styled.MenuItem
                                $danger
                                onClick={() => {
                                  setOpenMenu(null);
                                  setDeleteTarget(proto);
                                }}
                              >
                                Delete
                              </Styled.MenuItem>
                            </Styled.ContextMenu>
                          )}
                        </Styled.MenuButtonWrap>
                      )}
                    </Styled.NavItemRow>
                  );
                })}
              </Styled.PersonGroup>
            ))}
          </Styled.SidebarContent>
        </Styled.Sidebar>
        <Styled.MainContent>
          <PrototypeScrollProvider>
            {isPrototypePage && (
              <Styled.CollaborationOverlayWrapper>
                <CollaborationOverlayWithScroll
                  roomId={`prototype-${pathname.replace(/\//g, "-").replace(/^-|-$/g, "")}`}
                  open={overlayOpen}
                  onOpenChange={setOverlayOpen}
                />
              </Styled.CollaborationOverlayWrapper>
            )}
            {children}
          </PrototypeScrollProvider>
        </Styled.MainContent>
      </Styled.Body>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete prototype?"
        message={
          deleteTarget ? (
            <>
              Are you sure you want to delete{" "}
              <strong>
                {deleteTarget.name || formatSlug(deleteTarget.slug)}
              </strong>
              ? This will remove it from the repository and cannot be undone.
            </>
          ) : (
            ""
          )
        }
        confirmLabel="Delete"
        loadingLabel="Deleting..."
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </Styled.Layout>
  );
}
