# Website brief — 3D storytelling site (master prompt)

Paste the block below to start a fresh session for the AI-product site. Fill in the
`[PRODUCT]` placeholder and keep `references.md` (next to this file) up to date with
your reference links first — the build reads it as ground truth.

---

```text
Build a storytelling marketing site for [PRODUCT — the AI product/"AIP"], where each
section is a scroll-driven narrative beat carried by a tactile, real-world 3D element
(the way we built the metallic gyroscope debit card — physical objects, light, depth,
device-motion response), not flat UI cards.

First, load and USE these skills throughout — don't skip them:
- frontend-design → commit to ONE bold, non-generic art direction (typography pairing,
  palette, spatial composition). No stock hero + three feature cards.
- impeccable → you are the design director; own the vision and quality bar.
- interaction-design → scroll-triggered reveals, gesture/parallax, exact timing/easing.
- better-ui (+ better-typography/layout) → the final polish pass.

Ground truth: read references.md — every link is a target for the feel, motion, and
craft. Match that bar; the current build is unsatisfying because it's generic.

Direction:
- Stack: React + Vite + TypeScript + Tailwind + Motion (motion/react); WebGL/3D where a
  real-world object sells the story (ogl or react-three-fiber). Mobile-first, 60fps,
  reduced-motion honored.
- Each "chapter" = one product idea told through one hero 3D artifact + one interaction.
- Distinctive type, a committed palette, atmospheric depth — no AI slop.

Then WORK IN A LOOP, don't one-shot it:
1. Build the section. 2. Run impeccable `critique` + `audit` on it. 3. Fix everything
they surface with `polish` (and `overdrive` where it should be bolder). 4. Screenshot,
compare against references.md, repeat until it clears the bar. Commit each pass.
Tell me when a section is pitch-ready and show it.
```

---

## The design skills this leans on

| Skill | Role |
|---|---|
| `frontend-design` | Bold, non-generic art direction (type, palette, composition) |
| `impeccable` | Design-director quality; loop via `critique` / `audit` / `polish` / `overdrive` |
| `interaction-design` | Scroll reveals, gesture/parallax, motion timing & easing |
| `better-ui` (+ `better-typography`, `better-layout`, `better-accessibility`) | Final small-details polish pass |

## Prompting notes (what gets the best output)
- Commit to **one bold, specific aesthetic** — name references, materials, motion.
- Anchor to **reference products** (put the links in `references.md`).
- Demand **real tactile / 3D craft**, not flat cards.
- Set a **comparative bar** ("better than X").
- **Iterate in tight loops** with pointed, specific feedback per section.
