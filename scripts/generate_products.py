# scripts/generate_products.py
import re
import os
import json
import urllib.request
import urllib.parse
from PIL import Image
import io

os.makedirs('public/products', exist_ok=True)
os.makedirs('data', exist_ok=True)

with open('menu/menu.md', 'r', encoding='utf-8') as f:
    text = f.read()

categories_raw = re.split(r'\n(?=## )', text)

CATEGORY_MAP = {
    'Appetizer': {
        'key': 'appetizer',
        'nameBn': 'অ্যাপেটাইজার',
        'nameEn': 'Appetizers',
        'icon': '🥟',
        'fallback': 'public/images/wonton.jpg'
    },
    'Soup': {
        'key': 'soup',
        'nameBn': 'স্যুপ',
        'nameEn': 'Soups',
        'icon': '🍲',
        'fallback': 'public/images/hero-dish.jpg'
    },
    'Rice & Vegetable': {
        'key': 'rice-vegetable',
        'nameBn': 'রাইস ও ভেজিটেবল',
        'nameEn': 'Rice & Vegetables',
        'icon': '🍚',
        'fallback': 'public/images/friedrice.jpg'
    },
    'Chicken': {
        'key': 'chicken',
        'nameBn': 'চিকেন আইটেম',
        'nameEn': 'Chicken Specials',
        'icon': '🍗',
        'fallback': 'public/images/crispychicken.jpg'
    },
    'Beef, Mutton, Prawn & Fish': {
        'key': 'beef-mutton-fish',
        'nameBn': 'বিফ, মাটন, প্রন ও ফিশ',
        'nameEn': 'Meat & Seafood',
        'icon': '🥩',
        'fallback': 'public/images/kalabhuna.jpg'
    },
    'Salad & Sizzling': {
        'key': 'salad-sizzling',
        'nameBn': 'সালাদ ও সিজলিং',
        'nameEn': 'Salads & Sizzlers',
        'icon': '🥗',
        'fallback': 'public/images/chilichicken.jpg'
    },
    'Fast Food (Shawarma, Nachos, Mix Box, Burger)': {
        'key': 'fast-food',
        'nameBn': 'ফাস্ট ফুড (বার্গার ও শর্মা)',
        'nameEn': 'Fast Food',
        'icon': '🍔',
        'fallback': 'public/images/burger.jpg'
    },
    'Chowmein & Chop Suey': {
        'key': 'chowmein-chopsuey',
        'nameBn': 'চাউমিন ও চপ সুয়ে',
        'nameEn': 'Chowmein & Chop Suey',
        'icon': '🍜',
        'fallback': 'public/images/chowmein.jpg'
    },
    'Pizza': {
        'key': 'pizza',
        'nameBn': 'পিজ্জা',
        'nameEn': 'Artisan Pizza',
        'icon': '🍕',
        'fallback': 'public/images/pizza.jpg'
    },
    'Pasta': {
        'key': 'pasta',
        'nameBn': 'পাস্তা',
        'nameEn': 'Gourmet Pasta',
        'icon': '🍝',
        'fallback': 'public/images/fastfood-cat.jpg'
    },
    'Momo & Ramen': {
        'key': 'momo-ramen',
        'nameBn': 'মোমো ও রামেন',
        'nameEn': 'Momo & Ramen',
        'icon': '🥟',
        'fallback': 'public/images/chinese-cat.jpg'
    },
    'Dessert': {
        'key': 'dessert',
        'nameBn': 'ডেজার্ট ও মিষ্টিমুখ',
        'nameEn': 'Desserts',
        'icon': '🍧',
        'fallback': 'public/images/ambience.jpg'
    },
    'Combo': {
        'key': 'combo',
        'nameBn': 'স্পেশাল কম্বো মিল',
        'nameEn': 'Combo Platters',
        'icon': '🍱',
        'fallback': 'public/images/friedrice.jpg'
    },
    'Biryani & Khichuri': {
        'key': 'biryani-khichuri',
        'nameBn': 'বিরিয়ানি ও খিচুড়ি',
        'nameEn': 'Biryani & Khichuri',
        'icon': '🍛',
        'fallback': 'public/images/kacchi.jpg'
    },
    'Naan & Grill': {
        'key': 'naan-grill',
        'nameBn': 'নান ও গ্রিল',
        'nameEn': 'Naan & Grill',
        'icon': '🫓',
        'fallback': 'public/images/crispychicken.jpg'
    },
    'Hot & Cold Beverage': {
        'key': 'beverage',
        'nameBn': 'হট ও কোল্ড বেভারেজ',
        'nameEn': 'Hot & Cold Drinks',
        'icon': '☕',
        'fallback': 'public/images/hero-dish.jpg'
    },
    'Fresh Juice & Tea': {
        'key': 'juice-tea',
        'nameBn': 'ফ্রেশ জুস ও চা',
        'nameEn': 'Fresh Juice & Tea',
        'icon': '🧃',
        'fallback': 'public/images/bangla-cat.jpg'
    },
    'বাংলা খাবার (Bangla Food)': {
        'key': 'bangla-food',
        'nameBn': 'ঐতিহ্যবাহী বাংলা খাবার',
        'nameEn': 'Traditional Bangla Food',
        'icon': '🐟',
        'fallback': 'public/images/ilish.jpg'
    }
}

