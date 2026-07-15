"""
Fix papers with venue 'Other' by querying OpenAlex or better URL inference
"""
import pathlib, yaml, re, json, time, urllib.request, urllib.parse
from collections import Counter

ROOT = pathlib.Path(__file__).resolve().parents[1]
PAPERS_DIR = ROOT / "papers"

def infer_from_url(url):
    url = url.lower()
    if 'arxiv' in url:
        return 'arXiv'
    if 'ieeexplore' in url or 'ieee' in url:
        return 'IEEE'
    if 'acm.org' in url or 'dl.acm.org' in url:
        return 'ACM'
    if 'proquest' in url:
        return 'Dissertation'
    if 'diva-portal' in url or 'escholarship' in url or 'dspace' in url or 'hdl.handle.net' in url or 'rucore' in url or 'infoscience.epfl' in url or 'tel.archives' in url or 'tara.tcd.ie' in url or 'liu.diva' in url or 'mit.edu' in url:
        return 'Thesis'
    if 'researchgate' in url:
        return 'ResearchGate'
    if 'springer' in url:
        return 'Springer'
    if 'mdpi' in url:
        return 'MDPI'
    if 'esic' in url:
        return 'ESIC'
    if 'doi.org' in url:
        # Try to extract some conference from doi suffix?
        # e.g., 10.1109/esic68176.2026... -> ESIC
        m = re.search(r'10\.1109/([a-z]+)', url.lower())
        if m:
            # esic, infocom, etc
            conf = m.group(1)
            # Map common prefixes
            if 'esic' in conf:
                return 'ESIC'
            if 'infocom' in conf:
                return 'INFOCOM'
            if 'isac' in conf:
                return 'IEEE'
        return None  # need API lookup
    return None

def query_openalex_by_title(title, retries=2):
    # Use title.search exact phrase
    # Encode
    q = f'title.search:"{title}"'
    # Actually need to url encode quotes
    # Use filter=display_name.search:"title"
    # Try display_name.search
    encoded = urllib.parse.quote(f'"{title}"')
    # Try display_name.search
    url = f'https://api.openalex.org/works?filter=display_name.search:{encoded}&per_page=2&select=display_name,primary_location,publication_year'
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "AoI-fix/1.0"})
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = json.loads(resp.read().decode())
                results = data.get('results', [])
                if results:
                    # Find best match by title similarity
                    return results[0]
        except Exception as e:
            time.sleep(1)
    return None

def main():
    papers = list(PAPERS_DIR.glob('*.yml'))
    other_files = []
    for p in papers:
        data = yaml.safe_load(open(p, encoding='utf-8'))
        has_other = any(pub.get('name') == 'Other' for pub in data.get('publications',[]))
        if has_other:
            other_files.append(p)

    print(f"Found {len(other_files)} files with 'Other' venue")

    fixed = 0
    still_other = 0
    venue_counter = Counter()

    for idx, yml_path in enumerate(other_files):
        data = yaml.safe_load(open(yml_path, encoding='utf-8'))
        title = data.get('title','')
        new_pubs = []
        changed = False
        for pub in data.get('publications',[]):
            if pub.get('name') != 'Other':
                new_pubs.append(pub)
                venue_counter[pub.get('name')] += 1
                continue
            url = pub.get('url','')
            # Try URL inference first
            inferred = infer_from_url(url)
            if inferred and inferred != 'Other':
                pub['name'] = inferred
                new_pubs.append(pub)
                changed = True
                venue_counter[inferred] += 1
                continue
            # Try OpenAlex lookup
            # Skip if url is thesis/dissertation type (we already handled proquest etc but infer returned None for doi)
            # Try OpenAlex
            result = query_openalex_by_title(title)
            if result:
                primary = result.get('primary_location',{})
                source = primary.get('source',{}) if primary else {}
                venue = source.get('display_name','') if source else ''
                if venue and len(venue) > 2:
                    # Limit length
                    venue = venue[:80]
                    pub['name'] = venue
                    new_pubs.append(pub)
                    changed = True
                    venue_counter[venue] += 1
                    fixed += 1
                else:
                    # Keep Other but try to improve from landing page?
                    # If doi.org url contains conference hint, use it
                    if 'esic' in url.lower():
                        pub['name'] = 'ESIC'
                        new_pubs.append(pub)
                        changed=True
                        venue_counter['ESIC']+=1
                    else:
                        # Fallback to IEEE if doi is 10.1109
                        if '10.1109' in url:
                            pub['name'] = 'IEEE'
                            new_pubs.append(pub)
                            changed=True
                            venue_counter['IEEE']+=1
                        else:
                            new_pubs.append(pub)
                            still_other+=1
                            venue_counter['Other']+=1
            else:
                # No OpenAlex result, fallback
                if '10.1109' in url:
                    pub['name'] = 'IEEE'
                    new_pubs.append(pub)
                    changed=True
                    venue_counter['IEEE']+=1
                elif 'doi.org' in url:
                    # Keep as Other but maybe update to DOI host?
                    new_pubs.append(pub)
                    still_other+=1
                    venue_counter['Other']+=1
                else:
                    new_pubs.append(pub)
                    still_other+=1
                    venue_counter['Other']+=1
            time.sleep(0.12)  # rate limit 10/s

        if changed:
            data['publications'] = new_pubs
            # Deduplicate publications by URL
            seen_urls=set()
            dedup=[]
            for p in data['publications']:
                u=p.get('url')
                if u in seen_urls:
                    continue
                if u:
                    seen_urls.add(u)
                dedup.append(p)
            data['publications']=dedup
            with open(yml_path,'w',encoding='utf-8') as f:
                yaml.dump(data,f,sort_keys=False,allow_unicode=True)
            fixed+=1

        if (idx+1) % 50 == 0:
            print(f"Processed {idx+1}/{len(other_files)}, fixed so far: {fixed}, still Other: {still_other}")
            print(f"Top venues so far: {venue_counter.most_common(10)}")

    print(f"Done. Fixed files: {fixed}, still Other pubs: {still_other}")
    print(f"Final venue distribution top 20: {venue_counter.most_common(20)}")

if __name__ == "__main__":
    main()
