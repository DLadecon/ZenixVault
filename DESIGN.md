# Design plan — Nebula Scripts

**Subject**: a single creator's Roblox script showcase, paired with their YouTube channel.
Audience: teens/young-adults who play Roblox and want scripts fast, arriving from YouTube.
Primary job: get a visitor from "what scripts exist" to "copied the code" in as few taps as possible.

## Color
- `--void #08080e` — page background, near-black with a blue undertone (not flat #000)
- `--panel #0f0f18` — card surfaces
- `--raised #151521` — hover/raised state
- `--iris #7c6cff` — primary accent, electric indigo (script/code energy)
- `--azure #4ab3ff` — secondary accent, used for links/secondary CTAs
- `--orchid #ff6cc4` — rare third accent, reserved for "Featured" only
- `--ink #ededf5` / `--mute #9494a8` — text

## Type
- Display/headline: Bricolage Grotesque Variable — has a distinct, slightly technical/gaming personality without being a generic geometric sans.
- Body/UI: Onest Variable — clean, neutral, highly legible at small sizes.
- Code/data (version numbers, tags, code viewer): JetBrains Mono Variable.

## Layout
Hero: left-aligned headline over a `bg-grid` + `bg-aurora` treatment (a faint grid + soft indigo/azure glow, evoking a HUD/terminal rather than a generic gradient blob). One live "typing" script-code snippet as the hero's visual anchor instead of a stock screenshot — grounds the page in the actual subject (scripts) immediately.

```
[Nav ......................................]
[ Headline           |  <code editor >    ]
[ Subtext            |    window>         ]
[ [Browse][YouTube]   |                    ]
[--------- Popular games rail ------------]
[--------- Featured script (big) ---------]
[--------- Latest scripts grid -----------]
[--------- YouTube CTA band ---------------]
[Footer]
```
Left-aligned hero text, centered section headers kept minimal (no eyebrow labels — section headings state what they are: "Popular games", "Latest scripts").

## Principles
- The hero's visual anchor is a real (fake, sample) script snippet in a code-editor chrome — not a generic device mockup or gradient blob — because code IS the product.
- One motion moment: the hero code block "types" itself out once on load. Everything else uses simple hover/press states, not scroll-triggered fades.
- Avoid the SaaS-card sameness trap: featured script card is visually distinct (larger, orchid-tinted) from the regular grid cards, and popular-game pills are a horizontal rail, not another card grid.
- No ALL-CAPS eyebrows, no middle-dot meta strings, no arrow-suffixed buttons.
