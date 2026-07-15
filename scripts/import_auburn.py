"""
Import Auburn AoI list (AoI.html) into papers/*.yml
Handles dedup by normalized title, merging publications (like ALPS).
Maps Auburn sections to our 15 labels.
"""
import re, os, pathlib, yaml, json, hashlib, unicodedata, glob
from urllib.parse import urlparse

ROOT = pathlib.Path(__file__).resolve().parents[1]
PAPERS_DIR = ROOT / "papers"
HTML_PATH = pathlib.Path("/tmp/AoI.html")

# Section -> label mapping (Auburn h3 -> our label)
SECTION_LABEL_MAP = {
    "Book and Overview": "survey / tutorial",
    "Tutorial": "survey / tutorial",
    "Thesis": "survey / tutorial",
    "Age of Information and Game Theory": "game theory / pricing",
    "Source and Channel Coding": "theory / fundamentals",
    "Cache Freshness": "scheduling / optimization",
    "Age of Information and Information Theory": "theory / fundamentals",
    "Age of Channel State Information": "theory / fundamentals",
    "Energy Harvesting": "energy harvesting",
    "UAV-assisted": "edge / IoT / UAV",
    "Age of Information and Learning": "learning / RL",
    "Age of Information in Practical Systems": "applications",
    "Economics, and Human in the Loop": "game theory / pricing",
    "Age of Information and Control": "estimation / control",
    "Online Sampling and Remote Estimation": "sampling / updating",
    "Age-based Scheduling": "scheduling / optimization",
    "Vehicular and Train Networks": "applications",
    "Semantic and Goal-oriented Communication": "semantics / goal-oriented",
    "Age of Information Analysis and Optimization": "queueing analysis",
    "Applications": "applications",
}

def normalize_title(t):
    t = re.sub(r'<[^>]+>', '', t)
    t = t.strip()
    # lower, remove punctuation, collapse whitespace
    t = t.lower()
    t = re.sub(r'\s+', ' ', t)
    t = re.sub(r'[^a-z0-9 ]', '', t)
    return t.strip()

def normalize_title_key(t):
    return normalize_title(t)

def extract_year(text):
    m = re.findall(r'\b(19|20)\d{2}\b', text)
    # Actually find full year
    m2 = re.findall(r'\b((?:19|20)\d{2})\b', text)
    if m2:
        return int(m2[-1])
    return None

def extract_authors_and_venue(rest):
    # rest example: "Roy D. Yates, Yin Sun, ... <i>IEEE JSAC,</i> 2020."
    # try to extract <i>...</i>
    venue_match = re.search(r'<i[^>]*>(.*?)</i>', rest, re.I|re.S)
    venue = ""
    if venue_match:
        venue = re.sub(r'<[^>]+>', '', venue_match.group(1)).strip()
        venue = venue.rstrip(',').strip()
    # authors: remove venue part and year
    # remove <i>...</i> from rest for authors
    rest_no_i = re.sub(r'<i[^>]*>.*?</i>', '', rest, flags=re.I|re.S)
    # remove html tags
    rest_clean = re.sub(r'<[^>]+>', '', rest_no_i)
    rest_clean = rest_clean.strip()
    # authors is everything before year
    # remove year at end
    rest_clean = re.sub(r'\b(19|20)\d{2}\b\.?\s*$', '', rest_clean).strip()
    rest_clean = rest_clean.rstrip(',').strip()
    authors = rest_clean
    return authors, venue

def infer_pub_name(url, venue_text):
    if venue_text:
        # clean common suffixes
        vt = venue_text.strip()
        # sometimes venue includes IEEE, etc
        if len(vt) > 3:
            return vt
    # infer from URL
    domain = urlparse(url).netloc.lower()
    if 'arxiv' in domain:
        return 'arXiv'
    if 'ieeexplore' in domain:
        return 'IEEE'
    if 'acm' in domain or 'dl.acm.org' in domain:
        return 'ACM'
    if 'springer' in domain:
        return 'Springer'
    if 'mdpi' in domain:
        return 'MDPI'
    if 'cambridge' in domain:
        return 'Book Chapter'
    return 'Other'

def parse_auburn_sections(html_text):
    # Split by <h3> sections
    # Find all h3 title and content until next h3
    sections = []
    # pattern <h3> ... </h3>  content until next <h3>
    pattern = re.compile(r'<h3[^>]*>\s*(.*?)\s*</h3>(.*?)(?=<h3|$)', re.I|re.S)
    for m in pattern.finditer(html_text):
        title_raw = m.group(1)
        title_clean = re.sub(r'<[^>]+>', '', title_raw).strip()
        content = m.group(2)
        sections.append((title_clean, content))
    return sections

