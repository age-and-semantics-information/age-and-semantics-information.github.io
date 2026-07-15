"""
Import from OpenAlex for AoI + AoII + goal-oriented + semantics-related
Dedup by normalized title, merging publications like ALPS
Supports --since-days for weekly cron
"""
import os, re, time, yaml, json, pathlib, hashlib, sys, argparse, datetime
from urllib.parse import quote
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
PAPERS_DIR = ROOT / "papers"

# Parse args for cron weekly
parser = argparse.ArgumentParser()
parser.add_argument('--since-days', type=int, default=0, help='Only fetch papers from last N days (0 = all time for these queries)')
args, _ = parser.parse_known_args()
SINCE_DAYS = args.since_days
if SINCE_DAYS > 0:
    since_date = (datetime.datetime.utcnow() - datetime.timedelta(days=SINCE_DAYS)).strftime('%Y-%m-%d')
    print(f"Since-days filter: last {SINCE_DAYS} days, from {since_date}")
else:
    since_date = None


def build_queries():
    base_aoi = "title.search:%22age%20of%20information%22"
    if SINCE_DAYS > 0:
        # Use since_date for AoI query
        base_aoi = f"{base_aoi},from_publication_date:{since_date}"
    else:
        base_aoi = f"{base_aoi},from_publication_date:2023-01-01"

    queries = [
        (f"aoi_{'since'+str(SINCE_DAYS) if SINCE_DAYS>0 else '2023+'}", base_aoi, "scheduling / optimization"),
    ]
    # For other queries, also apply since filter if requested
    def with_since(f):
        if SINCE_DAYS>0:
            return f"{f},from_publication_date:{since_date}"
        return f
    queries += [
        ("aoii", with_since("title.search:%22age%20of%20incorrect%20information%22"), "VoI / AoII / QAoI"),
        ("aoii2", with_since("title.search:%22age%20of%20incorrect%22"), "VoI / AoII / QAoI"),
        ("semantic_age", with_since("title.search:%22semantic%20communication%22,abstract.search:age"), "semantics / goal-oriented"),
        ("goal_oriented", with_since("title.search:%22goal-oriented%20communication%22"), "semantics / goal-oriented"),
        ("goal_oriented2", with_since("title.search:%22goal%20oriented%20communication%22"), "semantics / goal-oriented"),
        ("voi_age", with_since("title.search:%22value%20of%20information%22,abstract.search:age"), "VoI / AoII / QAoI"),
    ]
    return queries

QUERIES = build_queries()


def normalize_title(t):
    t = re.sub(r'\s+', ' ', t.lower()).strip()
    t = re.sub(r'[^a-z0-9 ]', '', t)
    return t

def extract_authors(authorships):
    authors = []
    for a in authorships:
        name = a.get('author',{}).get('display_name','')
        if name:
            authors.append(name)
    return ", ".join(authors) if authors else "Unknown"

def infer_label(title, abstract, query_label_hint):
    text = (title + " " + (abstract or "")).lower()
    labels = set()
    # Always include hint if provided
    if query_label_hint:
        labels.add(query_label_hint)

    # Keyword to label mapping
    mapping = {
        "scheduling": "scheduling / optimization",
        "queue": "queueing analysis",
        "sampling": "sampling / updating",
        "learning": "learning / RL",
        "reinforcement": "learning / RL",
        "deep": "learning / RL",
        "energy harvesting": "energy harvesting",
        "energy": "energy harvesting",
        "uav": "edge / IoT / UAV",
        "drone": "edge / IoT / UAV",
        "iot": "edge / IoT / UAV",
        "edge": "edge / IoT / UAV",
        "vehicular": "applications",
        "v2x": "applications",
        "game": "game theory / pricing",
        "pricing": "game theory / pricing",
        "auction": "game theory / pricing",
        "control": "estimation / control",
        "estimation": "estimation / control",
        "channel": "theory / fundamentals",
        "information theory": "theory / fundamentals",
        "security": "security / privacy",
        "privacy": "security / privacy",
        "semantic": "semantics / goal-oriented",
        "goal-oriented": "semantics / goal-oriented",
        "goal oriented": "semantics / goal-oriented",
        "incorrect": "VoI / AoII / QAoI",
        "value of information": "VoI / AoII / QAoI",
        "qaoi": "VoI / AoII / QAoI",
        "query age": "VoI / AoII / QAoI",
        "survey": "survey / tutorial",
        "tutorial": "survey / tutorial",
        "overview": "survey / tutorial",
    }
    for kw, lbl in mapping.items():
        if kw in text:
            labels.add(lbl)
    if not labels:
        labels.add("theory / fundamentals")
    # Limit to 3 labels max to avoid clutter
    # Keep most specific
    return sorted(list(labels))[:4]

