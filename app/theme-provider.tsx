"use client";

import AttainThemeProvider from "@attain-sre/attain-design-system/styles/ThemeProvider";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AttainThemeProvider>{children}</AttainThemeProvider>;
}
