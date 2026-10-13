# scripts/refine_product_images.py
import os
import json
import io
import urllib.request
import urllib.parse
from PIL import Image

def fetch_wikimedia_thumb(query):
    try:
        params = urllib.parse.urlencode({
            'action': 'query',
            'generator': 'search',
            'gsrsearch': query,
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
                return list(pages.values())[0]['imageinfo'][0].get('thumburl')
    except Exception as e:
        pass
    return None

def crop_and_save(img, out_path):
    img = img.convert('RGB')
    target_w, target_h = 600, 450
    w, h = img.size
    target_ratio = target_w / target_h
    current_ratio = w / h
    if current_ratio > target_ratio:
        new_w = int(h * target_ratio)
        offset = (w - new_w) // 2
        img = img.crop((offset, 0, offset + new_w, h))
    else:
        new_h = int(w / target_ratio)
        offset = (h - new_h) // 2
        img = img.crop((0, offset, w, offset + new_h))
    img = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
    img.save(out_path, format='WEBP', quality=85)

# Target refinements
specific_mappings = {
    # Naan items
    'naan-grill-111': ('wikimedia', 'Butter Naan flatbread'),
    'naan-grill-112': ('wikimedia', 'Plain Naan bread tandoori'),
    'naan-grill-113': ('wikimedia', 'Garlic Naan flatbread'),
    'naan-grill-114': ('wikimedia', 'Peshawari Naan sweet dry fruit'),
    
    # Biryani & Khichuri
    'biryani-khichuri-102': ('local', 'public/images/kacchi.jpg'),
    'biryani-khichuri-103': ('local', 'public/images/kacchi.jpg'),
    'biryani-khichuri-104': ('local', 'public/images/kacchi.jpg'),
    'biryani-khichuri-105': ('local', 'public/images/kacchi.jpg'),
    'biryani-khichuri-106': ('local', 'public/images/kacchi.jpg'),
    'biryani-khichuri-107': ('wikimedia', 'Kabsa Saudi Arabian dish'),
    'biryani-khichuri-108': ('local', 'public/images/khichuri.jpg'),
    'biryani-khichuri-109': ('local', 'public/images/khichuri.jpg'),
    'biryani-khichuri-110': ('local', 'public/images/khichuri.jpg'),
    
    # Bangla Food
    'bangla-food-140': ('local', 'public/images/kalabhuna.jpg'),
    'bangla-food-143': ('local', 'public/images/ilish.jpg'),
    'bangla-food-137': ('wikimedia', 'Aloo bhorta Bengali mashed potato'),
    'bangla-food-138': ('local', 'public/images/bangla-cat.jpg'),
    'bangla-food-139': ('local', 'public/images/kalabhuna.jpg'),
    'bangla-food-141': ('wikimedia', 'Mutton curry Bengali style Kosha Mangso'),
    'bangla-food-142': ('wikimedia', 'Chicken kassa Bengali style chicken curry'),
    'bangla-food-144': ('wikimedia', 'Dal Tadka yellow lentil soup bowl'),
    
    # Dessert
    'dessert-093': ('wikimedia', 'Falooda rose ice cream'),
    'dessert-094': ('wikimedia', 'Royal Falooda mixed dry fruits'),
    'dessert-096': ('wikimedia', 'Kheer Phirni rice pudding bowl'),
    'dessert-097': ('wikimedia', 'Zarda sweet rice festive yellow'),
    
    # Chowmein & Pizza
    'chowmein-chopsuey-073': ('local', 'public/images/chowmein.jpg'),
    'chowmein-chopsuey-074': ('local', 'public/images/chowmein.jpg'),
    'chowmein-chopsuey-076': ('local', 'public/images/chowmein.jpg'),
    'pizza-079': ('local', 'public/images/pizza.jpg'),
    'pizza-082': ('local', 'public/images/pizza.jpg'),
    
    # Fast food
    'fast-food-058': ('wikimedia', 'Chicken Shawarma wrap sandwich'),
    'fast-food-060': ('wikimedia', 'Shawarma pita roll roasted chicken'),
    'fast-food-062': ('wikimedia', 'Tortilla chips cheese nachos jalapeno'),
    'fast-food-063': ('local', 'public/images/loadedfries.jpg'),
    'fast-food-071': ('local', 'public/images/burger.jpg'),
    
    # Momos & Ramen
    'momo-ramen-088': ('wikimedia', 'Spicy ramen noodle bowl broth egg'),
    'momo-ramen-089': ('wikimedia', 'Steamed momos dumplings plate chutney'),
    'momo-ramen-091': ('wikimedia', 'Pan fried dumplings potstickers chili'),
}

for prod_id, (source_type, source_val) in specific_mappings.items():
    out_file = f"public/products/{prod_id}.webp"
    saved = False
    if source_type == 'local' and os.path.exists(source_val):
        try:
            im = Image.open(source_val)
            crop_and_save(im, out_file)
            print(f"[REFINED LOCAL] {prod_id} from {source_val}")
            saved = True
        except Exception as e:
            print(f"Error local {prod_id}: {e}")
    elif source_type == 'wikimedia':
        thumb = fetch_wikimedia_thumb(source_val)
        if thumb:
            try:
                req = urllib.request.Request(thumb, headers={'User-Agent': 'KutumBariApp/1.0 (contact@kutumbari.com)'})
                with urllib.request.urlopen(req, timeout=10) as resp:
                    im = Image.open(io.BytesIO(resp.read()))
                    crop_and_save(im, out_file)
                    print(f"[REFINED WIKIMEDIA] {prod_id} for '{source_val}'")
                    saved = True
            except Exception as e:
                print(f"Error thumb download {prod_id}: {e}")
                
    if not saved:
        print(f"[KEEP CURRENT] {prod_id}")

print("Refinement completed!")
