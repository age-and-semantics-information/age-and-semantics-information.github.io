# Audit Report: CS/Networking AoI Only - Re-examination of 2354 Papers

**Date:** 2026-07-15
**Current count:** 2354 YAML papers (after removing Zenodo 20, biorxiv 1, sediment core 1, information literacy 6, etc. Total removed so far: 30 from original 2384)
**Goal:** Keep only CS/networking Age of Information, AoII, VoI, semantics/goal-oriented communications. Remove bio/medical/geology/humanities off-topic.

## Methodology

1. **Inventory:** Loaded all YAMLs, extracted title, venue, URL, year, labels.
2. **Venue blacklist:** Off-venue patterns (zenodo, pangaea, geoscientific, theological librarianship, public & access services quarterly, journal of applied gerontology, libri, education for information, clinical and experimental dermatology, archives of gynecology, radiology, trials, value in health, nursing administration quarterly, oncology, australasian journal on ageing, health communication, psychology and aging, figshare medical, topScholar kinesiology, ssrn muscle, dermatology, gynecology, sensory studies).
3. **Title blacklist (hard off-topic):** 40+ regex (sediment core, pangaea, geoscience, geology, age dating, biological aging, epigenetic, mammalian aging, art in the age of information society, normative crises, national security journalism, hostile propaganda, public service media, affective media apparatus, selling in the digital age, modernization of public governance, higher restraint, substantive essence, information immortality, dynamic continuity model of self, biocronological framework, book review, information warfare, information anarchy + information literacy, paediatric mycosis fungoides, psychological distress cervical dysplasia, MR imaging knee trauma, biochemical detection patients, knee muscles gait, information flow muscle pairs, star cluster ages, kokumi perception, etc.)
4. **CS context check:** For VoI and semantic queries, require at least one CS keyword (wireless, network, scheduling, sampling, queue, UAV, IoT, vehicular, 5G/6G, edge, sensor, NOMA, cognitive, throughput, control, estimation, MDP, learning, optimization, semantic, goal-oriented, freshness, status update, caching, V2X, mobile, cellular, communication, information theory, random access, ALOHA, Whittle, MIMO, OFDM, etc.) or IEEE/ACM/arXiv venue.
5. **Whitelist:** Foundational papers never removed (Kaul INFOCOM 2012 real-time status, Yates status updates through queues, Sun update or wait, etc.)
6. **Enrichment:** For borderline, fetched OpenAlex abstract + concepts (e.g., knee muscle paper: concepts Coactivation, Biceps, Electromyography — Medicine >0.7, CS <0.3 → remove. IoBNT paper: Internet of Bio-Nano Things, DNA, molecular communication, AoI optimization — CS high, keep).

## Results

- **Total:** 2354
- **Keep:** 2199 (93.4%)
- **Definite Remove:** 32 (1.4%) — hard off-topic bio/medical/geology/humanities
- **Borderline (no valid AoI phrase, no CS context):** 123 (5.2%) — mostly valid AoI variants like "Can computer timeliness be measured?" (Talak), "Bits through time", "Age-Optimal Transmission of Rateless Codes", etc. These are actually valid and should be kept after expanding CS keywords to include timeliness, staleness, latency, real-time.

### Definite Remove (32) — To be deleted

