# scripts/download_product_images.py
import os
import json
import io
import time
import urllib.request
import urllib.parse
from PIL import Image
from concurrent.futures import ThreadPoolExecutor, as_completed

os.makedirs('public/products', exist_ok=True)

with open('data/products_raw.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

print(f"Loaded {len(products)} products to process...")

def fetch_wikimedia_thumb(query):
    try:
        params = urllib.parse.urlencode({
            'action': 'query',
            'generator': 'search',
            'gsrsearch': f"{query}",
            'gsrnamespace': '6',
            'gsrlimit': 1,
            'prop': 'imageinfo',
            'iiprop': 'url',
            'iiurlwidth': 640,
            'format': 'json'
        })
        url = f"https://commons.wikimedia.org/w/api.php?{params}"
        req = urllib.request.Request(url, headers={'User-Agent': 'KutumBariApp/1.0 (contact@kutumbari.com)'})
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode())
            pages = data.get('query', {}).get('pages', {})
            if pages:
                first_page = list(pages.values())[0]
                thumb = first_page['imageinfo'][0].get('thumburl')
                return thumb
    except Exception as e:
        pass
    return None

def crop_and_save(img, out_path):
    img = img.convert('RGB')
    target_w, target_h = 600, 450
    # Center crop to 4:3
    w, h = img.size
    target_ratio = target_w / target_h
    current_ratio = w / h
    
    if current_ratio > target_ratio:
        # Image is wider than 4:3, crop sides
        new_w = int(h * target_ratio)
        offset = (w - new_w) // 2
        img = img.crop((offset, 0, offset + new_w, h))
    else:
        # Image is taller than 4:3, crop top/bottom
        new_h = int(w / target_ratio)
        offset = (h - new_h) // 2
        img = img.crop((0, offset, w, offset + new_h))
        
    img = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
    img.save(out_path, format='WEBP', quality=82)

def process_product(p):
    prod_id = p['id']
    out_file = f"public/products/{prod_id}.webp"
    
    if os.path.exists(out_file) and os.path.getsize(out_file) > 1000:
        return prod_id, "EXISTS", os.path.getsize(out_file)
        
    query = p.get('searchQuery', p['nameEn'])
    thumb_url = fetch_wikimedia_thumb(query)
    
    success = False
    if thumb_url:
        try:
            req = urllib.request.Request(thumb_url, headers={'User-Agent': 'KutumBariApp/1.0 (contact@kutumbari.com)'})
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = resp.read()
                img = Image.open(io.BytesIO(data))
                crop_and_save(img, out_file)
                success = True
                return prod_id, "WIKIMEDIA", os.path.getsize(out_file)
        except Exception as e:
            pass
            
    # Fallback to category local image
    fallback_path = p.get('fallbackImage', 'public/images/hero-dish.jpg')
    if os.path.exists(fallback_path):
        try:
            img = Image.open(fallback_path)
            crop_and_save(img, out_file)
            return prod_id, "FALLBACK", os.path.getsize(out_file)
        except Exception as e:
            return prod_id, f"FALLBACK_FAIL: {e}", 0
            
    return prod_id, "FAILED", 0

print("Starting concurrent image fetch and optimization...")
results = {"WIKIMEDIA": 0, "FALLBACK": 0, "EXISTS": 0, "FAILED": 0}

with ThreadPoolExecutor(max_workers=8) as executor:
    future_to_prod = {executor.submit(process_product, p): p for p in products}
    for future in as_completed(future_to_prod):
        p = future_to_prod[future]
        try:
            prod_id, status, size = future.result()
            if status in results:
                results[status] += 1
            else:
                results["FAILED"] += 1
            print(f"[{status}] {prod_id}: {size} bytes ({p['nameEn']})")
        except Exception as exc:
            print(f"ERR {p['id']}: {exc}")
            results["FAILED"] += 1

print("\nProcessing Complete!")
print(json.dumps(results, indent=2))
