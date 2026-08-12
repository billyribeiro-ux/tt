# /momentum reference CSS — recovered, not captured

The single-file capture at the repo root (`momentum-page`) is an Elementor/Astra page saved with
`css_print_method-external`, so the page's own CSS is **not in the capture bytes**. An earlier pass
concluded from that it was unrecoverable and built the page all-black as a result. That was wrong:
the capture's own `<link>` tags name the sheets, and they fetch fine.

These files were fetched on 2026-08-12 and are committed here so nobody repeats that mistake.

| File | Source URL | What it gives you |
|---|---|---|
| `post-73938.pretty.css` | `https://tricktrades.com/wp-content/uploads/elementor/css/post-73938.css` | The page's own rules: section backgrounds, paddings, column splits, type sizes |
| `post-47277.css` | `.../elementor/css/post-47277.css` | The site kit: the `--e-global-color-*` palette and typography |
| `post-20496.css` / `footer.pretty.css` | `.../elementor/css/post-20496.css` | The footer template |

## The values that matter

- `--e-global-color-accent: #B22725` — **both** LEARN MORE buttons
- `--e-global-color-primary: #191A19`, `--e-global-color-text: #707070`, secondary `#FFFFFF`
- Container `1140px` (1024px ≤1024, 767px ≤767)
- Display face `"Allerta Stencil"` weight 600 — note only weight 400 exists; it is a single-weight family
- Section score: hero over `bg4.jpg` + `#0a0a0a` @ 50% overlay → `#FFFFFF` (pull quote) → `#000000`
  (the two cards) → `#FFFFFF` (empty trailing band)

## For any other Elementor page on this site

Swap the page id: `https://tricktrades.com/wp-content/uploads/elementor/css/post-<PAGE_ID>.css`.
The id is in the capture's `<body class="... page-id-NNNNN ...">` and its `data-elementor-id`.