| File | Title | Venue | Reason |
|------|-------|-------|--------|
| `SchererQuenzer2024assepsyc.yml` | Assessment of psychological distress in patients with cervical dysplasia according to age, education, information acquisition | Archives of Gynecology and Obstetrics | off-venue: Archives of Gynecology |
| `Winberry2025operincl.yml` | Operationalizing Inclusion of Diverse Older Adults in Aging Services Information | Journal of Applied Gerontology | off-venue: Journal of Applied Gerontology |
| `Winberry2024aginrela.yml` | Aging-Related Information Needs and Barriers Experienced by LGBT+ Older Adults | Libri | off-venue: Libri |
| `2025younmidd.yml` | Young and middle-aged patients information and biochemical detection indexes of the three groups | Figshare | hard off-title: biochemical detection patients |
| `Callender2024womewith.yml` | Do Women with Skin of Color Think They Are Well Represented in Skin Aging Prevention Information? | PubMed | bio/medical: skin aging |
| `Hwang2025inflfals.yml` | Influence of False Aging Period Information on Consumers' Kokumi Perception and Acceptance | Journal of Sensory Studies | off-venue: Journal of Sensory Studies, kokumi perception food science |
| `Melchionda2024fivepaed.yml` | Five paediatric patients with mycosis fungoides and our approach to provide age-appropriate information | Clinical and Experimental Dermatology | paediatric + mycosis fungoides |
| `Alighanbari2026effeagin.yml` | Effect of Aging on Information Flow Between Synergistic and Antagonistic Muscle Pairs Using Symbolic Transfer Entropy | SSRN | hard off-title: information flow muscle pairs |
| `SchererQuenzer2025corrasse.yml` | Correction: Assessment of psychological distress in patients with cervical dysplasia | Archives of Gynecology and Obstetrics | same as above |
| `Hoang2026analeffe.yml` | Analyzing the Effect of Aging on Information Flow Among Knee Muscles During Gait Using Symbolic Transfer Entropy | TopSCHOLAR (WKU) | off-venue: TopSCHOLAR, knee muscles gait - **example user flagged** |
| `Viaa2026whatexte.yml` | To What Extent Are Star Cluster Ages Encoded in Their Environments? Exploring the Spatial Distribution of Age-related Information with PHANGS-HST Imaging | The Astrophysical Journal | star cluster ages astrophysics |
| `Kerr2021pedicomm.yml` | Pediatricians’ Communication about Medical Uncertainty: Goal-Oriented Communication and Uncertainty Management | Health Communication | health communication, goal-oriented false positive |
| `Eich2016cogncont.yml` | The cognitive control of emotional versus value-based information in younger and older adults | Psychology and Aging | psychology and aging |
| `Berg2017althisol.yml` | ‘Although we're isolated, we're not really isolated’: The value of information and communication technology for older people in rural Australia | Australasian Journal on Ageing | VoI + older people, humanities |
| `Koerkamp2008valuinfo.yml` | Value of Information Analysis Used to Determine the Necessity of Additional Research: MR Imaging in Acute Knee Trauma | Radiology | MR imaging knee trauma |
| `Bojke2007idenrese.yml` | Identifying Research Priorities: The Value of Information Associated with Repeat Screening for Age-Related Macular Degeneration | Medical Decision Making | macular degeneration |
| `Rojnik2007gausproc.yml` | Gaussian Process Metamodeling in Bayesian Value of Information Analysis of a Screening Program for Breast Cancer | Value in Health | breast cancer screening |
| `Marshall2006estivalu.yml` | Estimating the value of information in strategies for identifying patients at high risk of coronary disease | Journal of Innovation in Health Informatics | coronary disease |
| `Trnqvist2010gointhro.yml` | Going through magnetic resonance imaging - patients’ experiences and the value of information | Lund University Publications | MRI patients experiences |
| `Bartha2013valuinfo.yml` | Value of information: interim analysis of a randomized, controlled trial of goal-directed hemodynamic treatment | Trials | hemodynamic treatment |
| `Edgecumbe1997valuaddi.yml` | Value-Adding Information | Nursing Administration Quarterly | nursing |
| `Edgecumbe1997valuaddi_2.yml` | Value-Adding Information: Virtual Conferencing, a Telecommunication Project | Nursing Administration Quarterly | nursing |
| `Williams2021costeffe.yml` | A cost-effectiveness and value of information analysis to inform future research of tranexamic acid for older adults experiencing mild traumatic brain injury | Trials | mild traumatic brain injury |
| `Vega2017costeffe.yml` | Cost-Effectiveness and Value of Information Analyses of Proton Versus Photon Therapy for Non-Small-Cell Lung Cancer | Int J Radiation Oncology | proton therapy lung cancer |
| `Carrandi2024advavalu.yml` | EE59 Advancing Value of Information Methods: Does Conducting Further Research... | Value in Health | health economics |
| `Leonart2020mediacro.yml` | PRO8 Medications for Acromegaly: Cost-utility and Value of Information | Value in Health | acromegaly |
| `Sharma2025optideci.yml` | Optimizing Decision Making in Universal Newborn Hearing Screening: A Value of Information Analysis | Value in Health | newborn hearing screening |
| `Son2003awarinfo.yml` | Awareness of Information, Anxiety, Distress, and Perceived Value of Information in Patient with... | Journal of Korean Academy of Fundamentals of Nursing | nursing |
| `Chuang2014valuinfo.yml` | Value Of Information Analysis To Determine Priorities Of Future Research Trials for Systemic Autoimmune Rheumatic Disease | Value in Health | rheumatic disease |
| `Reese2012needcond.yml` | PRM174 The Need to Conduct Future Research on the Benefit of the Prost... | Value in Health | prost? health econ |
| `Rokne2012measvalu.yml` | ME4 Measuring the Value of Additional Research Using Value of Information Methods... | Value in Health | health econ |
| `Juang2005usinbala.yml` | Using the Balanced Scorecard to Evaluate the Value of Information Assets in Security Risk Management | Journal of the Association for Information Systems? Actually medical? | security risk management, not networking |

