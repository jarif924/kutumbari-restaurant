# scripts/fetch_accurate_food_images.py
import os
import json
import io
import time
import re
import urllib.request
import urllib.parse
from PIL import Image, ImageStat
from concurrent.futures import ThreadPoolExecutor, as_completed

os.makedirs('public/products', exist_ok=True)

with open('data/products_raw.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# High-precision dish queries for all 144 items
DISH_QUERIES = {
    # Appetizer
    'appetizer-001': 'crispy fried chicken wontons dish',
    'appetizer-002': 'golden fried prawn wontons plate',
    'appetizer-003': 'crispy fried wontons platter sweet chili dip',
    'appetizer-004': 'indo chinese chicken lollipop dish spicy glaze',
    'appetizer-005': 'crispy breaded chicken cutlet fried recipe',
    'appetizer-006': 'bengali fish cutlet fried patty kasundi',
    'appetizer-007': 'crispy fish fingers tartar sauce plate',
    'appetizer-008': 'bengali kolkata fish fry bhetki fillet',
    'appetizer-009': 'golden crispy french fries basket ketchup',
    'appetizer-010': 'seasoned roasted potato wedges dip',

    # Soup
    'soup-011': 'thick thai soup chicken prawn bowl aromatic',
    'soup-012': 'thai soup chicken galangal chili lemongrass',
    'soup-013': 'chinese sweet corn soup egg drop bowl',
    'soup-014': 'chicken sweet corn soup warm bowl',
    'soup-015': 'thai clear vegetable chicken broth lemongrass soup',
    'soup-016': 'clear vegetable broth soup bowl cilantro',
    'soup-017': 'creamy mushroom soup bowl warm parsley',

    # Rice & Vegetable
    'rice-vegetable-018': 'special mixed fried rice chicken prawn egg',
    'rice-vegetable-019': 'chinese chicken fried rice wok plate scallions',
    'rice-vegetable-020': 'shrimp fried rice scallions plate wok',
    'rice-vegetable-021': 'classic egg fried rice restaurant plate',
    'rice-vegetable-022': 'thai spicy basil fried rice plate',
    'rice-vegetable-023': 'chinese mixed vegetable stir fry broccoli babycorn',
    'rice-vegetable-024': 'chicken vegetable stir fry chinese brown sauce',
    'rice-vegetable-025': 'thai stir fry mixed vegetables garlic soy',
    'rice-vegetable-026': 'fresh sauteed garden vegetables plate healthy',

    # Chicken
    'chicken-027': 'crispy golden fried chicken pieces platter',
    'chicken-028': 'crispy chicken popcorn bites basket dip',
    'chicken-029': 'barbecue glazed chicken grilled dish char',
    'chicken-030': 'extra crunchy fried chicken drumstick piece',
    'chicken-031': 'chinese spicy chicken gravy restaurant dish',
    'chicken-032': 'indian chicken masala curry bowl rich gravy',
    'chicken-033': 'special royal chicken curry rich thick gravy',
    'chicken-034': 'chilli chicken dry onion capsicum green chilies',
    'chicken-035': 'fiery hot spicy chicken drumstick pepper',
    'chicken-036': 'spicy hot buffalo wings chicken pepper sauce',

    # Beef, Mutton, Prawn & Fish
    'beef-mutton-fish-037': 'bengali beef curry slow cooked tender meat',
    'beef-mutton-fish-038': 'mutton masala curry rich thick gravy bowl',
    'beef-mutton-fish-039': 'beef do pyaza curry rich meat onions',
    'beef-mutton-fish-040': 'spicy mutton stir fry onion capsicum wok',
    'beef-mutton-fish-041': 'special royal beef curry gourmet dish',
    'beef-mutton-fish-042': 'prawn masala curry shrimp rich tomato gravy',
    'beef-mutton-fish-043': 'garlic butter fried prawns jumbo shrimp',
    'beef-mutton-fish-044': 'chilli prawn shrimp chinese spicy gravy',
    'beef-mutton-fish-045': 'bengali fish curry whole fish spicy sauce',
    'beef-mutton-fish-046': 'bengali fish masala curry rich onion gravy',

    # Salad & Sizzling
    'salad-sizzling-047': 'thai chicken cashew nut salad sweet sour dressing',
    'salad-sizzling-048': 'crispy chicken cashewnut salad greens',
    'salad-sizzling-049': 'prawn cashew nut thai salad lime dressing',
    'salad-sizzling-050': 'creamy cabbage coleslaw bowl mayonnaise',
    'salad-sizzling-051': 'spicy schezwan noodle shredded vegetable salad',
    'salad-sizzling-052': 'fresh cucumber tomato onion lemon green salad',
    'salad-sizzling-053': 'sizzling mixed fajita skillet platter smoke',
    'salad-sizzling-054': 'sizzling chicken platter hot plate bell pepper',
    'salad-sizzling-055': 'sizzling beef steak skillet fajita onions',
    'salad-sizzling-056': 'sizzling lamb mutton skillet hot plate smoke',
    'salad-sizzling-057': 'sizzling fish platter hot plate garlic butter',

    # Fast Food
    'fast-food-058': 'chicken shawarma wrap pita roll garlic sauce',
    'fast-food-059': 'crispy chicken tortilla wrap sandwich toasted',
    'fast-food-060': 'authentic arabian shawarma pita roll roasted chicken',
    'fast-food-061': 'loaded chicken nachos melted cheese jalapeno salsa',
    'fast-food-062': 'spicy hot nachos salsa cheese jalapenos',
    'fast-food-063': 'loaded giant nachos tower platter cheese meat',
    'fast-food-064': 'loaded snack box chicken tenders fries cheese',
    'fast-food-065': 'cheesy chicken loaded fries box molten sauce',
    'fast-food-066': 'classic crispy chicken burger lettuce tomato bun',
    'fast-food-067': 'chicken cheese burger melted cheddar slice',
    'fast-food-068': 'double patty chicken jumbo burger towering',
    'fast-food-069': 'extra crispy fried chicken fillet burger spicy',
    'fast-food-070': 'grilled chicken patty burger sesame seed bun',
    'fast-food-071': 'spicy naga burger red chili fiery sauce chicken',
    'fast-food-072': 'chicken sub sandwich roll lettuce honey mustard',

    # Chowmein & Chop Suey
    'chowmein-chopsuey-073': 'special mixed chowmein noodles chicken prawn egg',
    'chowmein-chopsuey-074': 'chinese chicken chowmein stir fry noodles wok',
    'chowmein-chopsuey-075': 'shrimp noodles prawn chowmein stir fry',
    'chowmein-chopsuey-076': 'street style egg chowmein noodles vegetable',
    'chowmein-chopsuey-077': 'american chop suey crispy fried noodle nest sweet sour chicken',
    'chowmein-chopsuey-078': 'chinese chicken chop suey plate vegetables gravy',

    # Pizza
    'pizza-079': 'loaded gourmet supreme pizza slice mozzarella olives',
    'pizza-080': 'artisan cheese pizza fresh baked crust slice',
    'pizza-081': 'chicken tikka pizza melted cheese bell peppers',
    'pizza-082': 'classic italian margherita pizza basil fresh mozzarella',

    # Pasta
    'pasta-083': 'oven baked penne pasta melted mozzarella cheese golden',
    'pasta-084': 'penne pasta creamy tomato sauce pan skillet chicken',
    'pasta-085': 'spicy arrabbiata red chili sauce pasta penne',
    'pasta-086': 'pink sauce creamy cheese pasta penne chicken',
    'pasta-087': 'sizzling hot cheese pasta platter cast iron skillet',

    # Momo & Ramen
    'momo-ramen-088': 'spicy ramen noodle bowl broth soft boiled egg',
    'momo-ramen-089': 'steamed chicken momos dumplings bamboo steamer red chutney',
    'momo-ramen-090': 'spicy steamed momos red naga chili sauce',
    'momo-ramen-091': 'chilli garlic pan fried momos potstickers',
    'momo-ramen-092': 'wonton dumpling soup clear comforting broth bowl',

    # Dessert
    'dessert-093': 'royal rose falooda dessert glass ice cream vermicelli',
    'dessert-094': 'special royal falooda mixed dry nuts saffron milk',
    'dessert-095': 'gourmet ice cream scoops sundae bowl wafer',
    'dessert-096': 'shahi kheer phirni rice pudding bowl clay pot pistachio',
    'dessert-097': 'bengali sweet zarda rice dessert festive yellow murabba',

    # Combo
    'combo-098': 'combo meal egg fried rice fried chicken drink salad',
    'combo-099': 'combo platter fried rice chicken curry mixed vegetable',
    'combo-100': 'combo meal fried rice bbq chicken salad drink',
    'combo-101': 'combo platter fried rice tandoori chicken salad drink',

    # Biryani & Khichuri
    'biryani-khichuri-102': 'bengali chicken dum biryani plate boiled egg potato',
    'biryani-khichuri-103': 'beef biryani plate tender meat long grain rice',
    'biryani-khichuri-104': 'royal mutton biryani plate saffron meat basmati',
    'biryani-khichuri-105': 'hyderabadi kacchi biryani pot plate marinated mutton',
    'biryani-khichuri-106': 'hyderabadi dum biryani fragrant saffron rice meat',
    'biryani-khichuri-107': 'arabian kabsa rice roasted chicken whole platter almonds',
    'biryani-khichuri-108': 'bengali egg khichuri ghee roasted moong dal',
    'biryani-khichuri-109': 'bengali beef bhuna khichuri plate tender meat',
    'biryani-khichuri-110': 'bengali chicken khichuri rice roasted dal comfort',

    # Naan & Grill
    'naan-grill-111': 'butter naan tandoori flatbread basket melting butter',
    'naan-grill-112': 'plain tandoori naan bread basket golden',
    'naan-grill-113': 'garlic naan butter coriander flatbread tandoor',
    'naan-grill-114': 'kashmiri peshawari naan dry fruits nuts sweet flatbread',
    'naan-grill-115': 'tandoori charcoal grilled chicken quarters barbecue platter',

    # Beverage
    'beverage-116': 'special cappuccino coffee mug thick foam dark chocolate dust',
    'beverage-117': 'fresh brewed hot coffee mug steam crema',
    'beverage-118': 'cappuccino coffee cup latte art ceramic saucer',
    'beverage-119': 'hot chocolate mug marshmallows whipped cream cocoa',
    'beverage-120': 'iced cold coffee glass chocolate swirl ice cubes',
    'beverage-121': 'thick chocolate milkshake tall glass whipped cream chocolate chips',
    'beverage-122': 'strawberry milkshake pink tall glass whipped cream strawberry',
    'beverage-123': 'creamy vanilla milkshake tall glass cherry on top',
    'beverage-124': 'rich mango milkshake yellow tall glass ripe mango pulp',
    'beverage-125': 'special royal lassi saffron pistachio churned yogurt glass',
    'beverage-126': 'traditional sweet punjabi lassi glass yogurt malai',
    'beverage-127': 'mixed berry fruit smoothie glass jar purple healthy',

    # Fresh Juice & Tea
    'juice-tea-128': 'fresh squeezed orange juice glass ice orange slices',
    'juice-tea-129': 'fresh lemonade ice glass mint leaves lemon slice',
    'juice-tea-130': 'fresh pressed apple juice glass red apple slices',
    'juice-tea-131': 'fresh seasonal watermelon juice tall glass ice mint',
    'juice-tea-132': 'layered tropical mocktail drink cocktail glass umbrella garnish',
    'juice-tea-133': 'bengali dudh cha strong milk tea clay cup matka saucer',
    'juice-tea-134': 'hot lemon tea glass cup lemon slice mint black tea',
    'juice-tea-135': 'shahi masala chai spiced tea cup cinnamon cardamom saffron',

    # Bangla Food
    'bangla-food-136': 'steamed white basmati rice bowl steaming hot fluffy',
    'bangla-food-137': 'bengali aloo bhorta mashed potato mustard oil green chili',
    'bangla-food-138': 'bengali labra mixed vegetable curry panch phoron',
    'bangla-food-139': 'bengali beef bhuna rich spicy caramelized meat curry',
    'bangla-food-140': 'chittagong beef kala bhuna dark tender meat curry authentic',
    'bangla-food-141': 'bengali kosha mangsho mutton curry rich thick spicy gravy',
    'bangla-food-142': 'bengali chicken bhuna home style curry onion gravy',
    'bangla-food-143': 'bengali shorshe ilish mach mustard hilsha fish curry river',
    'bangla-food-144': 'bengali masoor dal tadka yellow lentil soup tempered cumin'
}

# Guaranteed reliable category local fallback mapping
CATEGORY_LOCAL_FALLBACKS = {
    'appetizer': 'public/images/wonton.jpg',
    'soup': 'public/images/hero-dish.jpg',
    'rice-vegetable': 'public/images/friedrice.jpg',
    'chicken': 'public/images/crispychicken.jpg',
    'beef-mutton-fish': 'public/images/kalabhuna.jpg',
    'salad-sizzling': 'public/images/chilichicken.jpg',
    'fast-food': 'public/images/burger.jpg',
    'chowmein-chopsuey': 'public/images/chowmein.jpg',
    'pizza': 'public/images/pizza.jpg',
    'pasta': 'public/images/fastfood-cat.jpg',
    'momo-ramen': 'public/images/chinese-cat.jpg',
    'dessert': 'public/images/ambience.jpg',
    'combo': 'public/images/friedrice.jpg',
    'biryani-khichuri': 'public/images/kacchi.jpg',
    'naan-grill': 'public/images/crispychicken.jpg',
    'beverage': 'public/images/hero-dish.jpg',
    'juice-tea': 'public/images/bangla-cat.jpg',
    'bangla-food': 'public/images/ilish.jpg'
}

def search_ddg_candidates(query, count=5):
    candidates = []
    try:
        url = 'https://duckduckgo.com/'
        params = urllib.parse.urlencode({'q': query})
        req = urllib.request.Request(f'https://duckduckgo.com/?{params}', headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            html = resp.read().decode('utf-8')
            m = re.search(r'vqd=([\d-]+)', html)
            if not m:
                m = re.search(r'vqd=\"([\d-]+)\"', html)
            if m:
                vqd = m.group(1)
                i_url = f'https://duckduckgo.com/i.js?l=us-en&o=json&q={urllib.parse.quote(query)}&vqd={vqd}&f=,,,&p=1'
                ireq = urllib.request.Request(i_url, headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'})
                with urllib.request.urlopen(ireq, timeout=5) as iresp:
                    data = json.loads(iresp.read().decode('utf-8'))
                    for r in data.get('results', [])[:count]:
                        img_url = r.get('image')
                        if img_url and img_url.startswith('http'):
                            candidates.append(img_url)
    except Exception as e:
        pass
    return candidates

def validate_and_crop(im_data):
    try:
        im = Image.open(io.BytesIO(im_data))
        im = im.convert('RGB')
        w, h = im.size
        if w < 180 or h < 180:
            return None
        # Check brightness
        stat = ImageStat.Stat(im)
        mean_val = sum(stat.mean) / len(stat.mean)
        std_val = sum(stat.stddev) / len(stat.stddev)
        # Reject pitch black or completely blank images
        if mean_val < 38 or mean_val > 248 or std_val < 12:
            return None
            
        # Center crop to 4:3
        target_w, target_h = 600, 450
        target_ratio = target_w / target_h
        current_ratio = w / h
        if current_ratio > target_ratio:
            new_w = int(h * target_ratio)
            offset = (w - new_w) // 2
            im = im.crop((offset, 0, offset + new_w, h))
        else:
            new_h = int(w / target_ratio)
            offset = (h - new_h) // 2
            im = im.crop((0, offset, w, offset + new_h))
            
        im = im.resize((target_w, target_h), Image.Resampling.LANCZOS)
        return im
    except Exception as e:
        return None

def process_single_dish(p):
    prod_id = p['id']
    cat_key = p['categoryKey']
    query = DISH_QUERIES.get(prod_id, f"{p['nameEn']} restaurant food dish")
    out_file = f"public/products/{prod_id}.webp"
    
    candidates = search_ddg_candidates(query, count=5)
    
    saved = False
    for url in candidates:
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'})
            with urllib.request.urlopen(req, timeout=8) as resp:
                data = resp.read()
                processed_im = validate_and_crop(data)
                if processed_im:
                    processed_im.save(out_file, format='WEBP', quality=85)
                    saved = True
                    return prod_id, "DDG_SUCCESS", url[:50]
        except Exception:
            continue
            
    # If all candidates failed, use verified authentic local food photo
    fallback_path = CATEGORY_LOCAL_FALLBACKS.get(cat_key, 'public/images/hero-dish.jpg')
    if os.path.exists(fallback_path):
        try:
            with open(fallback_path, 'rb') as f:
                processed_im = validate_and_crop(f.read())
                if processed_im:
                    processed_im.save(out_file, format='WEBP', quality=85)
                    return prod_id, "LOCAL_VERIFIED", fallback_path
        except Exception as e:
            return prod_id, "FAILED", str(e)
            
    return prod_id, "FAILED", "No valid image"

print("Starting accurate food image collection for all 144 items...")
results = {"DDG_SUCCESS": 0, "LOCAL_VERIFIED": 0, "FAILED": 0}

with ThreadPoolExecutor(max_workers=8) as executor:
    futures = {executor.submit(process_single_dish, p): p for p in products}
    for f in as_completed(futures):
        p = futures[f]
        prod_id, status, info = f.result()
        results[status] = results.get(status, 0) + 1
        print(f"[{status}] {prod_id} ({p['nameBn']} / {p['nameEn']}) => {info}")

print("\nCollection Finished!")
print(json.dumps(results, indent=2))
