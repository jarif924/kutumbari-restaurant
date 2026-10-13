# scripts/generate_ts_data.py
import json

with open('data/products_raw.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# Extract categories
categories_map = {}
for p in products:
    ck = p['categoryKey']
    if ck not in categories_map:
        categories_map[ck] = {
            'key': ck,
            'nameBn': p['categoryNameBn'],
            'nameEn': p['categoryNameEn'],
            'icon': p['categoryIcon'],
            'itemCount': 0
        }
    categories_map[ck]['itemCount'] += 1

categories = list(categories_map.values())

ts_content = f"""// data/productsData.ts
// Generated full product catalog for KutumBari Restaurant (144 items across 18 categories)

export interface PortionOption {{
  name: string;
  price: number;
}}

export interface MenuItem {{
  id: string;
  categoryKey: string;
  categoryNameBn: string;
  categoryNameEn: string;
  categoryIcon: string;
  nameEn: string;
  nameBn: string;
  portions: PortionOption[];
  priceDisplay: string;
  minPrice: number;
  descriptionBn: string;
  descriptionEn: string;
  badge: string;
  image: string;
  searchQuery?: string;
  fallbackImage?: string;
}}

export interface MenuCategory {{
  key: string;
  nameBn: string;
  nameEn: string;
  icon: string;
  itemCount: number;
}}

export const MENU_CATEGORIES: MenuCategory[] = {json.dumps(categories, ensure_ascii=False, indent=2)};

export const ALL_MENU_PRODUCTS: MenuItem[] = {json.dumps(products, ensure_ascii=False, indent=2)};
"""

with open('data/productsData.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f"Generated data/productsData.ts with {len(products)} products and {len(categories)} categories.")
