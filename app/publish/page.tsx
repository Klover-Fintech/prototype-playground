"use client";

import { useState, useCallback, useRef, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import CodeMirror from "@uiw/react-codemirror";
import { html as htmlLang } from "@codemirror/lang-html";
import { formatSlug, personFromEmail, slugify } from "@/lib/people";
import * as Styled from "./page.styles";
import {
  Button,
  Checkbox,
  InputLabel,
  Tabs,
  Tab,
} from "@attain-sre/attain-design-system";

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

type TabId = "editor" | "upload";

function PublishPageContent() {
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
  const [name, setName] = useState(
    isEditMode && editSlug ? formatSlug(editSlug) : "",
  );
  const [publishing, setPublishing] = useState(false);
  const [loading, setLoading] = useState(isEditMode);
  const [result, setResult] = useState<{ url: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [collaborative, setCollaborative] = useState(true);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const slug = slugify(name);
  const person = isEditMode
    ? (editPerson ?? "")
    : session?.user?.email
      ? personFromEmail(session.user.email)
      : "";
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
    <Styled.Page>
      <Styled.Content>
        <Styled.PageHeading>
          {isEditMode ? "Edit Prototype" : "Create Prototype"}
        </Styled.PageHeading>

        {result && (
          <Styled.SuccessBanner>
            <Styled.SuccessText>
              {isEditMode ? "Updated!" : "Published!"} Your prototype will be
              live in ~30 seconds.
            </Styled.SuccessText>
            <Styled.SuccessLink href={result.url} target="_blank">
              Open prototype &#8599;
            </Styled.SuccessLink>
          </Styled.SuccessBanner>
        )}

        {error && <Styled.ErrorBanner>{error}</Styled.ErrorBanner>}

        {loading && (
          <Styled.LoadingBlock>Loading prototype...</Styled.LoadingBlock>
        )}

        {!loading && (
          <>
            <InputLabel htmlFor="prototype-name">Prototype Name</InputLabel>

            <Styled.NameRow>
              <Styled.NameInput
                id="prototype-name"
                type="text"
                placeholder="e.g. Acme Landing Page"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
            </Styled.NameRow>

            <Styled.TabBar>
              <Styled.TabsWrap>
                <Tabs
                  value={activeTab}
                  onChange={(_e, value) => setActiveTab(value as TabId)}
                >
                  <Tab label="HTML Editor" value="editor" />
                  <Tab label="HTML Upload" value="upload" />
                </Tabs>
              </Styled.TabsWrap>

              <Styled.CheckboxRow>
                <Checkbox
                  checked={collaborative}
                  onChange={(e) => setCollaborative(e.target.checked)}
                  aria-label="Allow Collaboration"
                />
                Allow Collaboration
              </Styled.CheckboxRow>
            </Styled.TabBar>

            <Styled.EditorWrapper>
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
                <Styled.DropZone
                  $dragging={dragging}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Styled.DropText>
                    {dragging
                      ? "Drop your file here"
                      : "Drag & drop an .html file"}
                  </Styled.DropText>

                  <Styled.DropSubtext>or click to browse</Styled.DropSubtext>

                  <Styled.VisuallyHiddenInput
                    ref={fileInputRef}
                    type="file"
                    accept=".html,.htm"
                    aria-label="Upload HTML file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />
                </Styled.DropZone>
              )}
            </Styled.EditorWrapper>

            <Styled.PreviewSection>
              <InputLabel htmlFor="preview-frame">Live Preview</InputLabel>

              <Styled.PreviewFrame
                id="preview-frame"
                srcDoc={previewSrcDoc}
                sandbox="allow-scripts"
              />
            </Styled.PreviewSection>

            <Styled.ButtonRow>
              <Button
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
              </Button>

              <Button variant="outlined" onClick={() => router.back()}>
                Cancel
              </Button>
            </Styled.ButtonRow>
          </>
        )}
      </Styled.Content>
    </Styled.Page>
  );
}

export default function PublishPage() {
  return (
    <Suspense
      fallback={
        <Styled.Page>
          <Styled.Content>
            <Styled.LoadingBlock>Loading...</Styled.LoadingBlock>
          </Styled.Content>
        </Styled.Page>
      }
    >
      <PublishPageContent />
    </Suspense>
  );
}