def make_filename(authors, year, title, existing_names):
    first_author = authors.split(',')[0].split(' and ')[0].strip()
    tokens = re.split(r'\s+', first_author.strip())
    last = tokens[-1] if tokens else "Unknown"
    last = re.sub(r'[^A-Za-z]', '', last)
    words = re.findall(r'\b[a-zA-Z]{4,}\b', title)
    kw = ''.join([w[:4] for w in words[:2]]).lower() if words else "paper"
    base = f"{last}{year if year else ''}{kw}"
    base = re.sub(r'[^A-Za-z0-9]', '', base)
    if len(base) < 5:
        base = f"Paper{year}{hashlib.md5(title.encode()).hexdigest()[:4]}"
    fname = f"{base}.yml"
    counter = 2
    while fname in existing_names or (PAPERS_DIR / fname).exists():
        fname = f"{base}_{counter}.yml"
        counter += 1
        if counter > 20:
            fname = f"{base}_{hashlib.md5(title.encode()).hexdigest()[:6]}.yml"
            break
    return fname

def load_existing():
    existing = {}
    for yml in PAPERS_DIR.glob("*.yml"):
        try:
            data = yaml.safe_load(open(yml, encoding='utf-8'))
            if not data or not data.get('title'):
                continue
            key = normalize_title(data['title'])
            existing[key] = {"file": yml, "data": data}
        except Exception as e:
            print(f"Failed load {yml}: {e}")
    return existing

def fetch_openalex(filter_str, per_page=100, max_pages=10, sleep=0.2):
    # Uses cursor pagination
    all_results = []
    cursor = "*"
    base_url = "https://api.openalex.org/works"
    for page in range(max_pages):
        url = f"{base_url}?filter={filter_str}&per_page={per_page}&cursor={quote(cursor)}&select=id,doi,display_name,title,publication_year,publication_date,authorships,primary_location,open_access,abstract_inverted_index"
        # print(f"Fetching: {url[:150]}...")
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "AoI-site/1.0 (mailto:zhongdong@vt.edu)"})
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read().decode('utf-8'))
        except Exception as e:
            print(f"Failed fetch {filter_str} page {page}: {e}")
            time.sleep(2)
            continue
        results = data.get('results', [])
        meta = data.get('meta', {})
        count = meta.get('count',0)
        if page==0:
            print(f"Query [{filter_str}] total count: {count}, fetching {per_page} per page")
        all_results.extend(results)
        # Check if next cursor
        next_cursor = meta.get('next_cursor')
        if not next_cursor or len(results) < per_page:
            break
        cursor = next_cursor
        time.sleep(sleep)
        # Safety: if we already have enough for 2023+ AoI we may want all, but limit to avoid too many
        if len(all_results) >= 1000:
            print(f"Reached 1000 results for {filter_str}, stopping")
            break
    return all_results