def extract_entries_from_section_content(content):
    # Find all <li> entries with <a href=...>
    # Our pattern: <li> <b> <a href="URL">Title</a></b><br> rest <br><br>
    entries = []
    # More robust: find <li ...><b> <a href="...">...</a>
    # Use regex
    # We need to handle that <li> may not be closed
    # Look for <li> ... <a href=...>Title</a> ... <br><br>
    pattern = re.compile(r'<li[^>]*>\s*<b>\s*<a href="([^"]+)"[^>]*>(.*?)</a>\s*</b>\s*<br>\s*(.*?)(?:<br>\s*<br>|(?=<li)|$)', re.I|re.S)
    for mm in pattern.finditer(content):
        href = mm.group(1).strip()
        title_raw = mm.group(2)
        rest = mm.group(3)
        title = re.sub(r'<[^>]+>', '', title_raw).strip()
        title = re.sub(r'\s+', ' ', title).strip()
        # Skip if title is workshop or empty or too short, or contains "Workshop was held"
        if len(title) < 10:
            continue
        if 'workshop was held' in title.lower():
            continue
        if 'course on age' in title.lower():
            continue
        entries.append((href, title, rest))
    return entries

def load_existing_papers():
    existing = {}
    for yml in PAPERS_DIR.glob("*.yml"):
        try:
            data = yaml.safe_load(open(yml, encoding='utf-8'))
            if not data or not data.get('title'):
                continue
            key = normalize_title_key(data['title'])
            existing[key] = {"file": yml, "data": data}
        except Exception as e:
            print(f"Failed to load {yml}: {e}")
    return existing

def make_filename(authors, year, title, existing_names):
    # first author last name
    first_author = authors.split(',')[0].split(' and ')[0].strip()
    # get last token as last name
    # handle "Yin Sun" -> Sun
    tokens = re.split(r'\s+', first_author.strip())
    last = tokens[-1] if tokens else "Unknown"
    last = re.sub(r'[^A-Za-z]', '', last)
    # keywords
    # first 2 significant words from title
    words = re.findall(r'\b[a-zA-Z]{4,}\b', title)
    kw = ''.join([w[:4] for w in words[:2]]).lower() if words else "paper"
    base = f"{last}{year if year else ''}{kw}"
    # sanitize
    base = re.sub(r'[^A-Za-z0-9]', '', base)
    if len(base) < 5:
        base = f"Paper{year}{hashlib.md5(title.encode()).hexdigest()[:4]}"
    fname = f"{base}.yml"
    # ensure unique
    counter = 2
    while fname in existing_names or (PAPERS_DIR / fname).exists():
        # check if file exists and title matches existing (then we would merge, not create)
        # for uniqueness, append counter
        fname = f"{base}_{counter}.yml"
        counter += 1
        if counter > 20:
            fname = f"{base}_{hashlib.md5(title.encode()).hexdigest()[:6]}.yml"
            break
    return fname

