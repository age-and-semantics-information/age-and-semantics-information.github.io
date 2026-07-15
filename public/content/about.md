# About

## Goal

**Age of Information (AoI)** has grown from a single INFOCOM 2012 paper into a vibrant field. Recently, the community has expanded toward **semantics-aware and goal-oriented communications** — including Age of Incorrect Information (AoII), Value of Information (VoI), Quality of Information (QAoI), and semantic effectiveness.

This site **Age and Semantics of Information** provides a **comprehensive, community-driven overview** of this evolving landscape, inspired by [ALPS — Algorithms with Predictions](https://algorithms-with-predictions.github.io/).

We curate:
- **Core AoI**: queueing analysis, sampling, scheduling, Whittle index, MDP
- **Distributed & systems**: multi-source, multi-hop, edge, IoT, UAV, V2X, energy harvesting
- **Learning & control**: RL for AoI, estimation, control, POMDP
- **Semantics & goal-oriented**: AoII, VoI, semantics-aware scheduling, goal-oriented communications, effectiveness
- **Applications & security**: pricing, game theory, privacy, autonomous systems

## Hosting

- **Primary repo**: [`age-and-semantics-information/age-and-semantics-information.github.io`](https://github.com/age-and-semantics-information/age-and-semantics-information.github.io)
- **Live site**: **https://age-and-semantics-information.github.io/**
- **Build**: GitHub Actions → GitHub Pages (workflow), `VITE_BASE=/`
- Inspired by ALPS (Alexander Lindermayr & Nicole Megow) — we thank them for open-sourcing.

## Maintainers

Initiated by Zhongdong Liu and community contributors — PRs welcome! Contact via GitHub Issues.

## Tech

Vite 6 + React 19 + MUI v7 + TypeScript + GitHub Pages. Papers as YAML → JSON (`scripts/composeData.js`). Features: searchable list, year timeline, venue chart, author collaboration graph (react-force-graph-2d + d3-force).

## Citation

If this resource helps your research, please star the repo and cite the community site. Individual papers should be cited via their own venues/bibtex (click venue link on each paper card).
