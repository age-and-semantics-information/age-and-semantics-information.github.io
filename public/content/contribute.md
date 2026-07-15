# How to Contribute

This site is **open-source, community-driven**. Inspired by ALPS.

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

- `labels`: pick from primary categories in `src/constants.ts` — we now include `semantics / goal-oriented` and `VoI / AoII / QAoI`
- Secondary free-form tags allowed: e.g., `V2X`, `UAV`, `Whittle`, `DeepSC`, `goal-oriented`
- Filename convention: `FirstAuthorYearKeyword.yml` e.g. `Yates21survey.yml`

### PR Flow

1. Fork `Zhongdong1994/age-and-semantics-information` or `age-and-semantics-information/age-and-semantics-information.github.io`
2. Add YAML file to `papers/`
3. `npm install; npm run dev` — check at localhost:3000
4. Commit and create PR with short description

### Email

Send PDF link / YAML to maintainer if you prefer — we will add.

## Other Contributions

- Improve categories, labels, add missing surveys
- Add content to `material.md` (workshops, tutorials)
- UI features: year histogram, author graph (like ALPS), BibTeX export, CSV export
- Automation: scripts to fetch from DBLP/OpenAlex

## Dev

```bash
npm install
npm run dev   # http://localhost:3000
npm run build # dist/
```

Deploy: GitHub Actions workflow `.github/workflows/deploy.yml` builds to Pages. Set repo variable `VITE_BASE` to `/` for org pages (`age-and-semantics-information.github.io`) or `/age-and-semantics-information/` for project pages under personal account.

Thank you!
