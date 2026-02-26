import type { Metadata } from "next";
import "./globals.css";
import StyledComponentsRegistry from "./registry";
import ThemeProvider from "./theme-provider";
import SessionProvider from "./session-provider";

export const metadata: Metadata = {
  title: "Prototype Playground",
  description: "A shared space for sales prototypes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <StyledComponentsRegistry>
            <ThemeProvider>{children}</ThemeProvider>
          </StyledComponentsRegistry>
        </SessionProvider>
      </body>
    </html>
  );
}
