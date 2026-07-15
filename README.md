# Age and Semantics of Information

A comprehensive, community-driven resource for **Age of Information (AoI)**, **Semantics**, **Goal-Oriented Communications**, **AoII / VoI / QAoI** — curated papers, surveys, and materials.

Inspired by [ALPS – Algorithms with Predictions](https://algorithms-with-predictions.github.io/).

**Live:** **https://age-and-semantics-information.github.io/**  
**Repo:** https://github.com/age-and-semantics-information/age-and-semantics-information.github.io

---

## Features

- **Paper list**: 41+ seed papers (expandable), searchable by title/authors/venue/label
- **Filters**: 15 primary categories including `semantics / goal-oriented`, `VoI / AoII / QAoI`, plus free tags
- **Stats dashboard**: papers/authors/venues counts + **year distribution bar chart** + **top venues chart** (ALPS-style)
- **Author graph**: `/authors` — collaboration network via `react-force-graph-2d` + `d3-force`, node size ∝ paper count, collision/charge/boundary tuned, click to highlight
- **Material / About / Contribute** pages with community guides

## Tech

- Vite 6 + React 19 + MUI v7 + TypeScript + React Query + react-router
- Papers as YAML in `papers/` → `scripts/composeData.js` → `public/papers.json`
- GitHub Actions Pages deploy (`build_type: workflow`), `VITE_BASE=/`

## Local Dev

```bash
# At Meta dev env, unset proxy override
env -u npm_config_registry npm install
env -u npm_config_registry npm run dev   # http://localhost:3000
npm run build
```

## Adding a Paper

```yml
# papers/Kaul12realtime.yml
title: Real-time status - How often should one update?
authors: Kaul, Yates, Gruteser
labels:
  - theory / fundamentals
  - sampling / updating
publications:
  - name: INFOCOM
    year: 2012
    url: https://ieeexplore.ieee.org/document/6195309
year: 2012
```

## Deployment

Org pages: `age-and-semantics-information/age-and-semantics-information.github.io` — `VITE_BASE=/` (default), workflow auto-deploys on push to `main`.

## Acknowledgements

UI inspired by ALPS (Alexander Lindermayr & Nicole Megow). Thanks to AoI community.

## License

MIT
