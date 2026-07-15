# Age and Semantics of Information

A comprehensive, community-driven resource for **Age of Information (AoI)**, **Semantics**, **Goal-Oriented Communications**, **AoII / VoI / QAoI** research — curated papers, surveys, and materials.

Inspired by [ALPS – Algorithms with Predictions](https://algorithms-with-predictions.github.io/).

**Planned Live Site**: `https://age-and-semantics-information.github.io` (org pages repo `age-and-semantics-information/age-and-semantics-information.github.io`)

Alternative hosting as project pages: `https://zhongdong1994.github.io/age-and-semantics-information/` (repo `Zhongdong1994/age-and-semantics-information`)

---

## ✨ Live Demo (local)

Dev server currently running at **http://localhost:3000** in this workspace — shows:

- **Home**: searchable paper list (41 papers seeded: 30 AoI classics + 11 semantics/goal-oriented)
- **Material**: surveys, workshops, quick-ref definitions (AoI, PAoI, AoII, VoI, QAoI)
- **Contribute**: how to add papers via YAML PRs
- **About**: mission & credits

Build output: `dist/` 736KB, ready for GitHub Pages.

```
Papers:        41 indexed
Authors:       ~80 unique
Top venues:    TWC, INFOCOM, TCOM, arXiv, JSAC, ToN, etc.
Categories:    15 primary including semantics / goal-oriented, VoI / AoII / QAoI
```

## What is AoI + Semantics?

- **AoI**: Δ(t)=t-U(t), freshness of updates — Kaul, Yates, Gruteser INFOCOM 2012
- **AoII**: Age of Incorrect Information — time since decoder is wrong
- **VoI**: Value of Information — utility-driven freshness
- **Semantics / Goal-Oriented**: effectiveness, task-aware communications (6G vision)

## Tech Stack

- Vite 6 + React 19 + MUI v7 + TypeScript
- Papers as YAML in `papers/` → `scripts/composeData.js` → `public/papers.json`
- React Query, react-router-dom, GitHub Actions Pages deploy

## Local Dev

```bash
# fix Meta env npm registry override
export -u npm_config_registry
npm install        # needs fwdproxy at Meta (http_proxy)
npm run dev        # http://localhost:3000
npm run build      # dist/
```

## Adding a Paper

```yml
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

Place as `papers/FirstAuthorYYkeyword.yml`, run `npm run dev` (auto-composes), PR.

## Deployment for `age-and-semantics-information.github.io`

### Option A: Org Pages (you requested `age-and-semantics-information.github.io`)

1. Create GitHub org `age-and-semantics-information`
2. Create repo `age-and-semantics-information` org / repo named `age-and-semantics-information.github.io`
3. Push this code to `main`
4. Settings → Pages → Source: GitHub Actions
5. Workflow `.github/workflows/deploy.yml` auto-builds with `VITE_BASE=/` (default) → live at `https://age-and-semantics-information.github.io`

### Option B: Personal Project Pages

If repo is `Zhongdong1994/age-and-semantics-information`:

- Set repo variable `VITE_BASE` = `/age-and-semantics-information/` in GitHub → Settings → Secrets and Variables → Actions → Variables → New variable `VITE_BASE`
- Same workflow deploys to `https://zhongdong1994.github.io/age-and-semantics-information/`

Workflow file is already included.

## Categories (src/constants.ts)

- survey / tutorial
- theory / fundamentals
- queueing analysis
- scheduling / optimization
- sampling / updating
- learning / RL
- energy harvesting
- multi-source / multi-hop
- edge / IoT / UAV
- estimation / control
- security / privacy
- game theory / pricing
- semantics / goal-oriented   [NEW]
- VoI / AoII / QAoI          [NEW]
- applications

Free tags allowed: V2X, UAV, Whittle, DeepSC, etc.

## Roadmap

- [x] Basic site scaffold (inspired by ALPS)
- [x] 41 seed papers (AoI + semantics)
- [x] Search + label filtering, stats dashboard
- [ ] Import full ALPS-style author graph, year timeline
- [ ] BibTeX export, CSV export
- [ ] Bulk import from OpenAlex / DBLP (script)
- [ ] Community contribution guide + issue templates

## Acknowledgements

UI inspired by ALPS (Alexander Lindermayr & Nicole Megow). AoI community.

## License

MIT
