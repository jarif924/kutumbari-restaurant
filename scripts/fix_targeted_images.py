import os
import json
import io
import time
import re
import urllib.request
import urllib.parse
from PIL import Image, ImageStat

TARGET_FIXES = {
    'appetizer-008': {
        'name': 'Fish Fry',
        'queries': ['crispy fish fry dish', 'fried fish fillet tartar', 'bhetki fish fry plate']
    },
    'chicken-028': {
        'name': 'Chicken Pop Corn',
        'queries': ['popcorn chicken bowl', 'crispy chicken bites basket', 'fried popcorn chicken']
    },
    'salad-sizzling-047': {
        'name': 'KutumBari Special Salad',
        'queries': ['chicken cashewnut salad', 'crispy chicken cashew salad plate', 'thai chicken cashew salad']
    },
    'salad-sizzling-051': {
        'name': 'Schezwan Salad',
        'queries': ['schezwan chicken salad', 'spicy shredded chicken salad', 'szechuan chicken cucumber salad']
    },
    'chowmein-chopsuey-078': {
        'name': 'Chicken Chop Suey',
        'queries': ['chicken chop suey dish', 'stir fry chicken chop suey', 'chinese chop suey plate']
    },
    'combo-098': {
        'name': 'Combo-1',
        'queries': ['fried rice chicken combo', 'egg fried rice fried chicken plate', 'chicken fried rice platter']
    },
    'biryani-khichuri-105': {
        'name': 'Hyderabadi Kacchi Biryani',
        'queries': ['mutton kacchi biryani handi', 'hyderabadi kacchi biryani plate', 'kacchi biryani saffron rice']
    },
    'naan-grill-112': {
        'name': 'Plain Naan',
        'queries': ['tandoori plain naan basket', 'plain naan bread freshly baked', 'tandoori naan hot']
    },
    'juice-tea-131': {
        'name': 'Seasonal Juice',
        'queries': ['fresh watermelon juice glass', 'fresh fruit juice glass table', 'chilled seasonal juice glass']
    }
}

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
}

def search_ddg_candidates(query, count=10):
    candidates = []
    try:
        params = urllib.parse.urlencode({'q': query})
        req = urllib.request.Request(f'https://duckduckgo.com/?{params}', headers=HEADERS)
        with urllib.request.urlopen(req, timeout=8) as resp:
            html = resp.read().decode('utf-8')
            m = re.search(r'vqd=([\d-]+)', html)
            if not m:
                m = re.search(r'vqd=\"([\d-]+)\"', html)
            if m:
                vqd = m.group(1)
                i_url = f'https://duckduckgo.com/i.js?l=us-en&o=json&q={urllib.parse.quote(query)}&vqd={vqd}&f=,,,&p=1'
                ireq = urllib.request.Request(i_url, headers=HEADERS)
                with urllib.request.urlopen(ireq, timeout=8) as iresp:
                    data = json.loads(iresp.read().decode('utf-8'))
                    for r in data.get('results', [])[:count]:
                        img_url = r.get('image')
                        if img_url and img_url.startswith('http'):
                            candidates.append(img_url)
    except Exception as e:
        print(f"Error searching DDG for {query}: {e}")
    return candidates

def download_and_crop(url, out_path):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=12) as resp:
        data = resp.read()
    
    if len(data) < 8000:
        return False
        
    im = Image.open(io.BytesIO(data))
    if im.mode not in ('RGB', 'RGBA'):
        im = im.convert('RGB')
    elif im.mode == 'RGBA':
        bg = Image.new('RGB', im.size, (255, 255, 255))
        bg.paste(im, mask=im.split()[3])
        im = bg
        
    w, h = im.size
    if w < 220 or h < 200:
        return False
        
    stat = ImageStat.Stat(im)
    mean_b = sum(stat.mean) / 3.0
    std_b = sum(stat.stddev) / 3.0
    if mean_b < 40 or mean_b > 240 or std_b < 18:
        return False
        
    # Center-crop to 4:3
    target_aspect = 4.0 / 3.0
    current_aspect = w / h
    
    if current_aspect > target_aspect:
        new_w = int(h * target_aspect)
        left = (w - new_w) // 2
        im = im.crop((left, 0, left + new_w, h))
    else:
        new_h = int(w / target_aspect)
        top = (h - new_h) // 2
        im = im.crop((0, top, w, top + new_h))
        
    im = im.resize((600, 450), Image.Resampling.LANCZOS)
    im.save(out_path, 'WEBP', quality=88)
    return True

def fix_all():
    print("Fixing the 9 targeted dishes with pristine high-quality food photography...")
    for item_id, info in TARGET_FIXES.items():
        out_file = f"public/products/{item_id}.webp"
        success = False
        print(f"\nProcessing {item_id}: {info['name']}")
        
        for q in info['queries']:
            urls = search_ddg_candidates(q, count=10)
            # Skip candidate 0 if we want to avoid repeating prior image, try candidate 1 or 2
            for u in urls[1:]:
                try:
                    if download_and_crop(u, out_file):
                        print(f"  ✓ Succeeded with: {u}")
                        success = True
                        break
                except Exception as e:
                    continue
            if success:
                break
            time.sleep(0.5)
            
        if not success:
            print(f"  ⚠️ Could not find candidate for {item_id}")

if __name__ == '__main__':
    fix_all()