def main():
    existing_map = load_existing()
    print(f"Existing papers: {len(existing_map)}")
    existing_filenames = set([p.name for p in PAPERS_DIR.glob("*.yml")])

    new_entries = {}  # normalized title -> entry
    merged_existing = {}  # key -> data (to write back)

    total_fetched = 0
    for qname, filter_str, label_hint in QUERIES:
        print(f"\n=== Query {qname}: {filter_str} ===")
        results = fetch_openalex(filter_str, per_page=200, max_pages=10)
        print(f"Fetched {len(results)} works for {qname}")
        total_fetched += len(results)
        for work in results:
            title = work.get('display_name') or work.get('title')
            if not title or len(title) < 10:
                continue
            # Skip if title is too generic or not containing AoI-like
            # For AoI query, should be okay
            norm = normalize_title(title)
            if not norm:
                continue
            year = work.get('publication_year')
            doi = work.get('doi')
            # URL: prefer DOI, else OpenAlex id, else primary location landing page
            url = doi or work.get('id')
            primary = work.get('primary_location',{})
            if primary:
                landing = primary.get('landing_page_url')
                if landing:
                    url = landing
            source = primary.get('source',{}) if primary else {}
            venue_name = source.get('display_name','') if source else ''
            if not venue_name:
                venue_name = 'arXiv' if 'arxiv' in str(url) else 'Other'

            authors_str = extract_authors(work.get('authorships',[]))

            # Abstract: reconstruct from inverted index if present
            abstract = ""
            inv = work.get('abstract_inverted_index')
            if inv:
                try:
                    # invert: word -> positions
                    # Build array size max pos +1
                    max_pos = max([max(pos) for pos in inv.values()]) if inv else 0
                    arr = [""]*(max_pos+1)
                    for w, poses in inv.items():
                        for pos in poses:
                            if pos < len(arr):
                                arr[pos]=w
                    abstract = " ".join(arr)
                except:
                    abstract = ""

            labels = infer_label(title, abstract, label_hint)

            # Check if exists in existing papers
            if norm in existing_map:
                edata = existing_map[norm]["data"]
                # Check if URL already present
                existing_urls = set([p.get('url') for p in edata.get('publications',[]) if p.get('url')])
                if url not in existing_urls:
                    new_pub = {"name": venue_name[:80], "year": year, "url": url}
                    edata.setdefault('publications', []).append(new_pub)
                    # Merge labels
                    for lbl in labels:
                        if lbl not in edata.get('labels',[]):
                            edata.setdefault('labels', []).append(lbl)
                    merged_existing[norm] = edata
                continue

            # Check if already in new_entries (duplicate across queries)
            if norm in new_entries:
                entry = new_entries[norm]
                # Add publication if new URL
                existing_urls = set([p['url'] for p in entry['publications']])
                if url not in existing_urls:
                    entry['publications'].append({"name": venue_name[:80], "year": year, "url": url})
                    # merge labels
                    for lbl in labels:
                        if lbl not in entry['labels']:
                            entry['labels'].append(lbl)
            else:
                pub = {"name": venue_name[:80], "year": year, "url": url}
                new_entries[norm] = {
                    "title": title,
                    "authors": authors_str,
                    "labels": labels,
                    "publications": [pub],
                    "year": year or 2023,
                }

    print(f"\nTotal fetched across queries: {total_fetched}")
    print(f"New unique papers from OpenAlex: {len(new_entries)}")
    print(f"Existing papers to merge: {len(merged_existing)}")

    # Write back merged existing
    for key, edata in merged_existing.items():
        file_path = existing_map[key]["file"]
        # dedup pubs by URL
        seen = set()
        dedup = []
        for p in edata.get('publications',[]):
            u = p.get('url')
            if u and u in seen:
                continue
            if u:
                seen.add(u)
            dedup.append(p)
        edata['publications'] = sorted(dedup, key=lambda x: (x.get('year') is None, x.get('year') or 0))
        edata['labels'] = sorted(list(set(edata.get('labels',[]))))
        with open(file_path, 'w', encoding='utf-8') as f:
            yaml.dump(edata, f, sort_keys=False, allow_unicode=True)

    # Write new entries
    created = 0
    for norm, entry in new_entries.items():
        entry['labels'] = sorted(list(set(entry['labels'])))[:4]
        entry['publications'] = sorted(entry['publications'], key=lambda x: (x.get('year') is None, x.get('year') or 0))
        entry['year'] = min([p['year'] for p in entry['publications'] if p.get('year')], default=entry.get('year',2023))

        fname = make_filename(entry['authors'], entry['year'], entry['title'], existing_filenames)
        existing_filenames.add(fname)
        out_path = PAPERS_DIR / fname
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

    print(f"Created {created} new YAML files")

if __name__ == "__main__":
    main()
