"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";

type PrototypeScrollContextValue = {
  scrollTop: number;
  setScrollTop: (value: number) => void;
  /** Request the prototype iframe to scroll to this position (used when overlay viewport is panned) */
  requestScrollTo: (scrollTop: number) => void;
  /** Register the handler that will perform the scroll (called by the page that owns the iframe) */
  setScrollToHandler: (handler: ((scrollTop: number) => void) | null) => void;
};

const PrototypeScrollContext =
  createContext<PrototypeScrollContextValue | null>(null);

const SCROLL_UPDATE_EPSILON = 1;

export function PrototypeScrollProvider({ children }: { children: ReactNode }) {
  const [scrollTop, setScrollTopState] = useState(0);
  const scrollToHandlerRef = useRef<((scrollTop: number) => void) | null>(null);
  const lastScrollTopRef = useRef(0);

  const setScrollTop = useCallback((value: number) => {
    const rounded = Math.round(value);
    if (Math.abs(rounded - lastScrollTopRef.current) <= SCROLL_UPDATE_EPSILON)
      return;
    lastScrollTopRef.current = rounded;
    setScrollTopState(rounded);
  }, []);

  const setScrollToHandler = useCallback(
    (handler: ((scrollTop: number) => void) | null) => {
      scrollToHandlerRef.current = handler;
    },
    [],
  );

  const requestScrollTo = useCallback((position: number) => {
    scrollToHandlerRef.current?.(Math.round(position));
  }, []);

  return (
    <PrototypeScrollContext.Provider
      value={{ scrollTop, setScrollTop, requestScrollTo, setScrollToHandler }}
    >
      {children}
    </PrototypeScrollContext.Provider>
  );
}

export function usePrototypeScroll() {
  const ctx = useContext(PrototypeScrollContext);
  return (
    ctx ?? {
      scrollTop: 0,
      setScrollTop: () => {},
      requestScrollTo: () => {},
      setScrollToHandler: () => {},
    }
  );
}