# Bengali translation & details lookup
DETAILS_LOOKUP = {
    # Appetizer
    'Chicken Wonton': ('চিকেন ওয়ানটন', 'মুচমুচে সোনালী ফ্রাইড ওয়ানটন, ভিতরে জুসি স্পাইসি চিকেন কিমা পুর ও ডিপ সস।', 'Crispy golden fried wontons filled with seasoned chicken mince, served with sweet chili dip.', 'জনপ্রিয়', 'crispy chicken wonton fried'),
    'Prawn Wonton': ('প্রন ওয়ানটন', 'তাজা গলদা চিংড়ির সুস্বাদু পুরে ভরা ক্রিসপি ওয়ানটন।', 'Crispy wontons stuffed with savory spiced fresh prawn filling.', 'শেফ স্পেশাল', 'prawn wonton fried golden'),
    'KutumBari Special Wonton': ('কুটুমবাড়ি স্পেশাল ওয়ানটন', 'আমাদের সিক্রেট স্পেশাল রেসিপির স্পেশাল বিগ সাইজ ওয়ানটন (৮ পিস)।', 'Signature KutumBari chef-special deep-fried crispy wontons (8 pcs).', 'সিগনেচার', 'crispy wonton dish platter'),
    'Chicken Lollipop': ('চিকেন ললিপপ', 'মচমচে ফ্রাইড চিকেন উইং ললিপপ, হট অ্যান্ড স্পাইসি গার্লিক সস কোটেড।', 'Succulent chicken drumettes shaped into lollipops with spicy oriental glaze.', 'বেস্টসেলার', 'chicken lollipop fried indo chinese'),
    'Chicken Cutlet': ('চিকেন কাটলেট', 'মশলাদার প্রিমিয়াম বোনলেস চিকেন ও ব্রেডক্রাম্ব ক্রাস্টেড ডিপ ফ্রাইড কাটলেট।', 'Golden breaded chicken cutlet seasoned with aromatic herbs and spices.', 'জনপ্রিয়', 'chicken cutlet breadcrumb fried'),
    'Fish Cutlet': ('ফিশ কাটলেট', 'তাজা নদীর মাছের নরম পেটি ও সুস্বাদু মুচমুচে কোটিং।', 'Flavorful fish patty coated in breadcrumbs and deep fried to golden perfection.', 'তাজা মাছ', 'fish cutlet fried patty'),
    'Fish Finger': ('ফিশ ফিঙ্গার', 'তাজা নরম ভেটকি/কোরাল ফিলে ক্রিসপি স্ট্রিপস, টারটার সসের সাথে পরিবেশিত।', 'Tender fish fillets cut into fingers, coated in seasoned panko crumbs.', 'ক্রিসপি', 'crispy fish fingers tartar sauce'),
    'Fish Fry': ('ফিশ ফ্রাই', 'বাঙালি স্টাইলের খাঁটি ক্রিসপি ফিশ ফ্রাই, মাস্টার্ড কাসুন্দি ও সালাদ সহ।', 'Bengali style classic crispy fish fry served with mustard dip and onion salad.', 'ট্রেডিশনাল', 'bengali fish fry kolkata style'),
    'French Fry': ('ফ্রেঞ্চ ফ্রাই', 'মুচমুচে সোনালী গোল্ডেন পটেটো ফ্রাই, হালকা পেরি পেরি ও সল্ট সিজনিং।', 'Classic golden crisp french fries seasoned with salt and spices.', 'জনপ্রিয়', 'golden crispy french fries'),
    'Potato Wedges': ('পটেটো ওয়েজেস', 'মশলা মাখানো ক্রাঞ্চি স্কিন-অন পটেটো ওয়েজেস, মেয়ো ডিপ সহ।', 'Seasoned crispy herb potato wedges served with spicy mayo dip.', 'ক্রাঞ্চি', 'seasoned potato wedges roasted crispy'),

    # Soup
    'KutumBari Special Thai Soup': ('কুটুমবাড়ি স্পেশাল থাই স্যুপ', 'চিকেন, চিংড়ি, মাশরুম ও লেমনগ্রাস ইনফিউজড ঘন গাঢ় প্রিমিয়াম থাই স্যুপ (১:৩)।', 'Rich, thick aromatic Thai soup loaded with chicken, prawn, mushroom & lemongrass (1:3).', 'সিগনেচার', 'authentic thai soup chicken shrimp bowl'),
    'Chicken Thai Soup': ('চিকেন থাই স্যুপ', 'চিকেন চাঙ্কস, কাঁচামরিচ ও লেমনগ্রাসের অথেনটিক ব্যালেন্সড স্বাদের স্যুপ।', 'Authentic spicy and tangy Thai soup packed with tender chicken bits.', 'বেস্টসেলার', 'chicken thai soup hot bowl'),
    'Special Corn Soup': ('স্পেশাল কর্ন স্যুপ', 'মিষ্টি কর্ন কার্নেল ও ক্রিমি ঘন সুস্বাদু চিকেন-এগ ড্রপ স্যুপ (১:৩)।', 'Sweet corn egg drop soup enriched with signature secret stock (1:3).', 'জনপ্রিয়', 'sweet corn egg drop soup chinese'),
    'Chicken Corn Soup': ('চিকেন কর্ন স্যুপ', 'নরম চিকেন শ্রেডস ও কর্নের হালকা সুস্বাদু স্বাস্থ্যকর আরামদায়ক স্যুপ।', 'Heartwarming comfort soup with shredded chicken and sweet corn.', 'হেলদি চয়েস', 'chicken sweet corn soup bowl'),
    'Thai Clear Soup': ('থাই ক্লিয়ার স্যুপ', 'লেমনগ্রাস, থাই জিঞ্জার ও তাজা হার্বসের পরিষ্কার রিফ্রেশিং পুষ্টিকর স্যুপ (১:৩)।', 'Clear, light and aromatic broth infused with fresh galangal, lemongrass & herbs (1:3).', 'লাইট অ্যান্ড ফ্রেশ', 'thai clear soup lemongrass cilantro'),
    'Vegetable Clear Soup': ('ভেজিটেবল ক্লিয়ার স্যুপ', 'তাজা সিজনাল সবজি দিয়ে তৈরি হালকা ও পুষ্টিকর পরিষ্কার স্যুপ (১:৩)।', 'Nutritious clear soup with a vibrant medley of fresh farm vegetables (1:3).', '১০০% ভেজ', 'fresh vegetable clear soup bowl'),
    'Cream of Mushroom Soup': ('ক্রিম অব মাশরুম স্যুপ', 'বাটনে মাশরুম, তাজা ক্রিম ও গোলমরিচ ইনফিউজড ঘন কন্টিনেন্টাল স্যুপ (১:১)।', 'Velvety smooth and rich soup made with sautéed button mushrooms and fresh cream (1:1).', 'প্রিমিয়াম', 'cream of mushroom soup warm bowl'),

    # Rice & Vegetable
    'KutumBari Special Fried Rice': ('কুটুমবাড়ি স্পেশাল ফ্রাইড রাইস', 'চিকেন, গলদা চিংড়ি, ডিম ও সিজনাল সবজির রয়াল মিক্সড ফ্রাইড রাইস (১:৩)।', 'Grand combination of basmati rice wok-tossed with chicken, prawns, eggs & veggies (1:3).', 'সিগনেচার', 'special mixed fried rice chicken prawn'),
    'Chicken Fried Rice': ('চিকেন ফ্রাইড রাইস', 'মজাদার চিকেন চাঙ্কস, স্ক্র্যাম্বলড এগ ও সয়া সিজনিংয়ে ওক-টসড সুগন্ধি ফ্রাইড রাইস।', 'Wok-tossed fragrant rice with juicy chicken bites, egg ribbon and scallions.', 'বেস্টসেলার', 'chinese chicken fried rice wok'),
    'Prawn Fried Rice': ('প্রন ফ্রাইড রাইস', 'তাজা গলদা চিংড়ি ও সিজনিং মেশানো ওক-ফ্রাইড জুসি সুস্বাদু রাইস (১:৩)।', 'Aromatic stir-fried rice loaded with tender fresh prawns and garlic chives (1:3).', 'জনপ্রিয়', 'prawn fried rice shrimp bowl'),
    'Egg Fried Rice': ('এগ ফ্রাইড রাইস', 'ডিম ও পেঁয়াজ কলি দিয়ে সতেজ ড্রপ ফ্রাইড ক্লাসিক রাইস (১:৩)।', 'Classic Asian egg fried rice tossed on high flame with light soy and spring onions (1:3).', 'ক্লাসিক', 'classic egg fried rice chinese'),
    'Thai Fried Rice': ('থাই ফ্রাইড রাইস', 'থাই চিলি, বেসিল ও ওরিয়েন্টাল সসের ঝাল-মিষ্টি ফ্লেভারযুক্ত স্পাইসি ফ্রাইড রাইস (১:৩)।', 'Authentic Thai style spicy fried rice infused with chili, garlic and basil (1:3).', 'স্পাইসি', 'thai spicy basil fried rice'),
    'KutumBari Special Vegetable': ('কুটুমবাড়ি স্পেশাল ভেজিটেবল', 'ব্রোকলি, বেবিকর্ন, মাশরুম ও স্পেশাল চাইনিজ সসে কুকড রিচ সবজি (১:৩)।', 'Signature medley of premium crisp vegetables in savory oriental sauce (1:3).', 'শেফ চয়েস', 'chinese mixed vegetable stir fry plate'),
    'Chicken Vegetable': ('চিকেন ভেজিটেবল', 'নরম চিকেন স্লাইস ও রঙিন তাজা সবজির চাইনিজ গ্রেভি ডিশ (১:৩)।', 'Tender chicken slices stir-fried with colorful fresh vegetables in light gravy (1:3).', 'জনপ্রিয়', 'chicken vegetable stir fry chinese'),
    'Thai Vegetable': ('থাই ভেজিটেবল', 'থাই সস ও ভেষজ সুগন্ধে রান্না করা ক্রাঞ্চি সবজি ডিশ (১:৩)।', 'Crispy crunchy vegetables tossed in flavorful sweet and savory Thai glaze (1:3).', 'স্পাইসি', 'thai stir fry mixed vegetables'),
    'Fresh Vegetable': ('ফ্রেশ ভেজিটেবল', 'ঘরোয়া মিষ্টি স্বাদে হালকা স্টিমড ও সোতে করা টাটকা সবজি (১:৩)।', 'Healthy and lightly sautéed seasonal farm-fresh garden vegetables (1:3).', 'হেলদি', 'fresh green vegetable sauté plate'),

    # Chicken
    'Chicken Fry': ('চিকেন ফ্রাই', 'দেশি মশলায় ম্যারিনেট করা মুচমুচে সুস্বাদু ক্লাসিক ফ্রাইড চিকেন।', 'Crisp and juicy seasoned fried chicken made with special KutumBari marinade.', 'বেস্টসেলার', 'crispy golden fried chicken pieces'),
    'Chicken Pop Corn': ('চিকেন পপ কর্ন', 'ছোট ছোট বাইট-সাইজ মুচমুচে কুড়মুড়ে ক্রাঞ্চি চিকেন কিউবস (৮ পিস)।', 'Crunchy, bite-sized spiced chicken poppers coated in golden breadcrumbs (8 pcs).', 'কিডস ফেভারিট', 'crunchy chicken popcorn bite basket'),
    'BBQ Chicken': ('বারবিকিউ চিকেন', 'স্মোকি বারবিকিউ সসে গ্লেজ করা জুসি রোস্টেড চিকেন পিস (৬ পিস)।', 'Tender chicken pieces glazed with sweet and smoky BBQ sauce and char-grilled (6 pcs).', 'স্মোকি ফ্লেভার', 'barbecue chicken glaze grilled'),
    'Crispy Chicken': ('ক্রিসপি চিকেন', 'এক্সট্রা ক্রাঞ্চি ফ্লেকি কোটিং ও ভেতরটা রসালো নরম স্পাইসি চিকেন (১ পিস)।', 'Extra crunchy crispy deep fried chicken with juicy and tender meat inside (1 pc).', 'সুপার ক্রাঞ্চি', 'crispy fried chicken drumstick piece'),
    'Style Chicken': ('স্টাইল চিকেন', 'কুটুমবাড়ির ইউনিক স্টাইল সিক্রেট সস ও স্পাইসে রান্না করা চিকেন।', 'Unique fusion style chicken cooked in rich aromatic sauce blend.', 'স্পেশাল', 'chinese style chicken gravy dish'),
    'Chicken Masala': ('চিকেন মাসালা', 'ঘন পেঁয়াজ-টমেটো গ্রেভি ও গরম মশলায় ভুনা করা দেশি স্বাদের চিকেন।', 'Rich aromatic chicken curry simmered in flavorful onion-tomato masala.', 'ট্রেডিশনাল', 'indian chicken masala curry bowl'),
    'KutumBari Special Chicken': ('কুটুমবাড়ি স্পেশাল চিকেন', 'আমাদের হেড শেফের এক্সক্লুসিভ সিক্রেট রেসিপির প্রিমিয়াম চিকেন গ্রেভি।', 'Executive chef special chicken delicacy simmered in exotic thick gravy.', 'সিগনেচার', 'royal chicken curry special gravy'),
    'Chicken Chili Onion': ('চিকেন চিলি অনিয়ন', 'কাঁচামরিচ, পেঁয়াজের পাপড়ি ও সয়া সসে ওক-ফ্রাইড চাইনিজ চিকেন (১:৩)।', 'Crispy chicken pieces stir-fried with green chilies, onions and savory sauce (1:3).', 'স্পাইসি হট', 'chili chicken dry onion capsicum'),
    'Chicken Naga Drums': ('চিকেন নাগা ড্রামস', 'খাঁটি নাগা মরিচের তীব্র সুবাস ও ঝালে ম্যারিনেট করা ফায়ার ড্রামস্টিক (১ পিস)।', 'Fiery hot chicken drumstick infused with pungent Naga chili pepper glaze (1 pc).', 'ঝাল এক্সট্রিম 🌶️', 'spicy chicken drumstick fiery pepper'),
    'Chicken Naga Wings': ('চিকেন নাগা উইংস', 'নাগা চিলি সসে টস করা আগুনে ঝাল মুচমুচে চিকেন উইংস (৮ পিস)।', 'Crispy chicken wings glazed in lethal and addictive spicy Naga pepper sauce (8 pcs).', 'ঝাল এক্সট্রিম 🌶️', 'spicy hot chicken wings red pepper'),

    # Beef, Mutton, Prawn & Fish
    'Beef Curry': ('বিফ কারি', 'ঐতিহ্যবাহী মশলায় কষিয়ে রান্না করা নরম তুলতুলে সুস্বাদু গরুর মাংস (১:৩)।', 'Tender chunks of beef simmered slowly in traditional Bengali aromatic curry (1:3).', 'জনপ্রিয়', 'bengali beef curry slow cooked meat'),
    'Mutton Masala': ('মাটন মাসালা', 'ঘিয়ে ভাজা সুগন্ধি গরম মশলা ও ঘন গ্রেভিতে রান্না করা খাসির মাংস (১:৩)।', 'Succulent mutton pieces braised in rich, spicy and aromatic thick masala (1:3).', 'রয়াল ডিশ', 'mutton masala curry rich gravy bowl'),
    'Beef Dopiaza': ('বিফ দো পেঁয়াজা', 'প্রচুর পেঁয়াজের কিউব ও কড়া মশলায় ভুনা করা গরুর মাংসের দোপেঁয়াজা (১:৩)।', 'Classic Mughlai beef dish cooked with double the onions and rich spices (1:3).', 'ট্রেডিশনাল', 'beef do pyaza curry rich meat'),
    'Mutton Chili Onion': ('মাটন চিলি অনিয়ন', 'কাঁচামরিচ, ক্যাপসিকাম ও পেঁয়াজের সাথে ওক-টসড চাইনিজ স্টাইল মাটন (১:৩)।', 'Tender mutton strips wok-fried with crisp onions, capsicum & green chilies (1:3).', 'স্পাইসি', 'spicy mutton stir fry onion capsicum'),
    'KutumBari Special Beef': ('কুটুমবাড়ি স্পেশাল বিফ', 'আমাদের স্পেশাল রন্ধনশৈলীর সুস্বাদু ও ঘন গ্রেভির সিগনেচার বিফ (১:৩)।', 'House-special tender beef slow braised in our secret spice mixture (1:3).', 'সিগনেচার', 'special rich beef gravy gourmet meat'),
    'Prawn Masala': ('প্রন মাসালা', 'তাজা মিষ্টি গলদা চিংড়ি ও মশলাদার ঘন কড়াই গ্রেভির জুসি ডিশ (১:৩)।', 'Succulent river prawns cooked in spicy onion-tomato gravy with herbs (1:3).', 'সমুদ্রের স্বাদ', 'prawn masala curry shrimp rich'),
    'Prawn Butter Fry': ('প্রন বাটার ফ্রাই', 'খাঁটি মাখনে ভাজা সুস্বাদু গোল্ডেন ক্রিসপি বড় চিংড়ি (১:৩)।', 'Jumbo prawns pan-sautéed in rich golden butter, garlic and mild herbs (1:3).', 'বাটার ডিলাইট', 'garlic butter fried prawns shrimp'),
    'Prawn Chili Gravy': ('প্রন চিলি গ্রেভি', 'ঝাল চিলি সস ও সুস্বাদু গ্রেভিতে ওক-ফ্রাইড চাইনিজ স্টাইল প্রন (১:৩)।', 'Spicy wok-tossed prawns bathed in zesty sweet and tangy chili sauce (1:3).', 'স্পাইসি', 'chili prawn shrimp chinese sauce'),
    'KutumBari Special Fish': ('কুটুমবাড়ি স্পেশাল ফিশ', 'লোকাল নদীর তাজা সেরা মাছের সাথে শেফের সিক্রেট স্পেশাল রন্ধন (১:৩)।', 'Signature whole fish delicacy cooked to perfection with house special recipe (1:3).', 'সিগনেচার', 'whole fish curry special sauce'),
    'Fish Masala': ('ফিশ মাসালা', 'সরিষা ও গরম মশলার সুগন্ধে মাখামাখি তাজা সুস্বাদু মাছের ভুনা (১:৩)।', 'Fresh river fish steaks simmered in traditional fragrant onion tomato masala (1:3).', 'ট্রেডিশনাল', 'bengali fish masala curry'),

    # Salad & Sizzling
    'KutumBari Special Cashewnut Salad': ('কুটুমবাড়ি স্পেশাল কাজুবাদাম সালাদ', 'চিকেন, চিংড়ি, ক্রাঞ্চি কাজুবাদাম ও স্পেশাল ড্রেসিংয়ের রয়াল সালাদ (১:৩)।', 'Grand Thai style salad loaded with roasted cashews, chicken, prawns and tangy dressing (1:3).', 'সিগনেচার', 'thai cashew nut salad chicken prawn'),
    'Chicken & Cashewnut Salad': ('চিকেন ক্যাশিউনাট সালাদ', 'ভাজা কাজুবাদাম, গ্রিলড চিকেন ও ফ্রেশ সালাদের রিফ্রেশিং মেলবন্ধন।', 'Tender chicken and golden roasted cashews tossed with crisp greens and sweet sour sauce.', 'বেস্টসেলার', 'chicken cashew nut salad crispy'),
    'Prawn Cashewnut Salad': ('প্রন ক্যাশিউনাট সালাদ', 'তাজা চিংড়ি ও মুচমুচে কাজুবাদামের থাই স্টাইল ব্যালেন্সড সালাদ (১:৩)।', 'Fresh prawns and crunchy cashews in zesty lime-chili cilantro dressing (1:3).', 'জনপ্রিয়', 'prawn cashew nut thai salad'),
    'Coleslaw Salad': ('কোলসল সালাদ', 'মিহি কুচানো বাঁধাকপি, গাজর ও প্রিমিয়াম ক্রিমি মেয়োনিজের ফ্রেশ কোলসল (১:৩)।', 'Crisp shredded cabbage and carrots tossed in sweet and creamy dressing (1:3).', 'ক্রিমি ফ্রেশ', 'creamy coleslaw salad bowl cabbage'),
    'Schezwan Salad': ('সেজুয়ান সালাদ', 'ঝাল মশলাদার সেজুয়ান সস ও সতেজ ক্রিসপি সবজির চাইনিজ সালাদ (১:৩)।', 'Fiery Schezwan infused shredded salad with spicy chili kick and sesame crunch (1:3).', 'স্পাইসি', 'spicy schezwan noodle vegetable salad'),
    'Green Salad': ('গ্রিন সালাদ', 'টাটকা শসা, টমেটো, গাজর, লেবু ও কাঁচামরিচের খাঁটি দেশি সালাদ (১:৩)।', 'Fresh slices of cucumbers, juicy tomatoes, onions, carrots and green chilies (1:3).', '১০০% ফ্রেশ', 'fresh green garden salad cucumber tomato'),
    'KutumBari Special Sizzling': ('কুটুমবাড়ি স্পেশাল সিজলিং', 'চিকেন, বিফ ও প্রনের ধোঁয়া ওঠা হট কাস্ট আয়রন সিজলার প্ল্যাটার (১:৩)।', 'Grand sizzling skillet bursting with chicken, beef, prawns and bell peppers (1:3).', 'সিগনেচার হট 🔥', 'hot sizzling fajita platter skillet'),
    'Chicken Sizzling': ('চিকেন সিজলিং', 'লোহার গরম তাওয়ায় ছ্যাঁৎ করে ওঠা ধোঁয়াটে স্পাইসি চাইনিজ চিকেন (১:৩)।', 'Sizzling hot plate loaded with juicy marinated chicken, onions & bell peppers (1:3).', 'বেস্টসেলার 🔥', 'sizzling chicken platter hot smoke'),
    'Beef Sizzling': ('বিফ সিজলিং', 'স্মোকি ফ্লেভার ও কড়া মশলায় ভুনা নরম গরুর মাংসের সিজলিং প্ল্যাটার (১:৩)।', 'Tender strips of beef seared on cast iron skillet with aromatic spices (1:3).', 'হট অ্যান্ড স্পাইসি 🔥', 'sizzling beef steak skillet fajita'),
    'Mutton Sizzling': ('মাটন সিজলিং', 'লোভনীয় ধোঁয়া ও রয়াল মশলায় হট প্লেটে পরিবেশিত খাসির মাংস (১:৩)।', 'Smoky, sizzling hot mutton tossed with caramelised onions and green chilies (1:3).', 'রয়াল সিজলার 🔥', 'sizzling lamb mutton skillet meat'),
    'Fish Sizzling': ('ফিশ সিজলিং', 'গার্লিক চিলি বাটার সসে ধোঁয়া ওঠা গরম তাওয়ায় সিজলিং মাছের ফিলে (১:৩)।', 'Pan-seared fish fillets served smoking hot in sweet and pungent chili garlic sauce (1:3).', 'সমুদ্রের স্বাদ 🔥', 'sizzling fish platter hot plate'),

    # Fast Food
    'Chicken Shawarma': ('চিকেন শর্মা', 'স্পাইসি রোস্টেড চিকেন, গার্লিক মেয়ো ও ক্রাঞ্চি সালাদে মোড়ানো পিটা ব্রেড রোল।', 'Middle Eastern spiced juicy chicken wrapped in soft pita bread with garlic mayo.', 'বেস্টসেলার', 'chicken shawarma wrap pita roll'),
    'Wrap Shawarma': ('র‌্যাপ শর্মা', 'টর্টিলা রুটিতে মোড়ানো এক্সট্রা সিজনিং ও চিজ মেয়োর প্রিমিয়াম শর্মা র‌্যাপ।', 'Extra loaded chicken wrap packed with pickled veggies, cheese and signature mayo.', 'জনপ্রিয়', 'crispy chicken wrap roll tortilla'),
    'Arabian Shawarma': ('অ্যারাবিয়ান শর্মা', 'খাঁটি এরাবিক মশলা, তাহিনী গার্লিক ক্রিম ও জুসি চিকেনের অথেনটিক স্বাদ।', 'Traditional Arabian style shawarma with slow roasted chicken, tahini sauce and herbs.', 'অথেনটিক', 'authentic arabian shawarma pita'),
    'Chicken Nachos': ('চিকেন নাচোস', 'মুচমুচে টর্টিলা চিপসের উপরে স্পাইসি চিকেন কিমা, মেল্টেড চিজ ও মেয়ো ড্রপ।', 'Crisp tortilla chips topped with spiced chicken chunks, melted cheese and jalapeños.', 'ক্রাঞ্চি', 'loaded chicken nachos melted cheese'),
    'Hell Nachos': ('হেল নাচোস', 'আগুন ঝাল নাগা চিলি, এক্সট্রা সালসা ও মেল্টেড চিজের স্পাইসি নাচোস প্ল্যাটার।', 'Extremely spicy nachos layered with fiery chili sauce, cheese and diced chicken.', 'ঝাল এক্সট্রিম 🌶️', 'spicy hot nachos jalapeno salsa cheese'),
    'Nachos Tower': ('নাচোস টাওয়ার', 'বিশাল উঁচু লেয়ারের চিজি নাচোস টাওয়ার, ফ্রেন্ডস অ্যান্ড ফ্যামিলি ফেভারিট।', 'Towering stack of crunchy tortilla chips fully loaded with cheese, meat and dips.', 'মেগা প্ল্যাটার', 'giant nachos tower cheese loaded'),
    'KutumBari Special Mix Box': ('কুটুমবাড়ি স্পেশাল মিক্স বক্স', 'চিকেন, সসেজ, ফ্রাই ও চিজের স্পেশাল বিগ সাইজ অল-ইন-ওয়ান লোডেড বক্স।', 'Ultimate snack box loaded with crispy chicken, wedges, sausages, and double cheese.', 'সিগনেচার', 'loaded snack box fries chicken cheese'),
    'Chicken Cheese Mix Box': ('চিকেন চিজ মিক্স বক্স', 'টেন্ডার চিকেন বাইটস, ক্রিসপি ফ্রাই ও গলিত চিজে ভরপুর মজাদার বক্স।', 'Delicious mix box featuring seasoned chicken, french fries, and rich creamy cheese sauce.', 'জনপ্রিয়', 'chicken cheese fries mix box loaded'),
    'Chicken Burger': ('চিকেন বার্গার', 'নরম বান, মুচমুচে জুসি চিকেন পেটি, লেটুস ও মেয়োনিজের ক্লাসিক বার্গার।', 'Classic burger with crispy golden chicken patty, fresh lettuce and mayo spread.', 'ক্লাসিক', 'classic crispy chicken burger bun'),
    'Chicken Cheese Burger': ('চিকেন চিজ বার্গার', 'গলিত চেডার চিজের স্লাইস সহ প্রিমিয়াম জুসি চিকেন পেটি বার্গার।', 'Juicy crispy chicken patty crowned with melted cheddar cheese slice in toasted bun.', 'বেস্টসেলার', 'chicken cheese burger melted cheddar'),
    'Chicken Jumbo Burger': ('চিকেন জাম্বো বার্গার', 'বিশাল ডাবল পেটি, ডাবল চিজ ও এক্সট্রা টপিংয়ের জাম্বো সাইজ বার্গার।', 'Giant burger loaded with double chicken patties, double cheese layers, and crunchy veggies.', 'মেগা সাইজ', 'huge giant double chicken burger'),
    'Chicken Crispy Burger': ('চিকেন ক্রিসপি বার্গার', 'এক্সট্রা কুড়মুড়ে ক্রিসপি জিঞ্জার চিকেন পেটি ও স্পাইসি স্প্রেডের বার্গার।', 'Extra crunchy golden crusted chicken patty burger with zesty peri mayo.', 'ক্রিসপি', 'crunchy fried chicken fillet burger'),
    'Patty Burger': ('পেটি বার্গার', 'গ্রিলড চিকেন পেটি, ক্যারামেলাইজড অনিয়ন ও সিগনেচার সসের বার্গার।', 'Handmade grilled chicken patty burger with caramelized onions and house sauce.', 'গ্রিলড', 'grilled chicken patty burger sesame'),
    'Naga Burger': ('নাগা বার্গার', 'নাগা চিলির মারাত্মক ঝালে ম্যারিনেট করা স্পাইসি ক্রাঞ্চি বার্গার।', 'Fiery hot burger infused with spicy Naga ghost pepper sauce for thrill seekers.', 'ঝাল এক্সট্রিম 🌶️', 'spicy naga burger red chili sauce'),
    'Sub Sandwich': ('সাব স্যান্ডউইচ', 'লং ফ্রেশ সাব বান, গ্রিলড চিকেন ও ফ্রেশ ভেজির লাইট স্যান্ডউইচ।', 'Fresh footlong style sub filled with marinated chicken, sliced veggies and honey mustard.', 'লাইট স্ন্যাক', 'chicken sub sandwich roll lettuce'),

    # Chowmein & Chop Suey
    'KutumBari Special Chowmein': ('কুটুমবাড়ি স্পেশাল চাউমিন', 'চিকেন, চিংড়ি, ডিম ও রঙিন সবজি সহযোগে স্পেশাল ওক-টসড চাউমিন (১:২)।', 'Grand wok-tossed chowmein laden with shredded chicken, prawns, eggs & veggies (1:2).', 'সিগনেচার', 'chinese special chowmein noodles stir fry'),
    'Chicken Chowmein': ('চিকেন চাউমিন', 'সুস্বাদু চিকেন স্ট্রিপস ও চাউমিন নুডলসের ওরিয়েন্টাল চাইনিজ ক্লাসিক।', 'Classic stir-fried noodles with seasoned chicken slivers, cabbage and spring onions.', 'বেস্টসেলার', 'chicken chowmein noodles wok'),
    'Prawn Chowmein': ('প্রন চাউমিন', 'রসালো গলদা চিংড়ি ও সয়া সসে ওক-টসড মজাদার ফ্রাইড নুডলস (১:৩)।', 'Wok-tossed noodles with fresh juicy prawns and crunchy julienne vegetables (1:3).', 'জনপ্রিয়', 'prawn noodles stir fry shrimp'),
    'Egg Chowmein': ('এগ চাউমিন', 'ডিমের ভাজা স্ক্র্যাম্বল ও সবজি দিয়ে তৈরি লাইট ও টেস্টি চাউমিন (১:৩)।', 'Comforting street-style egg chowmein tossed with light soy and fresh greens (1:3).', 'ক্লাসিক', 'egg noodles chowmein stir fry'),
    'American Chop Suey': ('আমেরিকান চপ সুয়ে', 'মুচমুচে ফ্রাইড ক্রিসপি নুডলস বেডের উপর মিষ্টি ও টক চিকেন গ্রেভি ও ডিমের পোচ (১:২)।', 'Crispy fried noodle nest topped with sweet-and-sour chicken glaze and fried egg (1:2).', 'শেফ স্পেশাল', 'american chop suey crispy noodle'),
    'Chicken Chop Suey': ('চিকেন চপ সুয়ে', 'নরম নুডলস ও গাড় চিকেন-ভেজিটেবল সস টপিংয়ের সুস্বাদু চপ সুয়ে (১:৩)।', 'Stir-fried noodles smothered in thick and luscious chicken vegetable sauce (1:3).', 'জনপ্রিয়', 'chinese chicken chop suey plate'),

    # Pizza
    'KutumBari Special Pizza': ('কুটুমবাড়ি স্পেশাল পিজ্জা', 'চিকেন, মাশরুম, ব্ল্যাক অলিভ, বেল পেপার ও মোজারেলা চিজে ঠাসা প্রিমিয়াম পিজ্জা (১২ ইঞ্চি)।', 'Signature 12-inch pizza loaded with spiced chicken, mushroom, black olives and double mozzarella.', 'সিগনেচার ১২"', 'special gourmet pizza supreme loaded'),
    'Plow Pizza': ('প্লো পিজ্জা', 'ক্রিসপি হ্যান্ড-টসড ক্রাস্ট, সিজনিং ও চিজের স্পেশাল ফ্লেভারযুক্ত পিজ্জা।', 'Hand-tossed artisan crust loaded with signature toppings and melted mozzarella cheese.', 'জনপ্রিয়', 'artisan cheese pizza freshly baked'),
    'Chicken Pizza': ('চিকেন পিজ্জা', 'মশলাদার চিকেন কিউবস, অনিয়ন, ক্যাপসিকাম ও চিজের অল-টাইম ফেভারিট পিজ্জা।', 'All-time favorite pizza topped with seasoned chicken tikka, bell peppers and gooey cheese.', 'বেস্টসেলার', 'classic chicken pizza bell pepper cheese'),
    'Italian Pizza': ('ইতালিয়ান পিজ্জা', 'ইতালিয়ান হার্বস, সতেজ টমেটো পিউরি, মোজারেলা ও অলিভ অয়েলের ক্লাসিক পিজ্জা।', 'Traditional Italian recipe with rich marinara base, aromatic basil, and pure mozzarella cheese.', 'ইতালিয়ান ক্রাস্ট', 'italian style margherita pizza herbs'),

    # Pasta
    'Oven Baked Pasta': ('ওভেন বেকড পাস্তা', 'পাস্তা, চিকেন ও চিজ ওভেনে বেক করে সোনালী ক্রাস্ট তৈরি করা রয়াল ডিশ (১:১)।', 'Penne pasta tossed in rich sauce, topped with mozzarella and baked until golden bubbly (1:1).', 'বেস্টসেলার', 'oven baked pasta bubbling mozzarella cheese'),
    'Pan Pasta': ('প্যান পাস্তা', 'স্টোভটপ প্যানে ওক-টসড লাইট টমেটো হার্ব সস পাস্তা (১:১)।', 'Pan-tossed penne pasta coated in vibrant tomato basil sauce with tender chicken (1:1).', 'জনপ্রিয়', 'creamy penne pasta skillet pan'),
    'Hot Sauce Pasta': ('হট সস পাস্তা', 'স্পাইসি রেড চিলি ও পেপেরনচিনো সসে কুকড ঝাল পাস্তা (১:১)।', 'Fiery arrabbiata style pasta cooked with roasted red chili flakes and tangy tomatoes (1:1).', 'স্পাইসি হট 🌶️', 'spicy red sauce pasta arrabbiata'),
    'White & Red Cheese Pasta': ('হোয়াইট অ্যান্ড রেড চিজ পাস্তা', 'হোয়াইট আলফ্রেডো ও রেড মারিনারার কম্বিনেশন পিঙ্ক চিজ পাস্তা (১:১)।', 'Velvety pink sauce pasta harmonizing rich white cream and savory red tomato flavors (1:1).', 'চিজি ডিলাইট', 'creamy pink sauce pasta cheese'),
    'Sizzling Pasta': ('সিজলিং পাস্তা', 'লোহার গরম তাওয়ায় ধোঁয়া ওঠা হট সিজলার চিজ পাস্তা (১:৩)।', 'Exciting sizzling plate loaded with hot bubbly saucy pasta and molten cheese (1:3).', 'সিজলিং হট 🔥', 'sizzling pasta platter hot smoke'),

    # Momo & Ramen
    'KutumBari Special Ramen': ('কুটুমবাড়ি স্পেশাল রামেন', 'ঝাল স্পাইসি ব্রথ, স্প্রিং নুডলস, বয়েলড এগ ও চিকেন টপিং রামেন (2X / 3X)।', 'Authentic spicy noodle ramen bowl with rich savory broth, marinated egg & chicken (2X / 3X).', 'ঝাল স্পাইসি 🍜', 'korean spicy ramen bowl egg broth'),
    'Chicken Momos': ('চিকেন মোমোস', 'নরম পাতলা আবরণে মোড়ানো রসালো ভাপে সেদ্ধ চিকেন মোমো ও স্পাইসি চাটনি (৬ পিস)।', 'Delicate steamed dumplings packed with juicy minced chicken and fresh scallions (6 pcs).', 'বেস্টসেলার', 'steamed chicken momos dumplings basket'),
    'Naga Momos': ('নাগা মোমোস', 'আগুনে ঝাল নাগা চিলি পেস্টে টস করা স্পাইসি মোমো (৬ পিস)।', 'Steamed dumplings coated in spicy flaming hot Naga pepper sauce (6 pcs).', 'ঝাল এক্সট্রিম 🌶️', 'spicy steamed momos red chili sauce'),
    'Chili Garlic Momos': ('চিলি গার্লিক মোমোস', 'পোড়া রসুনের সুবাস ও রেড চিলি সসে সঁতে করা প্যান ফ্রাইড মোমো (৬ পিস)।', 'Pan-fried dumplings tossed in fragrant charred garlic and spicy chili oil (6 pcs).', 'গার্লিক ফ্লেভার', 'chili garlic pan fried momos'),
    'Soup Momos': ('স্যুপ মোমোস', 'গরম সুস্বাদু ক্লিয়ার চিকেন ব্রথের ভেতরে ডুবানো নরম জুসি মোমো।', 'Juicy dumplings served immersed in a steaming bowl of comforting aromatic soup.', 'কমফোর্ট ফুড', 'dumpling soup wonton noodle broth'),

    # Dessert
    'Falooda': ('ফালুদা', 'নুডলস, মিষ্টি মিল্ক, সাবুদানা, জেলির কিউব ও আইসক্রিমের রিফ্রেশিং ডেজার্ট।', 'Traditional sweet dessert drink with vermicelli, basil seeds, jelly & ice cream.', 'বেস্টসেলার', 'royal falooda dessert glass ice cream'),
    'KutumBari Special Falooda': ('কুটুমবাড়ি স্পেশাল ফালুদা', 'ড্রাই ফ্রুটস, কাজুবাদাম, পেস্তা, এক্সট্রা প্রিমিয়াম আইসক্রিম স্কুপ সহ স্পেশাল ফালুদা।', 'Royal dessert packed with mixed dry nuts, saffron milk, fruits, and rich ice cream.', 'সিগনেচার', 'special royal falooda glass nuts'),
    'Ice Cream': ('আইসক্রিম', 'ভ্যানিলা / চকলেট / স্ট্রবেরি স্বাদের ক্রিমি ঠান্ডা সুস্বাদু আইসক্রিম।', 'Choice of rich and creamy gourmet ice cream scoops.', 'ঠান্ডা মিষ্টি', 'gourmet ice cream scoops bowl'),
    'Firni': ('ফিরনি', 'সুগন্ধি পোলাও চালের গুঁড়া, দুধ, জাফরান ও পেস্তাবাদামের খাঁটি শাহী ফিরনি।', 'Slow-cooked traditional rice pudding infused with saffron, cardamom and nuts.', 'শাহী ট্রেডিশনাল', 'bengali shahi firni rice pudding bowl'),
    'Jorda': ('জর্দা', 'ঘিয়ে ভাজা মিষ্টি সুগন্ধি পোলাও, মোরব্বা, মাওয়া ও ছোট মিষ্টি টপিং জর্দা।', 'Sweet festive saffron rice enriched with pure ghee, candied fruits, and baby sweets.', 'ঐতিহ্যবাহী মিষ্টি', 'bengali sweet jorda rice dessert'),

    # Combo
    'Combo-1': ('কম্বো-১', 'এগ ফ্রাইড রাইস + চিকেন ফ্রাই (২ পিস) + ভেজিটেবল + সালাদ + সফট ড্রিংক।', 'Egg Fried Rice + 2 Pcs Chicken Fry + Fresh Vegetable + Green Salad + Soft Drink.', 'ভ্যালু কম্বো 🌟', 'combo meal fried rice chicken drink'),
    'Combo-2': ('কম্বো-২', 'এগ ফ্রাইড রাইস + সুস্বাদু চিকেন কারি + ভেজিটেবল + সালাদ + কোল্ড ড্রিংক।', 'Egg Fried Rice + Savory Chicken Curry + Fresh Vegetable + Green Salad + Cold Drink.', 'ভ্যালু কম্বো 🌟', 'combo meal rice curry salad drink'),
    'Combo-3': ('কম্বো-৩', 'এগ ফ্রাইড রাইস + বারবিকিউ চিকেন (১ পিস) + ভেজিটেবল + সালাদ + কোল্ড ড্রিংক।', 'Egg Fried Rice + 1 Pc Smoky BBQ Chicken + Mixed Veg + Green Salad + Cold Drink.', 'স্মোকি কম্বো 🌟', 'combo platter rice bbq chicken drink'),
    'Combo-4': ('কম্বো-৪', 'এগ ফ্রাইড রাইস + তন্দুরি চিকেন + ভেজিটেবল + সালাদ + কোল্ড ড্রিংক।', 'Egg Fried Rice + Flavorful Tandoori Chicken + Mixed Veg + Green Salad + Cold Drink.', 'রয়াল কম্বো 🌟', 'combo platter rice tandoori chicken drink'),

    # Biryani & Khichuri
    'Chicken Biryani': ('চিকেন বিরিয়ানি', 'সুগন্ধি বাসমতী চাল ও দেশি মশলায় দমে রান্না করা নরম তুলতুলে চিকেন বিরিয়ানি।', 'Fragrant basmati rice slow cooked in dum with tender chicken and aromatic spices.', 'বেস্টসেলার', 'bengali chicken biryani plate kolkata'),
    'Beef Biryani': ('বিফ বিরিয়ানি', 'রসালো গরুর মাংস ও সুস্বাদু আলুর রয়াল ফ্লেভারযুক্ত দমে রান্না বিরিয়ানি।', 'Mouthwatering dum cooked beef biryani with tender spiced meat and potato.', 'জনপ্রিয়', 'beef biryani plate succulent meat'),
    'Mutton Biryani': ('মাটন বিরিয়ানি', 'খাসির নরম রসালো মাংস ও শাহী মশলায় রান্না করা প্রিমিয়াম মাটন বিরিয়ানি।', 'Royal mutton biryani with succulent meat infused with rich spices and saffron.', 'শাহী বিরিয়ানি', 'mutton biryani plate saffron meat'),
    'Hyderabadi Kacchi Biryani': ('হায়দ্রাবাদি কাচ্চি বিরিয়ানি', 'কাঁচা ম্যারিনেট করা মাংস ও চাল একসঙ্গে দমে বসানো খাঁটি হায়দ্রাবাদি কাচ্চি।', 'Authentic Hyderabadi kacchi style biryani layered with raw marinated meat and long-grain rice.', 'সিগনেচার কাচ্চি', 'hyderabadi kacchi biryani pot plate'),
    'Hyderabadi Biryani': ('হায়দ্রাবাদি বিরিয়ানি', 'জাফরানি রঙ ও স্পাইসি অ্যারোমার রয়াল হায়দ্রাবাদি দম বিরিয়ানি।', 'Exquisite spiced Hyderabadi dum biryani cooked in royal royal Mughal tradition.', 'রয়াল স্পেশাল', 'hyderabadi dum biryani rice plate'),
    'Arabian Kabsa': ('অ্যারাবিয়ান কাবসা', 'খাঁটি আরবীয় সুগন্ধি চাল, রোস্টেড মিট ও ড্রাই ফ্রুটসের জমকালো কাবসা ডিস (১:২ / ১:৪)।', 'Authentic Middle-Eastern Kabsa rice flavored with black lime, spices and roasted meat (1:2 / 1:4).', 'রয়াল প্ল্যাটার', 'arabian kabsa rice roasted meat platter'),
    'Egg Khichuri': ('এগ খিচুড়ি', 'মুগ ও মসুর ডালের ঘন খিচুড়ির সাথে ফ্রাইড ডিম ও খাঁটি ঘিয়ের সুবাস।', 'Comforting fragrant lentil rice khichuri served with spiced fried boiled egg.', 'কমফোর্ট ফুড', 'bengali egg khichuri ghee dal'),
    'Beef Khichuri': ('বিফ খিচুড়ি', 'ভুনা খিচুড়ির সাথে কষা গরুর মাংসের খাঁটি বাঙালি স্বাদের লোভনীয় মেলবন্ধন।', 'Rich aromatic roasted moong dal khichuri loaded with slow-cooked tender beef.', 'বেস্টসেলার', 'bengali beef khichuri plate meat'),
    'Chicken Khichuri': ('চিকেন খিচুড়ি', 'দেশি চিকেনের নরম টুকরো ও ঘি-ভাজা ডালের সুস্বাদু ভুনা খিচুড়ি।', 'Comforting yellow dal khichuri cooked with tender chicken pieces and whole spices.', 'জনপ্রিয়', 'bengali chicken khichuri plate'),

    # Naan & Grill
    'Butter Naan': ('বাটার নান', 'তন্দুর ওভেনে সেঁকা নরম তুলতুলে নান, উপর দিয়ে গলিত তাজা মাখন ব্রাশ করা।', 'Soft and fluffy tandoori leavened flatbread brushed with luscious creamy butter.', 'বেস্টসেলার', 'butter naan tandoori flatbread basket'),
    'Plain Naan': ('প্লেন নান', 'তন্দুরে তৈরি হালকা কুড়মুড়ে সোনালী নরম ট্র্যাডিশনাল নান রুটি।', 'Classic traditional tandoor-baked soft and airy leavened flatbread.', 'ক্লাসিক', 'plain naan flatbread tandoor'),
    'Garlic Naan': ('গার্লিক নান', 'কুচানো রসুন ও ধনেপাতার সুবাসে তৈরি বাটারি গার্লিক তন্দুর নান।', 'Tandoor naan topped with fragrant minced garlic, fresh coriander and butter glaze.', 'জনপ্রিয়', 'garlic naan butter coriander flatbread'),
    'Kashmiri Naan': ('কাশ্মীরি নান', 'বাদাম, কিশমিশ ও মিষ্টি ফ্লেভারযুক্ত রয়াল কাশ্মীরি নান।', 'Royal Kashmiri flatbread stuffed with dry fruits, nuts, coconut and cherries.', 'রয়াল নান', 'kashmiri naan sweet dry fruit flatbread'),
    'Grilled Chicken': ('গ্রিলড চিকেন', 'কয়লার আগুনে পোড়া স্মোকি জুসি গ্রিলড চিকেন (কোয়ার্টার / হাফ / ফুল)।', 'Charcoal flame-grilled chicken marinated in yogurt and special tandoori spices (Quarter / Half / Full).', 'সিগনেচার গ্রিল 🔥', 'charcoal grilled chicken quarters barbecue'),

    # Beverage
    'KutumBari Special Coffee': ('কুটুমবাড়ি স্পেশাল কফি', 'হাতে তৈরি ক্রিমি ফ্রথ ও চকলেট ফ্লেভারের প্রিমিয়াম হট কফি।', 'Signature barista crafted hot coffee with rich crema and dark cocoa dust.', 'সিগনেচার', 'special hot cappuccino coffee mug foam'),
    'Hot Coffee': ('হট কফি', 'তাজা রোস্টেড বিনের সুবাসে তৈরি উষ্ণ ও রিফ্রেশিং ক্লাসিক কফি।', 'Classic freshly brewed hot coffee with rich aroma and rich milk foam.', 'ক্লাসিক', 'hot coffee mug steam foam'),
    'Cappuccino Coffee': ('ক্যাপুচিনো কফি', 'গাঢ় এস্প্রেসো, স্টিমড মিল্ক ও ঘন ফোমের ক্লাসিক ইতালিয়ান ক্যাপুচিনো।', 'Classic Italian coffee made with rich espresso, steamed milk, and velvety foam art.', 'বেস্টসেলার', 'cappuccino latte art cup foam'),
    'Hot Chocolate': ('হট চকলেট', 'ঘন বেলজিয়ান কোকো ও ক্রিমি গরম দুধের প্রিমিয়াম চকলেট পানীয়।', 'Indulgent melted cocoa drink made with rich chocolate and warm frothy milk.', 'চকলেটি', 'hot chocolate mug marshmallows cocoa'),
    'Cold Coffee': ('কোল্ড কফি', 'আইসড চিলড রিফ্রেশিং ফ্রথি কোল্ড কফি, ভ্যানিলা মেজাজ সহ।', 'Chilled blended iced coffee topped with rich coffee foam and chocolate drizzle.', 'জনপ্রিয়', 'cold coffee glass ice chocolate swirl'),
    'Chocolate Milk Shake': ('চকলেট মিল্ক শেক', 'ঘন ডার্ক চকলেট, দুধ ও আইসক্রিমের ক্রিমি মিল্কশেক।', 'Thick and luscious chocolate milkshake topped with chocolate chips and whipped cream.', 'কিডস ফেভারিট', 'chocolate milkshake tall glass whipped cream'),
    'Strawberry Milk Shake': ('স্ট্রবেরি মিল্ক শেক', 'মিষ্টি তাজা স্ট্রবেরির সুগন্ধ ও ক্রিমি পিঙ্ক কালারের মিল্কশেক।', 'Vibrant pink creamy strawberry shake blended with ripe berries and ice cream.', 'ফ্রুটি', 'strawberry milkshake pink glass cherry'),
    'Vanilla Milk Shake': ('ভ্যানিলা মিল্ক শেক', 'ক্লাসিক ভ্যানিলা বিন আইসক্রিম ও খাঁটি দুধের স্মুথ শেক।', 'Classic creamy milkshake crafted with pure Madagascar vanilla extract and milk.', 'ক্লাসিক', 'vanilla milkshake tall glass froth'),
    'Mango Milk Shake': ('ম্যাঙ্গো মিল্ক শেক', 'পাকা আমের মিষ্টি পিউরি ও ঠান্ডা দুধের রয়াল মিল্কশেক।', 'Tropical rich mango shake blended with ripe sweet mango pulp and milk.', 'সিজনাল হিট', 'mango milkshake yellow tall glass'),
    'KutumBari Special Lassi': ('কুটুমবাড়ি স্পেশাল লাচ্ছি', 'ঘন টক-মিষ্টি দই, কাজুবাদাম, পেস্তা ও জাফরান ছোঁয়ায় তৈরি রাজকীয় লাচ্ছি।', 'Signature creamy yogurt lassi blended with saffron, pistachio and cardamom.', 'সিগনেচার', 'sweet yogurt lassi glass garnished nuts'),
    'Sweet Lassi': ('সুইট লাচ্ছি', 'ঐতিহ্যবাহী মিষ্টি দইয়ের রিফ্রেশিং ও হজমকারক ঠান্ডা লাচ্ছি।', 'Traditional sweet Punjabi style churned yogurt drink served ice-cold.', 'ট্রেডিশনাল', 'traditional sweet lassi glass yogurt'),
    'Smoothie': ('স্মুদি', 'তাজা ফলের ঘন পিউরি ও দইয়ের পুষ্টিকর বরফ-শীতল স্মুদি।', 'Thick healthy fruit smoothie packed with vitamins and chilled goodness.', 'হেলদি চয়েস', 'mixed berry fruit smoothie glass jar'),

    # Fresh Juice & Tea
    'Orange Juice': ('অরেঞ্জ জুস', 'তাজা কমলার রস, ১০০% ন্যাচারাল ও ভিটামিন সি সমৃদ্ধ।', 'Freshly pressed 100% pure orange juice bursting with natural citrus flavor.', 'ন্যাচারাল', 'fresh squeezed orange juice glass slices'),
    'Lemon Juice': ('লেমন জুস', 'তাজা পাতিলেবুর রস ও পুদিনা পাতার রিফ্রেশিং লেমনেড।', 'Crisp and zesty freshly squeezed lemonade with a hint of mint and ice.', 'রিফ্রেশিং', 'fresh lemon juice lemonade ice glass'),
    'Apple Juice': ('অ্যাপল জুস', 'মিষ্টি আপেলের ঠান্ডা ও সতেজকারী প্রাকৃতিক জুস।', 'Crisp and pure freshly pressed sweet apple juice served cold.', 'ন্যাচারাল', 'fresh apple juice glass red apple'),
    'Seasonal Juice': ('সিজনাল জুস', 'ঋতুভিত্তিক সেরা ফলের তাজা রস (আম / তরমুজ / আনারস)।', 'Chef selected freshly made juice from seasonal peak ripened fruits.', 'সিজনাল ফ্রেশ', 'fresh fruit seasonal juice glass melon'),
    'Mocktail Juice': ('মকটেল জুস', 'রঙিন ফলের জুস, সোডা ও সাইট্রাস ফ্লেভারের পার্টি মকটেল।', 'Layered colorful non-alcoholic mocktail sparkling with citrus fizz and herbs.', 'পার্টি স্পেশাল', 'colorful tropical mocktail glass garnish'),
    'Milk Tea': ('দুধ চা', 'খাঁটি তরল দুধ ও সুগন্ধি চা পাতার কড়া লিকারের ক্লাসিক বাঙালি দুধ চা।', 'Authentic rich Bengali style milk tea slow simmered to strong perfection.', 'বাঙালি ক্লাসিক', 'bengali milk tea cup saucer clay'),
    'Lemon Tea': ('লেমন চা', 'পাতিলেবুর মিষ্টি ঘ্রাণ ও আদা-গোলমরিচের হালকা লিকারের রিফ্রেশিং চা।', 'Soothing and cleansing black tea infused with fresh lemon juice and honey.', 'হেলদি', 'lemon tea cup slice black tea glass'),
    'KutumBari Special Tea': ('কুটুমবাড়ি স্পেশাল চা', 'এলাচ, দারুচিনি, জাফরান ও স্পেশাল মসলায় তৈরি শাহী রাজকীয় চা।', 'Signature royal masala chai brewed with crushed spices, saffron, and cream.', 'সিগনেচার', 'masala chai special tea cup spices'),

    # Bangla Food
    'সাদা ভাত (White Rice)': ('সাদা ভাত', 'ঝরঝরে গরম সুগন্ধি চালের সাদা ভাত।', 'Steaming hot, fluffy, and aromatic long-grain white rice.', 'ঐতিহ্যবাহী', 'steamed white rice bowl fluffy'),
    'ভর্তা (Bhorta)': ('স্পেশাল ভর্তা', 'আলু / বেগুন / শুঁটকি / ডাল ভর্তার খাঁটি সরিষার তেলের ঝাঁঝালো স্বাদ।', 'Traditional Bengali mashed delicacies prepared with mustard oil and green chilies.', 'খাঁটি স্বাদ', 'bengali aloo bhorta mashed potato mustard'),
    'সবজী (Vegetable)': ('সবজি ভাজি / লাবড়া', 'পাঁচমিশালি টাটকা দেশি সবজির স্বাস্থ্যকর নিরামিষ ভাজি।', 'Wholesome mixed vegetable dry curry seasoned with aromatic Panch Phoron.', '১০০% ভেজ', 'bengali mixed vegetable curry panch phoron'),
    'গরু ভুনা (Beef Vuna)': ('গরু ভুনা', 'কড়া তেলে পেঁয়াজ-রসুন ও দেশি গরম মশলায় কষিয়ে রান্না করা গরুর মাংস ভুনা।', 'Classic Bengali slow-cooked rich beef bhuna with intensely caramelized gravy.', 'বেস্টসেলার', 'bengali beef bhuna spicy rich curry'),
    'গরু কালা ভুনা (Beef Kala Vuna)': ('গরু কালা ভুনা', 'চট্টগ্রামের ঐতিহ্যবাহী খাঁটি কালো ভুনা, মুখে মিলিয়ে যাওয়া নরম মাংস ও মশলার ঘ্রাণ।', 'Famous traditional Chittagong style black beef curry with deep caramelized spices.', 'ঐতিহ্যবাহী স্পেশাল', 'chittagong kala bhuna beef black rich'),
    'খাসি (Mutton)': ('খাসির রেজালা / কারি', 'খাসির নরম রসালো মাংস ও খাঁটি দেশি মশলার ঝাল-ঘন ঝোল।', 'Rich and aromatic mutton curry prepared with traditional spices and mustard oil.', 'রয়াল ডিশ', 'bengali mutton curry goat meat rich gravy'),
    'মুরগী ভুনা (Chicken Vuna)': ('দেশি মুরগী ভুনা', 'দেশি স্টাইলের রসালো মুরগির মাংসের গাঢ় গ্রেভির ভুনা।', 'Traditional home-style chicken bhuna with roasted spices and flavorful onion gravy.', 'ঘরোয়া স্বাদ', 'bengali chicken bhuna home style curry'),
    'সিজনাল মাছ (Seasonal Fish)': ('সিজনাল মাছের ঝোল', 'ভাণ্ডারিয়ার নদী ও বিলের তাজা ইলিশ / রুই / কোরাল মাছের সুস্বাদু রান্না।', 'Daily catch fresh river fish cooked in aromatic mustard or light cumin broth.', 'তাজা নদীর মাছ', 'bengali ilish mach fish curry river'),
    'ডাল (Dal)': ('ঘরোয়া পাতলা ডাল', 'লেবু ও শুকনো মরিচ বাগার দেওয়া খাঁটি মসুর ডাল।', 'Classic yellow lentil soup tempered with cumin, garlic and dried red chili.', 'কমফোর্ট ফুড', 'yellow lentil soup dal tadka bowl')
}

