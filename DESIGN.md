# Design

The Manifeso site is built as a **project site board**: the white aluminium signboard at a Qatar construction gate. Every page is one or more boards in a galvanized frame, ruled into label | value rows, with the subject's name set huge in a navy title band.

## Tokens (site/css/site.css `:root`)

| Token | Value | Role |
|---|---|---|
| `--navy` | `#1a1c43` | Title bands, headings, footer (sampled from logo) |
| `--red` | `#b13a40` | Primary actions only: WhatsApp / send (sampled from logo) |
| `--panel` | `#ffffff` | Board face |
| `--ground` | `#e4e6e3` | Page ground (concrete) |
| `--frame` | `#a3a9ad` | Board frame, 5px (4px on phones) |
| `--rule` | `#cfd3d5` | 1px row rules |
| `--ink` / `--ink-soft` | `#15162e` / `#464a5c` | Body text / row labels |

## Type

One face: **Archivo** variable (self-hosted `site/fonts/archivo-latin.woff2`, width 62–125%, weight 100–900).
- Display: width 72%, weight 800, tracking -0.015em, sentence case. H1 up to 6rem.
- Row labels and buttons: width 88%, weight 600–700.
- Body: width 100%, weight 400, tabular numerals site-wide.

## Components

- **Board** (`.board`): white panel, frame border, no radius, no shadow. Children run edge to edge and carry their own padding.
- **Title band** (`.board-title`): navy, holds the H1/H2 and a lede.
- **Rows** (`dl.rows > .row`): label column | value; `.value-big` for names and scope lists. Stacks on phones.
- **Sites row**, **project register** (fixed columns), **partner list**: all variations of ruled rows.
- **Photo strip** (`[data-strip]`): sideways scroll-snap strip of real site photos; tap opens the `<dialog>` lightbox with prev/next and arrow keys.
- **Buttons**: red primary, navy outline, white outline on navy. Square, 48px min height.

## Rules

- No cards, no eyebrows above headings, no gradients, no shadows, no rounded corners.
- Red is reserved for actions.
- Only real, named projects and partners. No invented stats, testimonials or logos.