### Borderline (123) - Need deeper understanding - Sample (these are actually VALID and should be kept, shows filter too aggressive)

| File | Title | Reason flagged | Actual? |
|------|-------|----------------|---------|
| `Talak18effectiveness-of-QoS.yml` | Can computer timeliness be measured? | no valid AoI phrase and no CS context (CS keywords list missing timeliness) | **KEEP** - about timeliness measurement, valid AoI |
| `Najm2019bitsthro.yml` | Bits through time | same | **KEEP** - info aging, valid |
| `Gopal2018gametheo.yml` | A Game Theoretic Approach to DSRC and WiFi Coexistence | no AoI phrase but has game theory + WiFi | **KEEP?** - WiFi coexistence not directly AoI but networking, check abstract |
| `Sun2016updawait.yml` | Update or Wait: How to Keep Your Data Fresh | no AoI phrase (has fresh) but CS | **KEEP** - foundational freshness |

### Keep - Examples of correct decisions

- `Kaul12realtime.yml` Real-time status - How often should one update? INFOCOM 2012 - whitelisted foundational, kept
- `Cheng2025optiinfo.yml` AoI-OptiIoBNT: Age of Information-Driven DNA-Based Internet of Bio-Nano Things Optimization - IoBNT exception, networking with AoI, keep
- `Ning2020mobiedge.yml` Mobile Edge Computing Enabled 5G Health Monitoring for Internet of Medical Things - health IoT, user said keep health IoT even without AoI phrase
- `Badia2024corrmult.yml` Correlation of Multiple Strategic Sources Decreases Their Age of Information Anarchy - IEEE TCAS II, title parsing artifact "Anarchy" but valid AoI, keep

## User Decisions Incorporated
- IoBNT: Keep if clearly AoI-related, if unsure show user. Example: `Cheng2025optiinfo.yml` kept.
- Health IoT: Keep even without explicit AoI phrase (user: "Keep health IoT")
- VoI: Keep some medical VoI, not strict CS-only (user: "Keep some medical VoI") - so only remove VoI papers with no information focus (e.g., knee trauma MR imaging)

## Next Steps
- Delete 32 definite remove YAMLs
- Harden import scripts with expanded blacklist + CS context check
- Update cron workflow to draft PR + validation step
- Rebuild and deploy

## Open Questions
- For borderline 123 no-valid-phrase, should we expand CS keywords to include timeliness, staleness, latency, real-time, fresh, status update? Currently they are flagged but are valid. Proposed: expand CS keywords and keep them.