def parse_price(raw_str):
    raw_str = raw_str.strip()
    if 'বাজার অনুযায়ী' in raw_str:
        return [{'name': 'বাজার অনুযায়ী (Market Price)', 'price': 0}], 'বাজার অনুযায়ী', 0
    
    # check combo description ending in - 230/-
    m_combo = re.match(r'^(.*?)\s*-\s*(\d+)/-$', raw_str)
    if '|' not in raw_str and m_combo and ',' in m_combo.group(1):
        price = int(m_combo.group(2))
        return [{'name': 'Regular', 'price': price}], f'৳{price}', price
        
    parts = [p.strip() for p in raw_str.split('|')]
    portions = []
    prices = []
    for part in parts:
        m_single = re.match(r'^(\d+)/-$', part)
        m_bengali_single = re.match(r'^.*?\((\d+)/-\)$', part)
        m_portion = re.match(r'^(.*?)\s*-\s*(\d+)/-$', part)
        
        if m_portion:
            p_name = m_portion.group(1).strip()
            p_val = int(m_portion.group(2))
            portions.append({'name': p_name, 'price': p_val})
            prices.append(p_val)
        elif m_bengali_single:
            p_val = int(m_bengali_single.group(1))
            portions.append({'name': 'Regular', 'price': p_val})
            prices.append(p_val)
        elif m_single:
            p_val = int(m_single.group(1))
            portions.append({'name': 'Regular', 'price': p_val})
            prices.append(p_val)
        else:
            portions.append({'name': 'Standard', 'price': 0})
    
    if prices:
        if len(prices) == 1:
            display = f'৳{prices[0]}'
        else:
            display = f'৳{min(prices)} - ৳{max(prices)}'
        min_p = min(prices)
    else:
        display = raw_str
        min_p = 0
    return portions, display, min_p

