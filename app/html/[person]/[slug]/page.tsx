"use client";

import { useParams } from "next/navigation";
import { useRef, useEffect } from "react";
import { usePrototypeScroll } from "@/context/prototype-scroll-context";
import * as Styled from "./page.styles";

export default function HtmlPrototypePage() {
  const { person, slug } = useParams<{ person: string; slug: string }>();
  const frameRef = useRef<HTMLIFrameElement>(null);
  const { setScrollTop, setScrollToHandler } = usePrototypeScroll();

  useEffect(() => {
    const scrollTo = (position: number) => {
      try {
        const win = frameRef.current?.contentWindow;
        if (win) win.scrollTo(0, position);
      } catch {
        // cross-origin
      }
    };
    setScrollToHandler(scrollTo);
    return () => setScrollToHandler(null);
  }, [setScrollToHandler]);

  useEffect(() => {
    const iframe = frameRef.current;
    if (!iframe) return;

    let cleanup: (() => void) | undefined;

    const onLoad = () => {
      try {
        const win = iframe.contentWindow;
        const doc = iframe.contentDocument;
        if (!win || !doc) return;

        const getScrollTop = (): number => {
          const target = doc.scrollingElement ?? doc.documentElement;
          return target.scrollTop;
        };

        const onScroll = (e: Event) => {
          const el = e.target as Node;
          if (el === doc || el === doc.documentElement || el === doc.body) {
            setScrollTop(win.scrollY ?? getScrollTop());
          } else if (
            el &&
            "scrollTop" in el &&
            typeof (el as Element).scrollTop === "number"
          ) {
            setScrollTop((el as Element).scrollTop);
          }
        };

        doc.addEventListener("scroll", onScroll, {
          passive: true,
          capture: true,
        });
        setScrollTop(getScrollTop());

        cleanup = () =>
          doc.removeEventListener("scroll", onScroll, { capture: true });
      } catch {
        // cross-origin or not yet loaded
      }
    };

    iframe.addEventListener("load", onLoad);
    if (iframe.contentWindow) onLoad();
    return () => {
      iframe.removeEventListener("load", onLoad);
      cleanup?.();
    };
  }, [setScrollTop]);

  return (
    <Styled.Wrapper>
      <Styled.Frame ref={frameRef} src={`/prototypes/${person}/${slug}/`} />
    </Styled.Wrapper>
  );
}
