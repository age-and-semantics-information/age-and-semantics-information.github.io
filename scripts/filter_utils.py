"""
Shared filtering utilities for AoI + Semantics site
CS/Networking AoI only - filters out bio/medical/geology/humanities
"""
import re

# Foundational whitelist - never remove these even if title doesn't contain exact AoI phrase
FOUNDATIONAL_WHITELIST = {
    'Kaul12realtime.yml',
    'Yates12status-updates-through-queues.yml',
    'Sun17update-or-wait.yml',
    'Talak19distributed-scheduling.yml',
    'Bedewy17optimizing-age-with-queueing.yml',
    'Yates15nonlinear-age.yml',
    'He18status-updates-through-MDP.yml',
    'Zhong18two-freshness-metrics.yml',
    'Yates19age-of-information-survey.yml',
    'Kosta17age-of-information-monograph.yml',
    'Sun19age-of-information-book.yml',
    'Kaul11minimizing-age-vehicular.yml',
}

# Venue blacklist - clearly non-CS
OFF_VENUE_PATTERNS = [
    r'zenodo',
    r'pangaea',
    r'geoscientific',
    r'geoscience',
    r'theological librarianship',
    r'public & access services quarterly',
    r'journal of applied gerontology',
    r'libri',
    r'education for information',
    r'applied science.*information and computing',
    r'asia-pacific journal.*convergent research',
    r'clinical and experimental dermatology',
    r'archives of gynecology',
    r'radiology',
    r'\btrials\b',
    r'value in health',
    r'nursing administration quarterly',
    r'oncology',
    r'australasian journal on ageing',
    r'health communication',
    r'psychology and aging',
    r'figshare.*medical|medical.*figshare',
    r'topscholar.*kinesiology|topscholar',
    r'ssrn.*muscle',
    r'dermatology',
    r'gynecology',
    r'sensory studies',
    r'journal of sensory studies',
    r'archives of gynecology',
    r'clinical and experimental dermatology',
    r'journal of innovation in health',
    r'journal of korean academy of',
    r'journal of applied science.*information and computing',
]

# Title blacklist - hard off-topic, immediate remove
OFF_TITLE_PATTERNS = [
    r'sediment core',
    r'pangaea',
    r'geoscientific',
    r'geoscience',
    r'geology',
    r'age dating',
    r'lithium-ion battery',
    r'lithium ion battery',
    r'li-ion battery',
    r'li ion battery',
    r'lithium.*battery.*capacity',
    r'lithium.*state of charge',
    r'lithium.*state of health',
    r'state of charge.*lithium',
    r'state of health.*lithium',
    r'biological aging',
    r'epigenetic',
    r'mammalian aging',
    r'art in the age of information society',
    r'normative crises',
    r'national security, journalism',
    r'hostile propaganda',
    r'public service media',
    r'affective media apparatus',
    r'selling in the digital age',
    r'modernization of the public governance',
    r'higher restraint',
    r'substantive essence',
    r'information immortality',
    r'dynamic continuity model of self',
    r'biocronological framework',
    r'book review',
    r'information warfare',
    r'information society.*art|art.*information society',
    r'information anarchy.*information literacy|virtue information literacy',
    r'information literacy',
    r'aging-related information needs.*lgbt',
    r'paediatric patients.*mycosis fungoides',
    r'psychological distress.*cervical dysplasia',
    r'mr imaging.*knee trauma',
    r'biochemical detection.*patients',
    r'knee muscles.*gait',
    r'information flow.*muscle pairs',
    r'star cluster ages',
    r'kokumi perception',
    r'paediatric',
    r'mycosis fungoides',
    r'aging as information loss',
    r'a unified dynamical framework for biological aging',
    r'substantive essence and components of the societal phenomenon',
    r'the information society and the cognitive limits',
    r'information literacy in the age of information overload',
    r'bivens-tatum.*virtue information literacy',
    r'information literacy: flourishing in an age',
    r'silver rainbows in the information society',
    r'young and middle-aged patients information and biochemical',
    r'healthy aging as information divergence.*multiplex brain',  # biorxiv
    r'healthy aging as information divergence',
    r'age dating information of sediment core',
    r'hostile propaganda of the digital age',
    r'public service media and national resilience',
    r'affective media apparatus',
    r'selling in the digital age: tailoring information to b2b',
]

# Soft off-topic - needs CS context check
SOFT_OFF_TITLE_KEYWORDS = [
    'patient', 'clinical', 'disease', 'cancer', 'vaccine', 'drug', 'therapy',
    'telomere', 'mortality', 'lifespan', 'genome', 'protein', 'cell', 'gene',
    'tumor', 'skin', 'dysplasia', 'paediatric', 'pediatric', 'ecology', 'species',
    'propaganda', 'journalism', 'governance', 'book review', 'art in the age',
    'cervical', 'mycosis', 'muscle', 'knee', 'gait', 'brain', 'biochemical',
    'mother.*colostrum', 'colostrum', 'macular degeneration', 'tranexamic acid',
    'mild traumatic brain injury', 'breast cancer', 'mri patients', 'psychological distress',
    'star cluster', 'astrophysical', 'kokumi', 'skin aging', 'paediatric patients',
    'cervical dysplasia', 'mycosis fungoides', 'pharmaceutical', 'dermatology',
    'gynecology', 'oncology', 'nursing', 'gerontology', 'vaccine', 'cancer screening',
]