def main():
    html = open(HTML_PATH, encoding='utf-8', errors='ignore').read()
    sections = parse_auburn_sections(html)
    print(f"Found {len(sections)} sections")
    for title,_ in sections:
        print(f"  - {title}")

    existing_map = load_existing_papers()
    print(f"Existing papers: {len(existing_map)}")

    # For new papers accum
    new_entries_map = {}  # normalized title -> {title, authors, labels set, publications list, year}
    # Also for merging with existing, track

    # Build mapping of existing titles to include in new_entries_map for easy merging?
    # We'll keep separate: if title exists in existing_map, merge into that existing file later

    to_merge_into_existing = {}  # key -> list of (pub)

    total_parsed = 0
    skipped_no_year = 0

    for sec_title, sec_content in sections:
        # Map section to label
        label = None
        for k,v in SECTION_LABEL_MAP.items():
            if k.lower() in sec_title.lower():
                label = v
                break
        if not label:
            # skip sections like Timely News, Workshops, Call for Papers, Course
            if any(x in sec_title.lower() for x in ["timely news", "workshop", "call for papers", "course"]):
                continue
        entries = extract_entries_from_section_content(sec_content)
        # print(f"Section {sec_title}: {len(entries)} entries, label={label}")
        for href, title, rest in entries:
            total_parsed += 1
            authors, venue = extract_authors_and_venue(rest)
            year = extract_year(rest)
            if not year:
                # try to extract from title or href? skip if no year
                skipped_no_year += 1
                continue
            # filter year < 2010 maybe noise? but keep
            if year < 2009 or year > 2023:
                # Auburn list includes 2023 entries even though said updated 2022, keep if 2023 but skip future >2024?
                if year > 2023:
                    # Keep 2023 as they added some, but skip 2024+
                    if year > 2024:
                        continue
            norm_key = normalize_title_key(title)
            if not norm_key:
                continue

            pub_name = infer_pub_name(href, venue)
            # If venue text includes IEEE, use it more specific
            if venue and len(venue) > 2:
                pub_name = venue[:80]

            # Check if exists in existing papers
            if norm_key in existing_map:
                # Merge into existing file
                edata = existing_map[norm_key]["data"]
                # Check if this URL already present
                existing_urls = set([p.get('url') for p in edata.get('publications',[]) if p.get('url')])
                if href not in existing_urls:
                    # add publication
                    new_pub = {"name": pub_name, "year": year, "url": href}
                    edata.setdefault('publications', []).append(new_pub)
                    # add label if not present
                    if label and label not in edata.get('labels',[]):
                        edata.setdefault('labels', []).append(label)
                    # Mark for write back?
                    to_merge_into_existing[norm_key] = edata
                continue

            # Check if already in new_entries_map (duplicate across sections)
            if norm_key in new_entries_map:
                entry = new_entries_map[norm_key]
                # Merge publication if new URL
                existing_urls = set([p['url'] for p in entry['publications']])
                if href not in existing_urls:
                    entry['publications'].append({"name": pub_name, "year": year, "url": href})
                if label and label not in entry['labels']:
                    entry['labels'].append(label)
                # keep earliest year for filename? but keep max year for sorting? We'll keep existing year
            else:
                new_entries_map[norm_key] = {
                    "title": title,
                    "authors": authors if authors else "Unknown",
                    "labels": [label] if label else ["theory / fundamentals"],
                    "publications": [{"name": pub_name, "year": year, "url": href}],
                    "year": year,
                }

    print(f"Total parsed entries: {total_parsed}, skipped no year: {skipped_no_year}")
    print(f"New unique papers from Auburn: {len(new_entries_map)}")
    print(f"Existing papers to merge new venues: {len(to_merge_into_existing)}")

    # Write back merged existing papers
    for key, edata in to_merge_into_existing.items():
        file_path = existing_map[key]["file"]
        # Deduplicate publications by URL
        seen_urls = set()
        dedup_pubs = []
        for p in edata.get('publications',[]):
            u = p.get('url')
            if u and u in seen_urls:
                continue
            if u:
                seen_urls.add(u)
            dedup_pubs.append(p)
        edata['publications'] = dedup_pubs
        # sort publications by year
        edata['publications'] = sorted(edata['publications'], key=lambda x: x.get('year',0))
        # Ensure labels unique
        edata['labels'] = sorted(list(set(edata.get('labels',[]))))
        # Write YAML
        with open(file_path, 'w', encoding='utf-8') as f:
            yaml.dump(edata, f, sort_keys=False, allow_unicode=True)
        # print(f"Merged into {file_path.name}")

    # Write new papers
    existing_filenames = set([p.name for p in PAPERS_DIR.glob("*.yml")])
    created = 0
    for norm_key, entry in new_entries_map.items():
        # Ensure labels unique
        entry['labels'] = sorted(list(set(entry['labels'])))
        # Sort pubs by year
        entry['publications'] = sorted(entry['publications'], key=lambda x: x.get('year',0))
        # Year field for sorting: use earliest year? Use min year
        entry['year'] = min([p['year'] for p in entry['publications'] if p.get('year')], default=entry.get('year',2020))

        fname = make_filename(entry['authors'], entry['year'], entry['title'], existing_filenames)
        existing_filenames.add(fname)
        out_path = PAPERS_DIR / fname
        # Prepare final YAML structure similar to existing
        out_data = {
            "title": entry['title'],
            "authors": entry['authors'],
            "labels": entry['labels'],
            "publications": entry['publications'],
            "year": entry['year'],
        }
        with open(out_path, 'w', encoding='utf-8') as f:
            yaml.dump(out_data, f, sort_keys=False, allow_unicode=True)
        created += 1

    print(f"Created {created} new YAML files in {PAPERS_DIR}")

if __name__ == "__main__":
    main()
