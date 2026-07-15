# How to Contribute

This site is **open-source, community-driven**. Inspired by ALPS.

## Primary Repo

**https://github.com/age-and-semantics-information/age-and-semantics-information.github.io** — all PRs go here. Live site: **https://age-and-semantics-information.github.io/**.

## Adding / Editing Papers

Papers live as YAML in `papers/`. Example:

```yml
title: Real-time status - How often should one update?
authors: Kaul, Yates, Gruteser
labels:
  - theory / fundamentals
  - semantics / goal-oriented
publications:
  - name: INFOCOM
    year: 2012
    url: https://ieeexplore.ieee.org/document/6195309
year: 2012
```

- `labels`: pick from primary categories in `src/constants.ts` — includes `semantics / goal-oriented` and `VoI / AoII / QAoI`
- Secondary free-form tags allowed: e.g., `V2X`, `UAV`, `Whittle`, `DeepSC`, `goal-oriented`, `QAoI`
- Filename convention: `FirstAuthorYearKeyword.yml` e.g. `Yates21survey.yml`
- Please check `public/papers.json` duplicate titles before PR (handled by compose script)

### PR Flow (recommended)

1. Fork `age-and-semantics-information/age-and-semantics-information.github.io`
2. Add YAML file to `papers/`
3. `npm install; npm run dev` — check at http://localhost:3000
4. Commit and create PR with short description + source link (arXiv/DOI)

### Via Issue

Open an Issue with PDF link / bibtex — we will add it.

### What makes a good contribution?

- Foundational surveys/tutorials we missed
- Recent (2024-2026) semantics/goal-oriented papers, AoII, VoI
- Corrections to labels/venues/URLs

## Other Contributions

- Improve categories, labels, add missing surveys to `material.md`
- UI features: BibTeX export, CSV export, bulk import from OpenAlex/DBLP
- Bulk import automation: scripts to fetch from DBLP/OpenAlex (see roadmap)

## Local Dev

```bash
npm install
npm run dev   # http://localhost:3000
npm run build # dist/ - auto-deployed via GitHub Actions to Pages
```

No `VITE_BASE` needed for org pages (defaults to `/`). Workflow is at `.github/workflows/deploy.yml`.

Thank you for helping keep AoI + Semantics literature organized!
