"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import styled from "styled-components";
import CodeMirror from "@uiw/react-codemirror";
import { html as htmlLang } from "@codemirror/lang-html";
import { Typography } from "@mui/material";
import { Button, theme } from "@attain-sre/attain-design-system";

const STARTER_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Prototype</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 48px 24px;
      color: #333;
    }
    .container { max-width: 720px; margin: 0 auto; }
    h1 { font-size: 28px; margin-bottom: 16px; }
    p { font-size: 16px; line-height: 1.6; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Hello World</h1>
    <p>Start editing to build your prototype.</p>
  </div>
</body>
</html>`;

const Page = styled.div`
  min-height: 100vh;
  background: #fafafa;
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  border-bottom: 1px solid #e0e0e0;
  background: #fff;
`;

const BackLink = styled.a`
  font-size: 14px;
  color: #1a73e8;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const PageTitle = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
`;

const NameRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 24px;
`;

const NameLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
`;

const NameInput = styled.input`
  flex: 1;
  padding: 10px 14px;
  font-size: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: none;
  &:focus {
    border-color: #1a73e8;
  }
`;

const SlugPreview = styled.span`
  font-size: 13px;
  color: #999;
  flex-shrink: 0;
`;

const TabBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 0;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  background: ${({ $active }) => ($active ? "#fff" : "transparent")};
  color: ${({ $active }) => ($active ? "#1a73e8" : "#666")};
  border-bottom: 2px solid
    ${({ $active }) => ($active ? "#1a73e8" : "transparent")};
  cursor: pointer;
  &:hover {
    color: #1a73e8;
  }
`;

const EditorWrapper = styled.div`
  border: 1px solid #e0e0e0;
  border-top: none;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
  background: #fff;
  margin-bottom: 24px;
`;

const DropZone = styled.div<{ $dragging: boolean }>`
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px;
  background: ${({ $dragging }) => ($dragging ? "#e8f0fe" : "#fafafa")};
  border: 2px dashed ${({ $dragging }) => ($dragging ? "#1a73e8" : "#ddd")};
  border-radius: 0 0 6px 6px;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
`;

const DropText = styled.p`
  font-size: 16px;
  color: #666;
`;

const DropSubtext = styled.p`
  font-size: 13px;
  color: #999;
`;

const PreviewSection = styled.div`
  margin-bottom: 24px;
`;

const PreviewLabel = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const PreviewFrame = styled.iframe`
  width: 100%;
  height: 400px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
`;

const PublishButton = styled(Button)`
  padding: 12px 28px;
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  background: #1a73e8;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s ease;
  &:hover {
    background: #1557b0;
  }
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-direction: row-reverse;
`;

const CancelButton = styled(Button)`
  padding: 12px 28px;
  font-size: 15px;
  font-weight: 500;
  color: #555;
  background: transparent;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease;
  &:hover {
    background: #f5f5f5;
    border-color: #999;
  }
`;

const SuccessBanner = styled.div`
  padding: 16px 20px;
  background: #e6f4ea;
  border: 1px solid #a8dab5;
  border-radius: 8px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SuccessText = styled.span`
  font-size: 15px;
  color: #1e7e34;
`;

const SuccessLink = styled.a`
  font-size: 14px;
  font-weight: 500;
  color: #1a73e8;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorBanner = styled.div`
  padding: 16px 20px;
  background: #fce8e6;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  margin-bottom: 24px;
  font-size: 14px;
  color: #c62828;
`;

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  padding-right: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #555;
  white-space: nowrap;

  input[type="checkbox"] {
    width: 15px;
    height: 15px;
    accent-color: #1a73e8;
    cursor: pointer;
  }
`;

type TabId = "editor" | "upload";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function unslugify(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function PublishPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editPerson = searchParams.get("person");
  const editSlug = searchParams.get("slug");
  const isEditMode = !!(editPerson && editSlug);

  const [activeTab, setActiveTab] = useState<TabId>("editor");
  const [htmlContent, setHtmlContent] = useState(
    isEditMode ? "" : STARTER_HTML,
  );
  const [name, setName] = useState(isEditMode ? unslugify(editSlug ?? "") : "");
  const [publishing, setPublishing] = useState(false);
  const [loading, setLoading] = useState(isEditMode);
  const [result, setResult] = useState<{ url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [collaborative, setCollaborative] = useState(true);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const slug = slugify(name);
  const person = isEditMode
    ? editPerson
    : (session?.user?.email
        ?.split("@")[0]
        ?.toLowerCase()
        .replace(/[^a-z0-9]/g, "") ?? "");
  const isRename = isEditMode && slug !== editSlug;

  useEffect(() => {
    if (!isEditMode) return;
    fetch(`/api/publish/${editPerson}/${editSlug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load prototype");
        return res.json();
      })
      .then((data) => {
        setHtmlContent(data.html || "");
        setCollaborative(!!data.collaborative);
        if (data.name) setName(data.name);
      })
      .catch(() => {
        setError("Could not load the prototype for editing.");
      })
      .finally(() => setLoading(false));
  }, [isEditMode, editPerson, editSlug]);

  const handleFileUpload = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setHtmlContent(content);
        if (!name) {
          setName(file.name.replace(/\.html?$/i, ""));
        }
      };
      reader.readAsText(file);
    },
    [name],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.name.match(/\.html?$/i)) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload],
  );

  const handlePublish = async () => {
    if (!slug || !htmlContent.trim()) return;

    setPublishing(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: slug,
          displayName: name,
          html: htmlContent,
          collaborative,
          ...(isRename && { oldSlug: editSlug }),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const detail =
          data.details?.message || data.error || "Failed to publish";
        setError(detail);
        return;
      }

      setResult({ url: data.url });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  const previewSrcDoc = htmlContent;

  return (
    <Page>
      <Content>
        <Typography variant="h4" style={{ marginBottom: theme.spacing.lg }}>
          {isEditMode ? "Edit Prototype" : "Create Prototype"}
        </Typography>

        {result && (
          <SuccessBanner>
            <SuccessText>
              {isEditMode ? "Updated!" : "Published!"} Your prototype will be
              live in ~30 seconds.
            </SuccessText>
            <SuccessLink href={result.url} target="_blank">
              Open prototype &#8599;
            </SuccessLink>
          </SuccessBanner>
        )}

        {error && <ErrorBanner>{error}</ErrorBanner>}

        {loading && (
          <div style={{ padding: "48px", textAlign: "center", color: "#999" }}>
            Loading prototype...
          </div>
        )}

        {!loading && (
          <>
            <NameLabel>Prototype Name</NameLabel>
            <NameRow>
              <NameInput
                type="text"
                placeholder="e.g. Acme Landing Page"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {slug && (
                <SlugPreview>
                  {isRename ? (
                    <>
                      <s>
                        /prototypes/{person}/{editSlug}/
                      </s>
                      {" → "}
                      /prototypes/{person}/{slug}/
                    </>
                  ) : (
                    `/prototypes/${person}/${slug}/`
                  )}
                </SlugPreview>
              )}
            </NameRow>

            <TabBar>
              <Tab
                $active={activeTab === "editor"}
                onClick={() => setActiveTab("editor")}
              >
                HTML Editor
              </Tab>
              <Tab
                $active={activeTab === "upload"}
                onClick={() => setActiveTab("upload")}
              >
                HTML Upload
              </Tab>
              <CheckboxRow>
                <input
                  type="checkbox"
                  checked={collaborative}
                  onChange={(e) => setCollaborative(e.target.checked)}
                  aria-label="Allow Collaboration"
                />
                Allow Collaboration
              </CheckboxRow>
            </TabBar>

            <EditorWrapper>
              {activeTab === "editor" && (
                <CodeMirror
                  value={htmlContent}
                  height="400px"
                  extensions={[htmlLang()]}
                  onChange={(value) => setHtmlContent(value)}
                  theme="light"
                />
              )}

              {activeTab === "upload" && (
                <DropZone
                  $dragging={dragging}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <DropText>
                    {dragging
                      ? "Drop your file here"
                      : "Drag & drop an .html file"}
                  </DropText>
                  <DropSubtext>or click to browse</DropSubtext>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".html,.htm"
                    aria-label="Upload HTML file"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />
                </DropZone>
              )}
            </EditorWrapper>

            <PreviewSection>
              <PreviewLabel>Live Preview</PreviewLabel>
              <PreviewFrame srcDoc={previewSrcDoc} sandbox="allow-scripts" />
            </PreviewSection>

            <ButtonRow>
              <PublishButton
                onClick={handlePublish}
                disabled={!slug || !htmlContent.trim() || publishing}
                variant="contained"
              >
                {publishing
                  ? isEditMode
                    ? "Updating..."
                    : "Publishing..."
                  : isEditMode
                    ? "Update Prototype"
                    : "Publish Prototype"}
              </PublishButton>
              <CancelButton variant="outlined" onClick={() => router.back()}>
                Cancel
              </CancelButton>
            </ButtonRow>
          </>
        )}
      </Content>
    </Page>
  );
}