parsed_products = []
item_index = 0

for block in categories_raw:
    lines = [l.strip() for l in block.split('\n') if l.strip()]
    if not lines or 'Contact' in lines[0] or '# KutumBari' in lines[0]: continue
    raw_cat_title = re.sub(r'\[cite: \d+\]', '', lines[0]).replace('## ', '').strip()
    
    cat_info = CATEGORY_MAP.get(raw_cat_title)
    if not cat_info:
        print(f'WARNING: Category not found for {raw_cat_title}')
        continue

    for line in lines[1:]:
        if line.startswith('* **'):
            cleaned = re.sub(r'\[cite: \d+\]', '', line).strip()
            m = re.match(r'^\*\s*\*\*(.*?)\*\*\s*:?\s*(.*)$', cleaned)
            if not m: continue
            
            raw_name = m.group(1).rstrip(':').strip()
            # strip leading numbers like '1. ' if present
            raw_name_clean = re.sub(r'^\d+\.\s*', '', raw_name)
            price_part = m.group(2).strip()
            
            portions, priceDisplay, minPrice = parse_price(price_part)
            
            # Lookup details
            lookup_res = DETAILS_LOOKUP.get(raw_name_clean)
            if lookup_res:
                nameBn, descBn, descEn, badge, searchQuery = lookup_res
            else:
                nameBn = raw_name_clean
                descBn = 'তাজা উপাদান ও খাঁটি স্বাদে পরিবেশিত।'
                descEn = 'Freshly prepared with quality ingredients and authentic taste.'
                badge = 'জনপ্রিয়'
                searchQuery = raw_name_clean

            # Clean English name if contains parenthesis for bangla items
            nameEn = raw_name_clean
            if '(' in raw_name_clean and ')' in raw_name_clean:
                m_paren = re.search(r'\((.*?)\)', raw_name_clean)
                if m_paren:
                    nameEn = m_paren.group(1)

            item_index += 1
            cat_key = cat_info['key']
            prod_id = f'{cat_key}-{item_index:03d}'
            
            parsed_products.append({
                'id': prod_id,
                'categoryKey': cat_info['key'],
                'categoryNameBn': cat_info['nameBn'],
                'categoryNameEn': cat_info['nameEn'],
                'categoryIcon': cat_info['icon'],
                'nameEn': nameEn,
                'nameBn': nameBn,
                'portions': portions,
                'priceDisplay': priceDisplay,
                'minPrice': minPrice,
                'descriptionBn': descBn,
                'descriptionEn': descEn,
                'badge': badge,
                'searchQuery': searchQuery,
                'image': f'/products/{prod_id}.webp',
                'fallbackImage': cat_info['fallback']
            })

print(f'Total parsed products: {len(parsed_products)}')
with open('data/products_raw.json', 'w', encoding='utf-8') as f:
    json.dump(parsed_products, f, ensure_ascii=False, indent=2)
print('Saved data/products_raw.json')
