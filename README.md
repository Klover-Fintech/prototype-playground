# Prototype Playground

A shared Next.js app where salespeople create and share web prototypes. Each person gets their own namespace folder. Prototypes are auto-discovered and listed on the homepage.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the prototype directory.

## Creating a Prototype

There are two ways to add a prototype: **React** or **raw HTML**.

### Option 1: React Prototype (recommended)

Create a folder under `app/(prototypes)/your-name/your-prototype/` with a `page.tsx`:

```
app/(prototypes)/
  jane/
    acme-pitch/
      page.tsx      <-- your prototype
```

Your prototype is a standard React component. Add `"use client"` at the top for interactive pages. You can import from the Attain Design System and use styled-components:

```tsx
"use client";

import styled from "styled-components";
import { Button, Card, TextField } from "@attain-sre/attain-design-system";
import PrototypeShell from "@/components/prototype-shell";

const Wrapper = styled.div`
  padding: 32px;
  max-width: 800px;
  margin: 0 auto;
`;

export default function AcmePitch() {
  return (
    <PrototypeShell name="Acme Pitch">
      <Wrapper>
        <h1>My Prototype</h1>
        <Button variant="contained">Click me</Button>
      </Wrapper>
    </PrototypeShell>
  );
}
```

Your prototype will be available at `http://localhost:3000/jane/acme-pitch`.

The `PrototypeShell` wrapper is optional -- it adds a header bar with a back link to the directory. You can skip it for full-page prototypes.

### Option 2: Raw HTML Prototype

Drop an `index.html` file into `public/prototypes/your-name/your-prototype/`:

```
public/prototypes/
  jane/
    quick-demo/
      index.html    <-- your prototype
      styles.css    <-- optional assets
      script.js     <-- optional assets
```

The file is served statically at `/prototypes/jane/quick-demo/index.html` and will appear in the homepage directory.

## Available Components

The Attain Design System (`@attain-sre/attain-design-system`) includes:

- **Layout**: Box, Stack, Container, Grid
- **Inputs**: Button, TextField, Textarea, Select, Checkbox, Switch, Slider, Autocomplete, RadioGroup
- **Display**: Card, Chip, Badge, Avatar, Table, Tabs, Accordion, LinearProgress, ProgressBar
- **Feedback**: Alert, Snackbar, Dialog, Tooltip, Skeleton, Backdrop
- **Navigation**: Menu, MenuItem, Popover

You can also use any [MUI component](https://mui.com/material-ui/) directly since it's included as a dependency.

## Styling

Use **styled-components** for custom styling:

```tsx
import styled from "styled-components";

const Hero = styled.section`
  background: linear-gradient(135deg, #1a73e8, #0d47a1);
  color: white;
  padding: 64px 32px;
`;
```

## Deploying to Vercel

Connect this repository to Vercel. The default settings work out of the box -- no configuration needed.

## Project Structure

```
app/
  layout.tsx                  # Root layout (providers)
  page.tsx                    # Homepage directory
  registry.tsx                # styled-components SSR
  theme-provider.tsx          # Attain theme setup
  (prototypes)/               # Route group (not in URL)
    steven/
      example-dashboard/
        page.tsx              # Example React prototype
components/
  prototype-shell.tsx         # Optional page wrapper
  directory.tsx               # Homepage listing component
lib/
  prototypes.ts               # Filesystem scanner
public/
  prototypes/                 # Raw HTML prototypes
    steven/
      raw-example/
        index.html
```