# CS/networking keywords - must have at least one for VoI and broad queries
CS_KEYWORDS = [
    'wireless', 'network', 'scheduling', 'sampling', 'queue', 'uav', 'iot',
    'vehicular', '5g', '6g', 'edge', 'sensor', 'noma', 'cognitive', 'throughput',
    'control', 'estimation', 'mdp', 'learning', 'optimization', 'semantic',
    'goal-oriented', 'freshness', 'status update', 'caching', 'v2x', 'mobile',
    'cellular', 'communication', 'information theory', 'random access', 'aloha',
    'whittle', 'mimo', 'ofdm', 'reinforcement', 'deep', 'federated', 'blockchain',
    'energy harvesting', 'aoi', 'aoii', 'voi', 'qaoi', 'age of information',
    'information freshness', 'timely', 'remote estimation', 'csma', 'backscatter',
    'millimeter', 'massive mimo', 'ris', 'intelligent reflecting', 'non-orthogonal',
    'trajectory', 'trajectory optimization', 'spectrum',
]

def is_off_venue(venue_name: str, url: str) -> bool:
    text = f"{venue_name} {url}".lower()
    for pat in OFF_VENUE_PATTERNS:
        if re.search(pat, text):
            return True
    return False

def is_hard_off_title(title: str) -> bool:
    t = title.lower()
    for pat in OFF_TITLE_PATTERNS:
        if re.search(pat, t):
            return True
    return False

def has_cs_context(title: str, abstract: str = "") -> bool:
    text = f"{title} {abstract}".lower()
    for kw in CS_KEYWORDS:
        if kw in text:
            return True
    return False

def is_bio_title(title: str) -> bool:
    """Check if title is likely biological/medical with no CS context"""
    t = title.lower()
    # If it has hard off pattern, it's bio
    if is_hard_off_title(t):
        # But if it also has strong CS keywords and exact AoI phrase, might still be valid (e.g., IoBNT)
        # Check IoBNT exception: bio-nano + AoI is valid
        if 'bio-nano' in t and 'age of information' in t:
            return False
        if 'internet of bio-nano' in t:
            return False
        # Otherwise, if hard off and no CS, it's bio
        if not has_cs_context(t):
            return True
        # If hard off but has CS, still likely off if it's like "information literacy"
        # For information literacy, always off even if has AoI phrase? Actually "information literacy in the age of information overload" contains age of information overload but not networking
        # So check if title contains information literacy -> off
        if 'information literacy' in t:
            return True
    # Soft check: contains bio keywords and no CS
    soft_bio = ['knee muscle', 'muscle pair', 'knee trauma', 'cervical dysplasia', 'mycosis fungoides',
                'biochemical detection', 'patients information', 'paediatric patients', 'mother.*colostrum',
                'macular degeneration', 'tranexamic acid', 'mild traumatic brain injury', 'breast cancer',
                'skin aging', 'star cluster', 'kokumi', 'magnetic resonance imaging.*patients']
    for pat in soft_bio:
        if re.search(pat, t):
            if not has_cs_context(t):
                return True
    return False

def is_valid_aoi_title(title: str, abstract: str = "") -> bool:
    """Check if title is valid AoI networking - must contain exact AoI phrases or strong CS AoI indicators"""
    t = title.lower()
    # Exact phrases that are strong AoI indicators
    exact_phrases = [
        'age of information',
        'age-of-information',
        'age of incorrect information',
        'age of incorrect',
        'value of information',  # but need CS context for VoI
        'quality of information',
        'qaoi',
        'semantic communication',
        'goal-oriented communication',
        'goal oriented communication',
    ]
    for pat in exact_phrases:
        if pat in t:
            # For VoI, require CS context
            if 'value of information' in t and not has_cs_context(t, abstract):
                # Check if it's medical VoI without CS
                # Keep some medical VoI if user wants? For now require CS
                # But per user decision, keep some medical VoI - so be less aggressive
                # Only reject if no CS and venue is medical
                if any(x in t for x in ['knee','cancer','breast','macular','brain injury','tranexamic']):
                    return False
            return True
    # Freshness + age in title is also valid AoI
    if 'freshness' in t and ('age' in t or 'status' in t):
        return True
    if 'status update' in t and has_cs_context(t):
        return True
    # Age-optimal, age-minimal etc.
    if re.search(r'\bage[-\s]?(optimal|minimal|aware|based|dependent)', t) and has_cs_context(t):
        return True
    return False

def should_keep_paper(title: str, venue: str, url: str, filename: str, abstract: str = "") -> (bool, str):
    """Main decision: keep or remove with reason"""
    # Whitelist
    if filename in FOUNDATIONAL_WHITELIST:
        return True, "whitelisted foundational"

    # Hard off checks
    if is_off_venue(venue, url):
        # Exception: if title contains exact AoI phrase and CS context, even if venue is borderline, keep
        # e.g., Thesis venue is okay for AoI theses
        if 'thesis' in venue.lower() and has_cs_context(title, abstract):
            # Thesis is okay if CS
            pass
        else:
            return False, f"off-venue: {venue}"

    if is_hard_off_title(title):
        # Check IoBNT exception
        if 'bio-nano' in title.lower() and 'age of information' in title.lower():
            return True, "IoBNT exception - bio-nano networking with AoI"
        return False, f"hard off-title pattern matched"

    if is_bio_title(title):
        return False, "bio/medical title without CS context"

    # If title doesn't contain any valid AoI phrase and no CS context, might be off-topic
    # But be conservative: if it's from Auburn, it might be valid even without phrase (e.g., "Real-time status: How often should one update?")
    # So we check CS context as fallback
    if not is_valid_aoi_title(title, abstract) and not has_cs_context(title, abstract):
        # If no valid phrase and no CS context, likely off-topic
        # But check if it's in Auburn whitelist? For now, flag as soft off
        return False, "no valid AoI phrase and no CS context"

    return True, "valid CS/networking AoI"
