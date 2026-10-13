"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Phone,
  Calendar,
  Clock,
  MapPin,
  Menu as MenuIcon,
  X,
  Sparkles,
  ChefHat,
  Leaf,
  PartyPopper,
  Heart,
  ChevronRight,
  CheckCircle2,
  Utensils,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Star,
  Percent,
  Globe,
  Share2,
  Award,
  Search,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  BookOpen,
  Maximize2,
  Eye,
  Grid,
  FileText,
  Layers,
  RotateCcw,
} from "lucide-react";
import {
  ALL_MENU_PAGES,
  MENU_CATEGORIES as PRINTED_MENU_CATEGORIES,
  MenuPage,
  MenuCategoryFilter,
} from "../data/menuPages";
import {
  ALL_MENU_PRODUCTS,
  MENU_CATEGORIES as CATALOG_CATEGORIES,
  MenuItem as CatalogProduct,
  PortionOption,
} from "../data/productsData";


// Types
type CuisineCategory = "all" | "bangla" | "chinese" | "fastfood";

interface MenuItem {
  id: string;
  titleBn: string;
  titleEn: string;
  category: "bangla" | "chinese" | "fastfood";
  price: string;
  descriptionBn: string;
  descriptionEn: string;
  image: string;
  popular?: boolean;
  isChefSpecial?: boolean;
}

interface EventItem {
  id: string;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  image: string;
  features: string[];
}

// Menu items data
const MENU_ITEMS: MenuItem[] = [
  {
    id: "b1",
    titleBn: "কাচ্চি বিরিয়ানি (স্পেশাল)",
    titleEn: "Royal Kacchi Biryani",
    category: "bangla",
    price: "৳ ৩২০",
    descriptionBn: "বাসমতী চাল, সুস্বাদু খাসির মাংস ও জাফরানের রাজকীয় ঘ্রাণে তৈরি ঐতিহ্যবাহী কাচ্চি।",
    descriptionEn: "Aromatic basmati rice layered with tender mutton marinated in fragrant spices & saffron.",
    image: "/images/kacchi.jpg",
    popular: true,
    isChefSpecial: true,
  },
  {
    id: "b2",
    titleBn: "স্পেশাল গরুর কালা ভুনা",
    titleEn: "Chittagong Beef Kala Bhuna",
    category: "bangla",
    price: "৳ ২৮০",
    descriptionBn: "ঐতিহ্যবাহী মশলায় কড়া ভাজা নরম গরুর মাংসের বিখ্যাত কালা ভুনা।",
    descriptionEn: "Slow-cooked caramelised beef chuck roasted in signature dark ground spices.",
    image: "/images/kalabhuna.jpg",
    popular: true,
    isChefSpecial: true,
  },
  {
    id: "b3",
    titleBn: "সর্ষে ইলিশ ও গরম ভাত",
    titleEn: "Shorshe Hilsha Fish Platter",
    category: "bangla",
    price: "৳ ৩৫০",
    descriptionBn: "তাজা পদ্মার ইলিশ, ঝাঁঝালো সর্ষে বাটা ও কাঁচা মরিচের খাঁটি দেশি স্বাদ।",
    descriptionEn: "Fresh prime Hilsha simmered in spicy mustard seed gravy served with steamed rice.",
    image: "/images/ilish.jpg",
    popular: false,
    isChefSpecial: true,
  },
  {
    id: "b4",
    titleBn: "ঘরোয়া স্পেশাল ভুনা খিচুড়ি",
    titleEn: "Special Bhuna Khichuri",
    category: "bangla",
    price: "৳ ১৯০",
    descriptionBn: "সুগন্ধি চিনিগুঁড়া চাল ও মুগ ডালের খাঁটি গাওয়া ঘিয়ে রান্না রসালো খিচুড়ি।",
    descriptionEn: "Flavourful roasted moong dal & Chinigura rice infused with pure cow ghee & whole spices.",
    image: "/images/khichuri.jpg",
    popular: false,
  },
  {
    id: "c1",
    titleBn: "চিকেন ফ্রাইড রাইস ও কাজু বাদাম",
    titleEn: "Chicken Cashewnut Fried Rice",
    category: "chinese",
    price: "৳ ২৫০",
    descriptionBn: "সুস্বাদু চিকেন কিউব, ক্রিস্পি কাজু বাদাম এবং তাজা ক্যাপসিকামে ওক-টস্ট ফ্রাইড রাইস।",
    descriptionEn: "Wok-tossed long-grain jasmine rice with tender chicken, roasted cashews, and fresh greens.",
    image: "/images/friedrice.jpg",
    popular: true,
  },
  {
    id: "c2",
    titleBn: "সিজেকুয়ান চিলি চিকেন (গ্রেভি)",
    titleEn: "Szechuan Chili Chicken Gravy",
    category: "chinese",
    price: "৳ ২৭০",
    descriptionBn: "ঝাল-মিষ্টি চাইনিজ সসে তাজা মরিচ ও রসুনের ফ্লেভারে ভাজা মচমচে চিকেন।",
    descriptionEn: "Crisp chicken bites tossed with fiery red chillies, garlic, scallions, and soy reduction.",
    image: "/images/chilichicken.jpg",
    popular: true,
    isChefSpecial: true,
  },
  {
    id: "c3",
    titleBn: "স্পেশাল মিক্সড চাউমিন",
    titleEn: "Chef Special Mixed Chowmein",
    category: "chinese",
    price: "৳ ২২০",
    descriptionBn: "হাতে তৈরি তাজা নুডলসে চিকেন, ডিম এবং ক্রাঞ্চি ভেজিটেবলের খাঁটি ওক স্বাদ।",
    descriptionEn: "Authentic street-wok egg noodles loaded with spiced chicken chunks, eggs, and crisp slaw.",
    image: "/images/chowmein.jpg",
    popular: false,
  },
  {
    id: "c4",
    titleBn: "ক্রিস্পি ওয়ানটন ও হট অ্যান্ড সাওয়ার স্যুপ",
    titleEn: "Crispy Wonton & Hot & Sour Soup",
    category: "chinese",
    price: "৳ ১৮০",
    descriptionBn: "গোল্ডেন ক্রিস্পি চিকেন ওয়ানটন সাথে গরম ভাপ ওঠা ঝাঁঝালো স্পেশাল স্যুপ।",
    descriptionEn: "Golden deep-fried wonton dumplings paired with comforting thick hot & sour soup bowl.",
    image: "/images/wonton.jpg",
    popular: false,
  },
  {
    id: "f1",
    titleBn: "কুটুমবাড়ি সিগনেচার বিফ/চিকেন বার্গার",
    titleEn: "KutumBari Signature Gourmet Burger",
    category: "fastfood",
    price: "৳ ২১০",
    descriptionBn: "জুসি গ্রিলড প্যাটি, চিজ স্লাইস, ক্যারামেলাইজড পেঁয়াজ এবং সিক্রেট হাউজ সস।",
    descriptionEn: "Juicy grilled patty topped with melted cheddar, crisp lettuce, tomato, and secret sauce.",
    image: "/images/burger.jpg",
    popular: true,
    isChefSpecial: true,
  },
  {
    id: "f2",
    titleBn: "ক্রিস্পি ফ্রাইড চিকেন বাকেট (৪ পিস)",
    titleEn: "Crunchy Golden Fried Chicken (4 pcs)",
    category: "fastfood",
    price: "৳ ২৪০",
    descriptionBn: "বাইরে মারাত্মক মচমচে, ভেতরে জুসি স্পাইসি ক্রাঞ্চি চিকেন সাথে গার্লিক মেয়ো।",
    descriptionEn: "Signature 11-spice marinated chicken crusted to golden perfection, served with garlic dip.",
    image: "/images/crispychicken.jpg",
    popular: true,
  },
  {
    id: "f3",
    titleBn: "উড-ফায়ার্ড চিকেন পিৎজা (১০ ইঞ্চি)",
    titleEn: "Artisan Chicken Fiesta Pizza (10\")",
    category: "fastfood",
    price: "৳ ৩৪০",
    descriptionBn: "১০০% মোজারেলা চিজ, মশলাদার চিকেন চাংকস, অলিভ ও ক্যাপসিকামের দুর্দান্ত কম্বো।",
    descriptionEn: "Crispy thin-crust base laden with rich tomato sauce, loaded mozzarella, spiced chicken & herbs.",
    image: "/images/pizza.jpg",
    popular: false,
  },
  {
    id: "f4",
    titleBn: "চিজি লোডেড ফ্রেঞ্চ ফ্রাইস",
    titleEn: "Cheesy Loaded French Fries",
    category: "fastfood",
    price: "৳ ১৫০",
    descriptionBn: "গোল্ডেন ফ্রাইস যার ওপর গলানো চিডার চিজ, স্পাইসি ডাস্ট ও স্পেশাল হার্ব সস।",
    descriptionEn: "Fresh potato fries smothered with warm melted cheddar cheese, jalapeño bits & herb mayo.",
    image: "/images/loadedfries.jpg",
    popular: false,
  },
];

// Events Hosted data
const EVENTS: EventItem[] = [
  {
    id: "birthday",
    titleBn: "জন্মদিনের আয়োজন",
    titleEn: "Birthday Parties",
    descriptionBn: "প্রিয়জনের জন্মদিনকে স্মরণীয় করতে বিশেষ আলোকসজ্জা, থিম ডেকোরেশন ও কাস্টমাইজড কেক ব্যবস্থা।",
    descriptionEn: "Vibrant custom themes, ambient lighting, sound system, and tailored party menus for an unforgettable birthday.",
    image: "/images/event-birthday.jpg",
    features: ["থিম ডেকোরেশন সুবিধা", "মিউজিক ও সাউন্ড সিস্টেম", "কাস্টম কিডস ও পার্টি মেনু", "কেক কাটার বিশেষ কর্নার"],
  },
  {
    id: "anniversary",
    titleBn: "বিবাহ বার্ষিকী",
    titleEn: "Wedding Anniversaries",
    descriptionBn: "রোমান্টিক ও মার্জিত পরিবেশে দম্পতি ও পরিবারের জন্য বিশেষ আয়োজন ও প্রিমিয়াম ডাইনিং সুবিধা।",
    descriptionEn: "Romantic ambient lighting, private family setups, and candle-lit dining packages to celebrate your special milestone.",
    image: "/images/event-anniversary.jpg",
    features: ["ক্যান্ডেল-লাইট ডাইনিং জোন", "প্রাইভেট ফ্যামিলি টেবিল", "বিশেষ ডেজার্ট উপহার", "ফটোশুট উপযোগী কর্নার"],
  },
  {
    id: "meeting",
    titleBn: "মিটিং ও সেমিনার",
    titleEn: "Meetings & Seminars",
    descriptionBn: "কর্পোরেট আলোচনা, ক্লাব মিটিং কিংবা অফিসিয়াল গেট-টুগেদারের জন্য শান্ত ও সুশৃঙ্খল পরিবেশ।",
    descriptionEn: "Executive-friendly layout, projector support, comfortable seating, and hassle-free buffet/snack packages.",
    image: "/images/event-meeting.jpg",
    features: ["প্রজেক্টর ও অডিও সাপোর্ট", "হাই-স্পিড ওয়াইফাই", "এক্সিকিউটিভ টি ও স্ন্যাক্স প্ল্যান", "শান্ত ও প্রফেশনাল স্পেস"],
  },
  {
    id: "family",
    titleBn: "ঘরোয়া অনুষ্ঠান",
    titleEn: "Family Programs",
    descriptionBn: "পারিবারিক আড্ডা, দাওয়াত বা যেকোনো ঘরোয়া উৎসবে পরিবার-পরিজন নিয়ে নিশ্চিন্তে কাটানোর আপন ঠিকানা।",
    descriptionEn: "Spacious seating where large family groups can dine together with personalized Bangla, Chinese & Fast food sets.",
    image: "/images/event-family.jpg",
    features: ["১০০+ জন ধারণক্ষমতা", "মহিলা ও শিশুদের বিশেষ সুবিধা", "ঐতিহ্যবাহী বাংলা দস্তরখান/টেবিল", "দক্ষ সার্ভিস কর্মী"],
  },
];

export default function KutumBariLandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CuisineCategory>("all");
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [language, setLanguage] = useState<"bn" | "en">("bn");

  // Menu System State (144 Individual Products + 19-Page Menu Book)
  const [activeMenuTab, setActiveMenuTab] = useState<"catalog" | "pages">("catalog");
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<string>("all");
  const [catalogSearchQuery, setCatalogSearchQuery] = useState("");
  const [catalogPriceFilter, setCatalogPriceFilter] = useState<"all" | "under200" | "under400" | "special">("all");
  const [selectedPortions, setSelectedPortions] = useState<Record<string, number>>({});
  const [visibleProductCount, setVisibleProductCount] = useState<number>(24);

  // Menu Book (19-Page Scanned Booklet) State
  const [activePageCategory, setActivePageCategory] = useState<MenuCategoryFilter>("all");
  const [menuSearchQuery, setMenuSearchQuery] = useState("");
  const [selectedMenuPage, setSelectedMenuPage] = useState<MenuPage | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Booking Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    guests: "2",
    date: "",
    timeSlot: "Dinner (রাত)",
    occasion: "Dine-in / সাধারণ ভোজন",
    notes: "",
  });

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu or modal is open
  useEffect(() => {
    if (mobileMenuOpen || bookingModalOpen || selectedMenuPage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen, bookingModalOpen, selectedMenuPage]);

  // Modal navigation helpers
  const handleOpenPageModal = (page: MenuPage) => {
    setSelectedMenuPage(page);
    setZoomLevel(1);
  };

  const handleClosePageModal = () => {
    setSelectedMenuPage(null);
    setZoomLevel(1);
  };

  const handlePrevPage = () => {
    if (!selectedMenuPage) return;
    const currentIndex = ALL_MENU_PAGES.findIndex((p) => p.id === selectedMenuPage.id);
    const prevIndex = (currentIndex - 1 + ALL_MENU_PAGES.length) % ALL_MENU_PAGES.length;
    setSelectedMenuPage(ALL_MENU_PAGES[prevIndex]);
    setZoomLevel(1);
  };

  const handleNextPage = () => {
    if (!selectedMenuPage) return;
    const currentIndex = ALL_MENU_PAGES.findIndex((p) => p.id === selectedMenuPage.id);
    const nextIndex = (currentIndex + 1) % ALL_MENU_PAGES.length;
    setSelectedMenuPage(ALL_MENU_PAGES[nextIndex]);
    setZoomLevel(1);
  };

  const handleZoomToggle = () => {
    setZoomLevel((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1));
  };

  // Keyboard navigation for menu modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedMenuPage) return;
      if (e.key === "Escape") handleClosePageModal();
      if (e.key === "ArrowLeft") handlePrevPage();
      if (e.key === "ArrowRight") handleNextPage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedMenuPage]);

  // Filter Menu Pages
  const filteredMenuPages = ALL_MENU_PAGES.filter((page) => {
    const matchesCategory =
      activePageCategory === "all" || page.category === activePageCategory;
    const query = menuSearchQuery.trim().toLowerCase();
    if (!query) return matchesCategory;

    const matchesSearch =
      page.titleBn.toLowerCase().includes(query) ||
      page.titleEn.toLowerCase().includes(query) ||
      page.descriptionBn.toLowerCase().includes(query) ||
      page.descriptionEn.toLowerCase().includes(query) ||
      page.highlightItems.some((item) => item.toLowerCase().includes(query)) ||
      page.searchKeywords.some((kw) => kw.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  // Handle Form Change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Portion Selection Handler
  const handleSelectPortion = (productId: string, portionIndex: number) => {
    setSelectedPortions((prev) => ({
      ...prev,
      [productId]: portionIndex,
    }));
  };

  // Open modal with specific catalog product preselected
  const handleOrderProduct = (product: CatalogProduct) => {
    const selectedIdx = selectedPortions[product.id] ?? 0;
    const portion = product.portions[selectedIdx] || product.portions[0];
    const portionText =
      portion && portion.name !== "Regular"
        ? ` (${portion.name} - ৳${portion.price})`
        : portion && portion.price > 0
        ? ` (৳${portion.price})`
        : "";
    setFormData((prev) => ({
      ...prev,
      notes: `অর্ডার করতে আগ্রহী: ${product.nameBn}${portionText}`,
    }));
    setBookingModalOpen(true);
  };

  // Filter 144 Products
  const filteredCatalogProducts = ALL_MENU_PRODUCTS.filter((prod) => {
    // Category filter
    const matchesCat =
      selectedCatalogCategory === "all" || prod.categoryKey === selectedCatalogCategory;
    if (!matchesCat) return false;

    // Price filter
    if (catalogPriceFilter === "under200" && prod.minPrice > 200) return false;
    if (catalogPriceFilter === "under400" && prod.minPrice > 400) return false;
    if (
      catalogPriceFilter === "special" &&
      !["সিগনেচার", "শেফ স্পেশাল", "বেস্টসেলার"].some((b) => prod.badge.includes(b))
    )
      return false;

    // Search query
    const query = catalogSearchQuery.trim().toLowerCase();
    if (!query) return true;

    return (
      prod.nameBn.toLowerCase().includes(query) ||
      prod.nameEn.toLowerCase().includes(query) ||
      prod.categoryNameBn.toLowerCase().includes(query) ||
      prod.categoryNameEn.toLowerCase().includes(query) ||
      prod.descriptionBn.toLowerCase().includes(query) ||
      prod.descriptionEn.toLowerCase().includes(query) ||
      prod.badge.toLowerCase().includes(query)
    );
  });

  // Open modal with specific dish preselected
  const handleOrderDish = (dishTitle: string) => {
    setFormData((prev) => ({
      ...prev,
      notes: `অর্ডার করতে আগ্রহী: ${dishTitle}`,
    }));
    setBookingModalOpen(true);
  };

  // Handle Booking Submit
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("অনুগ্রহ করে আপনার নাম ও মোবাইল নম্বর প্রদান করুন।");
      return;
    }
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingModalOpen(false);
      setFormData({
        name: "",
        phone: "",
        guests: "2",
        date: "",
        timeSlot: "Dinner (রাত)",
        occasion: "Dine-in / সাধারণ ভোজন",
        notes: "",
      });
    }, 2800);
  };

  // Filter Menu Items
  const filteredMenuItems =
    activeCategory === "all"
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div className="relative min-h-screen bg-white text-brand-charcoal overflow-x-hidden pb-24 md:pb-0 font-sans">
      {/* 1. TOP ANNOUNCEMENT BAR (UI/UX Pro Max: High contrast, SVG icon, responsive wrap) */}
      <div className="bg-brand-red text-white text-xs sm:text-sm font-medium py-2 px-3 text-center flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 shadow-inner z-50 relative w-full overflow-hidden">
        <span className="inline-flex items-center justify-center bg-white text-brand-red text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0">
          {language === "bn" ? "অফার" : "OFFER"}
        </span>
        <span className="font-semibold tracking-tight text-center">
          {language === "bn"
            ? "শুভ উদ্বোধন উপলক্ষে ১৫% বিশেষ ছাড়! (Grand Opening 15% OFF)"
            : "Grand Opening Celebration: Enjoy 15% Flat Discount On All Orders!"}
        </span>
        <span className="hidden md:inline-block opacity-80">|</span>
        <a
          href="tel:01351327933"
          className="cursor-pointer hidden md:inline-flex items-center gap-1 font-bold underline hover:text-amber-200 transition-colors py-1 focus:outline-none focus:ring-1 focus:ring-white rounded"
        >
          <Phone className="w-3.5 h-3.5" /> 01351327933
        </a>
      </div>

      {/* 2. NAVIGATION BAR (UI/UX Pro Max: No emoji, cursor-pointer, min 44x44px touch targets) */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 w-full ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md text-brand-charcoal py-2 sm:py-3 border-b border-gray-100"
            : "bg-brand-green-deep/95 backdrop-blur-sm text-white py-2.5 sm:py-4 border-b border-white/10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2">
            {/* Brand Logo & Name */}
            <a
              href="#home"
              className="cursor-pointer flex items-center gap-2 sm:gap-3 group focus:outline-none focus:ring-2 focus:ring-brand-red rounded-xl p-1 min-h-[44px] min-w-0"
            >
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden shadow-md ring-2 ring-brand-red bg-white flex-shrink-0">
                <Image
                  src="/logo.jpg"
                  alt="KutumBari Restaurant Logo"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
              <div className="flex flex-col min-w-0 text-left">
                <span
                  className={`text-base sm:text-xl font-bold tracking-tight font-serif leading-tight truncate transition-colors ${
                    isScrolled ? "text-brand-green-deep" : "text-white"
                  }`}
                >
                  কুটুমবাড়ি <span className="text-brand-red">রেস্টুরেন্ট</span>
                </span>
                <span
                  className={`text-[9px] sm:text-xs font-medium tracking-wider uppercase truncate ${
                    isScrolled ? "text-brand-orange" : "text-emerald-200"
                  }`}
                >
                  KutumBari • Bhandaria
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              {[
                { href: "#home", labelBn: "হোম", labelEn: "Home" },
                { href: "#menu", labelBn: "খাবারের মেনু", labelEn: "Menu" },
                { href: "#events", labelBn: "উৎসব ও আয়োজন", labelEn: "Events" },
                { href: "#about", labelBn: "আমাদের সম্পর্কে", labelEn: "About" },
                { href: "#location", labelBn: "ঠিকানা ও যোগাযোগ", labelEn: "Contact" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`cursor-pointer text-sm font-semibold transition-colors duration-200 hover:text-brand-orange py-2 min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-brand-red rounded-lg px-1 ${
                    isScrolled ? "text-brand-charcoal" : "text-white/90"
                  }`}
                >
                  {language === "bn" ? item.labelBn : item.labelEn}
                </a>
              ))}
            </nav>

            {/* Desktop CTAs & Language Switcher */}
            <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
              {/* Language Switcher (Uses SVG Globe Icon, NO EMOJI) */}
              <button
                type="button"
                onClick={() => setLanguage(language === "bn" ? "en" : "bn")}
                className={`cursor-pointer min-h-[44px] px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-brand-red ${
                  isScrolled
                    ? "border-gray-300 text-brand-charcoal hover:bg-gray-100"
                    : "border-white/30 text-white hover:bg-white/15"
                }`}
                title="Switch Language / ভাষা পরিবর্তন করুন"
              >
                <Globe className="w-3.5 h-3.5 text-brand-orange" />
                <span>{language === "bn" ? "English" : "বাংলা"}</span>
              </button>

              {/* Book Table Button (Red CTA) */}
              <button
                type="button"
                onClick={() => setBookingModalOpen(true)}
                className="cursor-pointer min-h-[44px] bg-brand-red hover:bg-brand-red-hover text-white px-5 py-2.5 rounded-full font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2"
              >
                <Calendar className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                <span>{language === "bn" ? "টেবিল বুক করুন" : "Book a Table"}</span>
              </button>
            </div>

            {/* Mobile Controls (Language + Accessible Hamburger Menu) */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden flex-shrink-0">
              <button
                type="button"
                onClick={() => setLanguage(language === "bn" ? "en" : "bn")}
                className={`cursor-pointer min-h-[44px] min-w-[44px] px-2.5 py-1.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1 focus:outline-none focus:ring-2 focus:ring-brand-red ${
                  isScrolled
                    ? "border-gray-300 text-brand-charcoal hover:bg-gray-100"
                    : "border-white/30 text-white hover:bg-white/10"
                }`}
                aria-label="Toggle language between Bangla and English"
              >
                <Globe className="w-3 h-3 text-brand-orange" />
                <span>{language === "bn" ? "EN" : "বাং"}</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`cursor-pointer min-h-[44px] min-w-[44px] p-2 rounded-xl transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand-red ${
                  isScrolled
                    ? "text-brand-charcoal hover:bg-gray-100"
                    : "text-white hover:bg-white/10"
                }`}
                aria-label="Open mobile navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <MenuIcon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white text-brand-charcoal border-b border-gray-200 shadow-xl px-4 py-6 transition-all duration-300">
            <div className="flex flex-col space-y-2">
              {[
                { href: "#home", labelBn: "হোম (Home)", icon: Utensils },
                { href: "#menu", labelBn: "খাবারের মেনু (Menu)", icon: Sparkles },
                { href: "#events", labelBn: "সব উৎসবের আয়োজন (Events)", icon: PartyPopper },
                { href: "#about", labelBn: "আমাদের সম্পর্কে (About)", icon: Heart },
                { href: "#location", labelBn: "ঠিকানা ও যোগাযোগ (Contact)", icon: MapPin },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="cursor-pointer min-h-[48px] flex items-center justify-between p-3 rounded-xl hover:bg-brand-green-surface transition-colors font-semibold text-base text-brand-charcoal focus:outline-none focus:ring-2 focus:ring-brand-red"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span>{item.labelBn}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </a>
                );
              })}

              <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setBookingModalOpen(true);
                  }}
                  className="cursor-pointer min-h-[48px] w-full bg-brand-red hover:bg-brand-red-hover text-white py-3 px-4 rounded-xl font-bold text-center flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span>{language === "bn" ? "টেবিল বুক করুন" : "Book a Table"}</span>
                </button>

                <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-orange" /> Lunch & Dinner
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-red" /> ভাণ্ডারিয়া
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 3. HERO SECTION (UI/UX Pro Max: Deep contrast, appetizing floating visuals, zero layout shift) */}
      <section
        id="home"
        className="relative min-h-[88vh] flex items-center pt-10 pb-16 md:pt-20 md:pb-24 bg-brand-green-deep text-white overflow-hidden w-full"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#041d14] via-[#073322] to-[#052619] opacity-95"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-[500px] h-64 sm:h-[500px] bg-brand-green/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-48 sm:w-80 h-48 sm:h-80 bg-brand-red/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
            {/* Left Content Column */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl">
              {/* Grand Opening Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs sm:text-sm font-semibold mb-6">
                <Percent className="w-4 h-4 text-brand-orange" />
                <span>
                  {language === "bn"
                    ? "শুভ উদ্বোধন উপলক্ষে ১৫% ছাড় • শুভ যাত্রা ৯ অক্টোবর"
                    : "Grand Opening 15% OFF • Official Launch Oct 9th"}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white font-serif leading-[1.2] sm:leading-[1.15] mb-5">
                {language === "bn" ? (
                  <>
                    স্বাদের সাথে ভালোবাসার <br className="hidden sm:inline" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-300 to-amber-100">
                      এক আপন ঠিকানা
                    </span>
                  </>
                ) : (
                  <>
                    Where Authentic Flavour <br className="hidden sm:inline" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-300 to-amber-100">
                      Feels Like Home
                    </span>
                  </>
                )}
              </h1>

              {/* Secondary Slogans */}
              <p className="text-base sm:text-lg md:text-xl text-emerald-100/90 font-normal mb-3 max-w-xl">
                {language === "bn"
                  ? "কুটুমবাড়ি রেস্টুরেন্ট — বাংলা, চাইনিজ ও ফাস্ট-ফুডের সেরা স্বাদ ভাণ্ডারিয়ার প্রাণকেন্দ্রে।"
                  : "KutumBari Restaurant — Good Food Together. Premium Bangla, Chinese & Fast-Food in the heart of Bhandaria."}
              </p>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-300 font-medium mb-8">
                <Sparkles className="w-4 h-4 text-brand-orange flex-shrink-0" />
                <span>
                  {language === "bn"
                    ? "“সব উৎসবের ঠিকানা কুটুমবাড়ি” • জন্মদিন, বিবাহ বার্ষিকী ও ঘরোয়া আয়োজন"
                    : "\"The Destination for All Celebrations\" • Birthdays, Anniversaries & Family Gatherings"}
                </span>
              </div>

              {/* Hero Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <a
                  href="#menu"
                  className="cursor-pointer min-h-[48px] w-full sm:w-auto bg-brand-red hover:bg-brand-red-hover text-white px-8 py-3.5 rounded-full font-bold text-base shadow-glow hover:shadow-lg transition-all duration-300 active:scale-95 flex items-center justify-center gap-2.5 text-center focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2"
                >
                  <Utensils className="w-5 h-5" />
                  <span>{language === "bn" ? "মেনু দেখুন" : "Explore Menu"}</span>
                </a>

                <button
                  type="button"
                  onClick={() => setBookingModalOpen(true)}
                  className="cursor-pointer min-h-[48px] w-full sm:w-auto border-2 border-white/80 hover:border-white hover:bg-white/10 text-white px-8 py-3.5 rounded-full font-semibold text-base transition-all duration-300 active:scale-95 flex items-center justify-center gap-2.5 text-center focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <Calendar className="w-5 h-5 text-amber-300" />
                  <span>{language === "bn" ? "টেবিল বুক করুন" : "Book a Table"}</span>
                </button>
              </div>

              {/* Location micro-proof */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-emerald-200/80">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-red" />
                  <span>মেইন রোড (২য় তলা), রিজার্ভ পুকুর পাড়, ভাণ্ডারিয়া</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-brand-orange" />
                  <span>লাঞ্চ ও ডিনার সার্ভিস</span>
                </div>
              </div>
            </div>

            {/* Right Column: Floating 3D-Style Dish Image */}
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg flex items-center justify-center">
              <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-amber-500/20 via-brand-red/20 to-emerald-400/20 blur-2xl pointer-events-none"></div>

              <div className="relative animate-float w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] md:w-[390px] md:h-[390px] rounded-full p-3 bg-gradient-to-b from-white/20 via-white/5 to-white/10 backdrop-blur-sm shadow-floating border border-white/25">
                <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl ring-4 ring-white/30">
                  <Image
                    src="/images/hero-dish.jpg"
                    alt="Signature Platter at KutumBari Restaurant"
                    fill
                    className="object-cover scale-105 hover:scale-110 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                </div>

                {/* Opening Promo Badge */}
                <div className="absolute -top-2 -right-2 sm:top-2 sm:right-2 bg-brand-red text-white p-3 rounded-2xl shadow-xl flex items-center gap-2 border border-white/30 transform rotate-3">
                  <Percent className="w-5 h-5 text-amber-300" />
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] uppercase font-bold tracking-wider leading-none">
                      Opening Promo
                    </span>
                    <span className="text-sm font-black leading-tight">১৫% ছাড়!</span>
                  </div>
                </div>

                {/* Master Chef Recipe Badge */}
                <div className="absolute -bottom-3 left-2 sm:bottom-2 sm:left-2 bg-white/95 text-brand-charcoal py-2 px-3.5 sm:py-2.5 sm:px-4 rounded-2xl shadow-xl flex items-center gap-2.5 sm:gap-3 border border-gray-100 backdrop-blur-md">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green flex-shrink-0">
                    <ChefHat className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-brand-green-deep">
                      {language === "bn" ? "খাঁটি দেশি ও চাইনিজ" : "Authentic Flavours"}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-gray-500">
                      {language === "bn" ? "সেরা শেফের রেসিপি" : "Master Chef Recipes"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TRUST BADGES ROW (UI/UX Pro Max: 8px minimum touch gap, accessible hover) */}
      <section className="relative z-20 -mt-6 sm:-mt-8 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-card border border-gray-100 p-5 sm:p-7">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: Leaf,
                titleBn: "তাজা উপাদান",
                titleEn: "Fresh Ingredients",
                descBn: "১০০% খাঁটি ও স্বাস্থ্যসম্মত",
                descEn: "100% Pure & Hygienic",
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
              {
                icon: ChefHat,
                titleBn: "দক্ষ কারিগর ও শেফ",
                titleEn: "Expert Chefs",
                descBn: "পরিপাটি ও নিখুঁত রন্ধনশৈলী",
                descEn: "Authentic Culinary Mastery",
                color: "text-brand-orange",
                bg: "bg-orange-50",
              },
              {
                icon: Sparkles,
                titleBn: "মনোরম পরিবেশ",
                titleEn: "Cozy Ambience",
                descBn: "শান্ত, মার্জিত ও পারিবারিক",
                descEn: "Elegant Family Dining",
                color: "text-amber-600",
                bg: "bg-amber-50",
              },
              {
                icon: PartyPopper,
                titleBn: "সব উৎসবের আয়োজন",
                titleEn: "Event Hosting",
                descBn: "সব ধরণের উদযাপনের ঠিকানা",
                descEn: "Birthdays & Gatherings",
                color: "text-brand-red",
                bg: "bg-red-50",
              },
            ].map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center sm:items-start text-center sm:text-left p-3 rounded-xl hover:bg-gray-50/80 transition-colors group cursor-default"
                >
                  <div
                    className={`min-h-[44px] min-w-[44px] w-12 h-12 rounded-2xl ${badge.bg} ${badge.color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-brand-charcoal leading-tight">
                    {language === "bn" ? badge.titleBn : badge.titleEn}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {language === "bn" ? badge.descBn : badge.descEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. ABOUT US / OUR STORY */}
      <section id="about" className="py-16 sm:py-24 bg-brand-cream/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden shadow-card border-4 border-white">
                  <Image
                    src="/images/ambience.jpg"
                    alt="KutumBari Restaurant Ambience"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                      Reserve Pukur Par, Bhandaria
                    </p>
                    <p className="text-lg font-bold font-serif">
                      রিজার্ভ পুকুর পাড়ের মনোরম পরিবেশে আপনার প্রিয় কুটুমবাড়ি
                    </p>
                  </div>
                </div>

                <div className="absolute -bottom-6 -right-2 sm:right-6 bg-white p-4 sm:p-5 rounded-2xl shadow-floating border border-gray-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-red text-white flex items-center justify-center font-bold text-xl font-serif">
                    ১৫%
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">গ্র্যান্ড ওপেনিং অফার</p>
                    <p className="text-sm font-bold text-brand-charcoal">
                      শুভ উদ্বোধন উপলক্ষে ছাড়
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start order-1 lg:order-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-red mb-3">
                <Heart className="w-3.5 h-3.5" />
                {language === "bn" ? "আমাদের গল্প ও দর্শন" : "Our Story & Values"}
              </span>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-brand-green-deep leading-tight mb-5">
                {language === "bn" ? (
                  <>
                    “স্বাদের সাথে ভালোবাসার এক আপন ঠিকানা” —{" "}
                    <span className="text-brand-red">কুটুমবাড়ি</span>
                  </>
                ) : (
                  <>
                    Bringing Genuine Warmth & Culinary Heritage to{" "}
                    <span className="text-brand-red">Bhandaria</span>
                  </>
                )}
              </h2>

              <p className="text-sm sm:text-base text-brand-charcoal/80 leading-relaxed mb-4">
                {language === "bn"
                  ? "ভাণ্ডারিয়ার রিজার্ভ পুকুর পাড়ের মনোরম ২য় তলায় প্রতিষ্ঠিত 'কুটুমবাড়ি রেস্টুরেন্ট'। আমাদের লক্ষ্য কেবল খাবার পরিবেশন নয়, পরিবারের সবাইকে নিয়ে আপনজনের মতো স্বাচ্ছন্দ্যে উপভোগ করার একটি নিখুঁত পরিবেশ উপহার দেওয়া।"
                  : "Located on the 2nd Floor of Reserve Pukur Par, Bhandaria, KutumBari Restaurant was created with a heartfelt vision: good food, genuine hospitality, and memorable celebrations under one roof."}
              </p>

              <p className="text-sm sm:text-base text-brand-charcoal/80 leading-relaxed mb-6">
                {language === "bn"
                  ? "ঐতিহ্যবাহী খাঁটি বাংলা খাবার, মুখের স্বাদে ভরপুর চাইনিজ সিগনেচার ডিশ কিংবা তরুণ প্রজন্মের পছন্দের গরম ক্রিস্পি ফাস্ট-ফুড — সব পাবেন এক ছাদের নিচে শতভাগ স্বাস্থ্যসম্মত উপায়ে।"
                  : "From slow-cooked royal biryanis and authentic Bengali specialties to sizzling wok Chinese and crunchy fast-food favorites — our kitchen crafts every dish with supreme hygiene and love."}
              </p>

              <div className="grid grid-cols-2 gap-4 w-full mb-8">
                <div className="border border-gray-200/80 bg-white p-3.5 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-brand-charcoal">
                      লাঞ্চ ও ডিনার সার্ভিস
                    </h4>
                    <p className="text-[11px] text-gray-500">প্রতিদিন সময়মত পরিবেশন</p>
                  </div>
                </div>

                <div className="border border-gray-200/80 bg-white p-3.5 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-brand-charcoal">
                      ১০০+ অতিথি ধারণক্ষমতা
                    </h4>
                    <p className="text-[11px] text-gray-500">প্রশস্ত ও আরামদায়ক স্পেস</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(true)}
                  className="cursor-pointer min-h-[44px] bg-brand-green-deep hover:bg-brand-green text-white px-6 py-3 rounded-full font-bold text-sm shadow-md transition-all duration-200 active:scale-95 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                >
                  <span>{language === "bn" ? "টেবিল রিজার্ভেশন" : "Reserve a Table"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="tel:01351327933"
                  className="cursor-pointer min-h-[44px] text-brand-red hover:text-brand-red-hover font-bold text-sm flex items-center gap-1.5 underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-brand-red rounded-lg px-2"
                >
                  <Phone className="w-4 h-4" /> 01351327933
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MENU SECTION (UI/UX Pro Max: Full 144-Product Interactive Catalog + 19-Page Authentic Menu Book) */}
      <section id="menu" className="py-16 sm:py-24 bg-brand-cream/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-red mb-2 bg-red-50 border border-brand-red/20 px-3.5 py-1.5 rounded-full">
              <Utensils className="w-3.5 h-3.5" />
              {language === "bn"
                ? "১৪৪ টি খাবারের পূর্ণাঙ্গ মেনু ও অফিশিয়াল বুক"
                : "Full 144-Dish Menu & Official Book"}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-brand-green-deep mb-3 leading-tight">
              {language === "bn"
                ? "কুটুমবাড়ির সম্পূর্ণ মেনু ও খাবার তালিকা"
                : "KutumBari Complete Menu & Dishes"}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              {language === "bn"
                ? "অ্যাপেটাইজার, স্যুপ, কাচ্চি বিরিয়ানি, সিজলিং, চাইনিজ ওক, পিজ্জা, পাস্তা, বার্গার ও খাঁটি বাংলা খাবারের ১৪৪ টি মুখরোচক পদ। যেকোনো খাবারে ক্লিক করে সহজে অর্ডার ও টেবিল বুক করুন।"
                : "Explore authentic Bengali feasts, royal biryani, sizzling meats, wok-fried Chinese, artisan pizzas, and handcrafted beverages. Browse all 144 items with individual pricing."}
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center justify-center mb-8">
            <div className="inline-flex p-1 rounded-2xl bg-white border border-gray-200/80 shadow-sm max-w-md w-full">
              <button
                type="button"
                onClick={() => setActiveMenuTab("catalog")}
                className={`cursor-pointer flex-1 min-h-[46px] py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-red ${
                  activeMenuTab === "catalog"
                    ? "bg-brand-green-deep text-white shadow-md"
                    : "text-gray-600 hover:text-brand-charcoal hover:bg-gray-50"
                }`}
              >
                <Utensils className="w-4 h-4" />
                <span>{language === "bn" ? "খাবার তালিকা (১৪৪ পদ)" : "Full Catalog (144 Items)"}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMenuTab("pages")}
                className={`cursor-pointer flex-1 min-h-[46px] py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-red ${
                  activeMenuTab === "pages"
                    ? "bg-brand-red text-white shadow-md"
                    : "text-gray-600 hover:text-brand-charcoal hover:bg-gray-50"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{language === "bn" ? "অফিশিয়াল মেনু বুক (১৯ পৃষ্ঠা)" : "Printed Book (19 Pages)"}</span>
              </button>
            </div>
          </div>

          {/* TAB 1: 144-PRODUCT INTERACTIVE CATALOG */}
          {activeMenuTab === "catalog" && (
            <div className="space-y-6 sm:space-y-8 animate-fadeIn">
              {/* Search & Quick Filter Controls */}
              <div className="max-w-2xl mx-auto space-y-3">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={catalogSearchQuery}
                    onChange={(e) => {
                      setCatalogSearchQuery(e.target.value);
                      setVisibleProductCount(24);
                    }}
                    placeholder={
                      language === "bn"
                        ? "খাবার বা মেনু খুঁজুন (যেমন: Wonton, বিরিয়ানি, কালা ভুনা, Pizza, Burger, স্যুপ, কফি)..."
                        : "Search 144 dishes (e.g. Wonton, Biryani, Kala Bhuna, Pizza, Burger, Soup, Coffee)..."
                    }
                    className="w-full pl-12 pr-10 py-3.5 bg-white rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green text-sm text-brand-charcoal transition-all placeholder:text-gray-400 min-h-[48px]"
                  />
                  {catalogSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setCatalogSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 min-h-[36px] min-w-[36px] flex items-center justify-center text-gray-400 hover:text-brand-charcoal rounded-full"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Filter Row: Stats + Quick Filters */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
                  <span className="font-semibold text-gray-600">
                    {language === "bn"
                      ? `${filteredCatalogProducts.length} টি খাবার প্রদর্শিত (মোট ১৪৪ টি)`
                      : `Showing ${filteredCatalogProducts.length} of 144 dishes`}
                  </span>

                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {[
                      { id: "all", labelBn: "সব", labelEn: "All" },
                      { id: "special", labelBn: "⭐ স্পেশাল", labelEn: "Special" },
                      { id: "under200", labelBn: "৳২০০ এর নিচে", labelEn: "< ৳200" },
                      { id: "under400", labelBn: "৳৪০০ এর নিচে", labelEn: "< ৳400" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          setCatalogPriceFilter(f.id as any);
                          setVisibleProductCount(24);
                        }}
                        className={`cursor-pointer min-h-[44px] px-3.5 py-2 rounded-full font-bold text-xs transition-all flex items-center justify-center ${
                          catalogPriceFilter === f.id
                            ? "bg-brand-green-deep text-white shadow-xs"
                            : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {language === "bn" ? f.labelBn : f.labelEn}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 18-Category Navigation Carousel (Touch-friendly & Smooth) */}
              <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 no-scrollbar max-w-full justify-start">
                {/* All Items Pill */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCatalogCategory("all");
                    setVisibleProductCount(24);
                  }}
                  className={`cursor-pointer min-h-[44px] px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex-shrink-0 transition-all duration-200 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-brand-green ${
                    selectedCatalogCategory === "all"
                      ? "bg-brand-green-deep text-white shadow-md scale-105"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  <span>🍽️</span>
                  <span>{language === "bn" ? "সকল ক্যাটাগরি" : "All Categories"}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      selectedCatalogCategory === "all"
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    144
                  </span>
                </button>

                {CATALOG_CATEGORIES.map((cat) => {
                  const isActive = selectedCatalogCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => {
                        setSelectedCatalogCategory(cat.key);
                        setVisibleProductCount(24);
                      }}
                      className={`cursor-pointer min-h-[44px] px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex-shrink-0 transition-all duration-200 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-brand-green ${
                        isActive
                          ? "bg-brand-green-deep text-white shadow-md scale-105"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{language === "bn" ? cat.nameBn : cat.nameEn}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {cat.itemCount}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* 144 Products Grid */}
              {filteredCatalogProducts.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center max-w-md mx-auto border border-gray-100 shadow-sm">
                  <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h4 className="font-serif font-bold text-lg text-brand-charcoal mb-1">
                    {language === "bn" ? "কোনো খাবার পাওয়া যায়নি" : "No matching dishes"}
                  </h4>
                  <p className="text-xs text-gray-500 mb-4">
                    {language === "bn"
                      ? "অনুগ্রহ করে অন্য শব্দ দিয়ে অনুসন্ধান করুন বা সব খাবার নির্বাচন করুন।"
                      : "Try a different search keyword or clear filters."}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCatalogSearchQuery("");
                      setSelectedCatalogCategory("all");
                      setCatalogPriceFilter("all");
                    }}
                    className="cursor-pointer min-h-[44px] bg-brand-green-deep text-white px-5 py-2 rounded-xl text-xs font-bold"
                  >
                    {language === "bn" ? "সব খাবার দেখুন" : "View All Dishes"}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                  {filteredCatalogProducts.slice(0, visibleProductCount).map((prod) => {
                    const selectedIdx = selectedPortions[prod.id] ?? 0;
                    const activePortion = prod.portions[selectedIdx] || prod.portions[0];
                    const activePriceDisplay =
                      prod.portions.length > 1 && activePortion && activePortion.price > 0
                        ? `৳${activePortion.price}`
                        : prod.priceDisplay;

                    return (
                      <div
                        key={prod.id}
                        className="bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-subtle hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
                      >
                        {/* Top: Image + Badges */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 group/img">
                          <Image
                            src={prod.image}
                            alt={`${prod.nameBn} - ${prod.nameEn}`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none"></div>

                          {/* Top-Left Category Badge */}
                          <span className="absolute top-3 left-3 bg-white/95 text-brand-green-deep text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm capitalize backdrop-blur-sm flex items-center gap-1">
                            <span>{prod.categoryIcon}</span>
                            <span>{language === "bn" ? prod.categoryNameBn : prod.categoryNameEn}</span>
                          </span>

                          {/* Top-Right Badge */}
                          {prod.badge && (
                            <span className="absolute top-3 right-3 bg-brand-red text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                              {prod.badge}
                            </span>
                          )}

                          {/* Price Tag (Over Image) */}
                          <div className="absolute bottom-3 right-3 bg-brand-red text-white font-extrabold text-sm sm:text-base px-3 py-1 rounded-xl shadow-md backdrop-blur-xs">
                            {activePriceDisplay}
                          </div>
                        </div>

                        {/* Middle: Content & Portions */}
                        <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between bg-white">
                          <div>
                            <h3 className="font-serif font-bold text-base sm:text-lg text-brand-charcoal group-hover:text-brand-green-deep transition-colors leading-snug line-clamp-1 mb-0.5">
                              {language === "bn" ? prod.nameBn : prod.nameEn}
                            </h3>
                            <p className="text-xs text-brand-orange font-semibold mb-2 line-clamp-1">
                              {prod.nameEn}
                            </p>
                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                              {language === "bn" ? prod.descriptionBn : prod.descriptionEn}
                            </p>

                            {/* Portion Selector Pills (if multiple options) */}
                            {prod.portions.length > 1 && (
                              <div className="mb-3 pt-2 border-t border-gray-100">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
                                  {language === "bn" ? "সাইজ / অংশ বেছে নিন:" : "Select Portion:"}
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {prod.portions.map((portion, pIdx) => {
                                    const isSelected = selectedIdx === pIdx;
                                    return (
                                       <button
                                        key={pIdx}
                                        type="button"
                                        onClick={() => handleSelectPortion(prod.id, pIdx)}
                                        className={`cursor-pointer min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                                          isSelected
                                            ? "bg-brand-green-deep text-white shadow-xs scale-102"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                      >
                                        <span>{portion.name}</span>
                                        <span className="opacity-80 ml-1">
                                          {portion.price > 0 ? `৳${portion.price}` : ""}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Bottom Action Row (Touch target compliant >= 44x44px) */}
                          <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOrderProduct(prod)}
                              className="cursor-pointer min-h-[44px] flex-1 bg-brand-red hover:bg-brand-red-hover text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-brand-red"
                            >
                              <Calendar className="w-4 h-4" />
                              <span>{language === "bn" ? "অর্ডার / বুকিং" : "Order / Book"}</span>
                            </button>

                            <a
                              href="tel:01351327933"
                              className="cursor-pointer min-h-[44px] min-w-[44px] w-11 h-11 bg-brand-green-surface hover:bg-emerald-100 text-brand-green-deep rounded-xl flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green"
                              title="কল করুন (01351327933)"
                              aria-label={`Call to order ${prod.nameEn}`}
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Load More / Show All Controls */}
              {filteredCatalogProducts.length > visibleProductCount && (
                <div className="text-center pt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setVisibleProductCount((prev) => prev + 24)}
                    className="cursor-pointer min-h-[46px] px-6 py-2.5 rounded-full bg-brand-green-deep hover:bg-brand-green text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
                  >
                    <span>{language === "bn" ? "আরো ২৪ টি খাবার দেখুন" : "Load 24 More Dishes"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setVisibleProductCount(filteredCatalogProducts.length)}
                    className="cursor-pointer min-h-[46px] px-5 py-2.5 rounded-full bg-white hover:bg-gray-100 text-brand-charcoal border border-gray-300 font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95"
                  >
                    <span>{language === "bn" ? `সবগুলো (${filteredCatalogProducts.length}) একসাথে দেখুন` : `Show All (${filteredCatalogProducts.length})`}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: 19-PAGE AUTHENTIC PRINTED MENU BOOK */}
          {activeMenuTab === "pages" && (
            <div className="space-y-8 animate-fadeIn">
              {/* Search Bar & Stats */}
              <div className="max-w-xl mx-auto">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={menuSearchQuery}
                    onChange={(e) => setMenuSearchQuery(e.target.value)}
                    placeholder={
                      language === "bn"
                        ? "মেনু পেজ খুঁজুন (যেমন: পৃষ্ঠা ১, কালা ভুনা, Biryani, Pizza, Wonton, Coffee)..."
                        : "Search menu pages (e.g. Page 1, Kala Bhuna, Biryani, Pizza, Wonton)..."
                    }
                    className="w-full pl-12 pr-10 py-3.5 bg-white rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green text-sm text-brand-charcoal transition-all placeholder:text-gray-400 min-h-[48px]"
                  />
                  {menuSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setMenuSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 min-h-[36px] min-w-[36px] flex items-center justify-center text-gray-400 hover:text-brand-charcoal rounded-full"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-2 px-1">
                  <span>
                    {language === "bn"
                      ? `${filteredMenuPages.length} টি মেনু পেজ প্রদর্শিত`
                      : `Showing ${filteredMenuPages.length} menu pages`}
                  </span>
                  <span className="text-brand-red font-medium">
                    {language === "bn" ? "ট্যাপ করে ফুল-স্ক্রিন দেখুন" : "Tap page to view full size"}
                  </span>
                </div>
              </div>

              {/* Category Filter Pills for Menu Book */}
              <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 no-scrollbar max-w-full justify-start md:justify-center">
                {PRINTED_MENU_CATEGORIES.map((cat) => {
                  const isActive = activePageCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setActivePageCategory(cat.id);
                        setMenuSearchQuery("");
                      }}
                      className={`cursor-pointer min-h-[44px] px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex-shrink-0 transition-all duration-200 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-brand-green ${
                        isActive
                          ? "bg-brand-green-deep text-white shadow-md scale-105"
                          : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      <span>{language === "bn" ? cat.labelBn : cat.labelEn}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Menu Pages Grid */}
              {filteredMenuPages.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center max-w-md mx-auto border border-gray-100 shadow-sm">
                  <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h4 className="font-serif font-bold text-lg text-brand-charcoal mb-1">
                    {language === "bn" ? "কোনো মেনু পেজ পাওয়া যায়নি" : "No matching menu pages"}
                  </h4>
                  <p className="text-xs text-gray-500 mb-4">
                    {language === "bn"
                      ? "অনুগ্রহ করে অন্য শব্দ দিয়ে অনুসন্ধান করুন বা সব মেনু সিলেক্ট করুন।"
                      : "Try a different search keyword or switch category."}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuSearchQuery("");
                      setActivePageCategory("all");
                    }}
                    className="cursor-pointer min-h-[44px] bg-brand-green-deep text-white px-5 py-2 rounded-xl text-xs font-bold"
                  >
                    সব মেনু দেখুন
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredMenuPages.map((page) => (
                    <div
                      key={page.id}
                      className="bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-subtle hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
                    >
                      {/* Top Header of Card */}
                      <div className="p-3.5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-center gap-2">
                          <span className="bg-brand-green-deep text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-xs">
                            {language === "bn" ? `পৃষ্ঠা ${page.pageNum}` : `Page ${page.pageNum}`}
                          </span>
                          <span className="text-[11px] font-bold text-brand-green-deep line-clamp-1">
                            {language === "bn" ? page.categoryLabelBn : page.categoryLabelEn}
                          </span>
                        </div>
                        <span className="text-[10px] bg-red-50 text-brand-red font-bold px-2 py-0.5 rounded-full border border-brand-red/15">
                          {language === "bn" ? page.badgeBn : page.badgeEn}
                        </span>
                      </div>

                      {/* Menu Page Image Thumbnail */}
                      <div
                        onClick={() => handleOpenPageModal(page)}
                        className="relative aspect-[1132/1600] w-full overflow-hidden bg-gray-100 cursor-pointer group/img"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") handleOpenPageModal(page);
                        }}
                        aria-label={`Open menu page ${page.pageNum} full screen`}
                      >
                        <Image
                          src={page.imageThumb}
                          alt={`${page.titleBn} - KutumBari Restaurant Menu Page ${page.pageNum}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover object-top transition-transform duration-500 group-hover/img:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                          <span className="min-h-[44px] px-4 py-2 rounded-full bg-brand-red text-white text-xs font-bold shadow-lg flex items-center gap-1.5 active:scale-95 transition-transform">
                            <Maximize2 className="w-4 h-4" />
                            {language === "bn" ? "বড় করে দেখুন (Zoom)" : "View Full Size"}
                          </span>
                        </div>
                        {/* Mobile Tap Hint badge */}
                        <div className="sm:hidden absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-lg flex items-center gap-1">
                          <Eye className="w-3 h-3 text-amber-300" />
                          <span>ট্যাপ করুন</span>
                        </div>
                      </div>

                      {/* Card Content & Details */}
                      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between bg-white">
                        <div>
                          <h3 className="font-serif font-bold text-base sm:text-lg text-brand-charcoal group-hover:text-brand-green-deep transition-colors leading-tight mb-1">
                            {language === "bn" ? page.titleBn : page.titleEn}
                          </h3>
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                            {language === "bn" ? page.descriptionBn : page.descriptionEn}
                          </p>

                          {/* Quick Dish Tags */}
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {page.highlightItems.slice(0, 3).map((dish, dIdx) => (
                              <span
                                key={dIdx}
                                className="text-[11px] bg-brand-green-surface text-brand-green-deep px-2 py-0.5 rounded-md font-medium border border-brand-green/10"
                              >
                                {dish}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Card Action Buttons (Min 44x44 touch targets) */}
                        <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenPageModal(page)}
                            className="cursor-pointer min-h-[44px] text-xs font-bold text-brand-green-deep bg-brand-green-surface hover:bg-brand-green hover:text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-brand-green"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{language === "bn" ? "বড় করুন" : "Expand"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOrderDish(page.titleBn)}
                            className="cursor-pointer min-h-[44px] text-xs font-bold text-white bg-brand-red hover:bg-brand-red-hover rounded-xl shadow-xs transition-all duration-200 flex items-center justify-center gap-1 active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-red"
                          >
                            <span>{language === "bn" ? "অর্ডার/বুক" : "Order/Book"}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Grand Opening Promo Banner */}
          <div className="mt-12 p-4 sm:p-6 rounded-2xl bg-brand-green-surface border border-brand-green/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-green/20 text-brand-green flex items-center justify-center flex-shrink-0">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base text-brand-green-deep">
                  শুভ উদ্বোধন উপলক্ষে সকল মেনুতে ১৫% ছাড়!
                </h4>
                <p className="text-xs text-gray-600">
                  পরিবার ও বন্ধুদের নিয়ে আজই ঘুরে আসুন এবং উপভোগ করুন সেরা অফার।
                </p>
              </div>
            </div>
            <a
              href="tel:01351327933"
              className="cursor-pointer min-h-[44px] bg-brand-red hover:bg-brand-red-hover text-white px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center gap-2 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2"
            >
              <Phone className="w-4 h-4" /> কল করুন: 01351327933
            </a>
          </div>
        </div>
      </section>

      {/* 7. EVENT HOSTING (UI/UX Pro Max: Tab state, clear benefits) */}
      <section id="events" className="py-16 sm:py-24 bg-brand-green-deep text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-300 mb-2">
              <PartyPopper className="w-3.5 h-3.5" />
              {language === "bn" ? "উৎসব ও পার্টি স্পেস" : "Celebrate With Us"}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-white mb-3">
              সব উৎসবের ঠিকানা কুটুমবাড়ি
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/80">
              {language === "bn"
                ? "যেকোনো বিশেষ দিনকে আরও বর্ণাঢ্য ও স্মরণীয় করতে আমাদের সুসজ্জিত স্পেস রয়েছে আপনার অপেক্ষায়।"
                : "A premium event destination for family milestones, joyful celebrations, and official meetings."}
            </p>
          </div>

          {/* Event Category Tabs */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10 overflow-x-auto py-2 no-scrollbar max-w-full">
            {EVENTS.map((event, idx) => (
              <button
                key={event.id}
                type="button"
                onClick={() => setActiveEventIndex(idx)}
                className={`cursor-pointer min-h-[44px] px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 flex-shrink-0 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-300 ${
                  activeEventIndex === idx
                    ? "bg-brand-red text-white shadow-lg scale-105"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                <span>{language === "bn" ? event.titleBn : event.titleEn}</span>
              </button>
            ))}
          </div>

          {/* Active Event Showcase */}
          <div className="bg-white/5 border border-white/15 rounded-3xl p-6 sm:p-10 backdrop-blur-md">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
                <Image
                  src={EVENTS[activeEventIndex].image}
                  alt={EVENTS[activeEventIndex].titleEn}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="bg-brand-orange text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {EVENTS[activeEventIndex].titleEn}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-white mt-1">
                    {EVENTS[activeEventIndex].titleBn}
                  </h3>
                </div>
              </div>

              <div className="flex flex-col items-start">
                <span className="text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                  Event Hall & Catering Support
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white mb-4">
                  {language === "bn"
                    ? EVENTS[activeEventIndex].titleBn
                    : EVENTS[activeEventIndex].titleEn}
                </h3>
                <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed mb-6">
                  {language === "bn"
                    ? EVENTS[activeEventIndex].descriptionBn
                    : EVENTS[activeEventIndex].descriptionEn}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-8">
                  {EVENTS[activeEventIndex].features.map((feat, fIdx) => (
                    <div
                      key={fIdx}
                      className="flex items-center gap-2.5 bg-white/10 px-3.5 py-2.5 rounded-xl border border-white/10"
                    >
                      <CheckCircle2 className="w-4 h-4 text-amber-300 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-white">{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        occasion: EVENTS[activeEventIndex].titleBn,
                      }));
                      setBookingModalOpen(true);
                    }}
                    className="cursor-pointer min-h-[48px] w-full sm:w-auto bg-brand-red hover:bg-brand-red-hover text-white px-7 py-3.5 rounded-full font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>ইভেন্ট স্পেস বুক করুন</span>
                  </button>

                  <a
                    href="tel:01760780000"
                    className="cursor-pointer min-h-[48px] w-full sm:w-auto text-emerald-200 hover:text-white border border-white/20 hover:border-white px-5 py-3 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <Phone className="w-4 h-4 text-amber-300" />
                    <span>হেল্পলাইন: 01760780000</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. LOCATION & CONTACT (UI/UX Pro Max: Crisp cards, verified contrast) */}
      <section id="location" className="py-16 sm:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-brand-red mb-2">
              <MapPin className="w-3.5 h-3.5" />
              {language === "bn" ? "ঠিকানা ও যোগাযোগের বিবরণ" : "Location & Contact"}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-brand-green-deep mb-3">
              {language === "bn" ? "সহজেই খুঁজে নিন কুটুমবাড়ি" : "Visit KutumBari in Bhandaria"}
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              {language === "bn"
                ? "ভাণ্ডারিয়ার প্রাণকেন্দ্রে রিজার্ভ পুকুর পাড় মেইন রোডের ২য় তলায় আমাদের অবস্থান।"
                : "Centrally located on Main Road (2nd Floor), overlooking Reserve Pukur Par, Bhandaria."}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Contact Cards */}
            <div className="lg:col-span-5 flex flex-col space-y-4">
              <div className="bg-brand-cream/80 p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-subtle flex items-start gap-4">
                <div className="min-h-[44px] min-w-[44px] w-12 h-12 rounded-2xl bg-brand-red text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-brand-charcoal mb-1">
                    রেস্টুরেন্ট লোকেশন (Address)
                  </h3>
                  <p className="text-sm font-semibold text-brand-green-deep">
                    মেইন রোড (২য় তলা), রিজার্ভ পুকুর পাড়, ভাণ্ডারিয়া
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Main Road (2nd Floor), Reserve Pukur Par, Bhandaria
                  </p>
                  <span className="inline-block mt-2 text-[11px] font-bold text-brand-orange bg-orange-50 px-2 py-0.5 rounded">
                    📍 ল্যান্ডমার্ক: রিজার্ভ পুকুর পাড়
                  </span>
                </div>
              </div>

              <div className="bg-brand-cream/80 p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-subtle flex items-start gap-4">
                <div className="min-h-[44px] min-w-[44px] w-12 h-12 rounded-2xl bg-brand-green text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="w-full">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-brand-charcoal mb-1">
                    সরাসরি কল করুন (Phone Numbers)
                  </h3>
                  <p className="text-xs text-gray-500 mb-3">যেকোনো প্রশ্ন বা টেবিল বুকিংয়ের জন্য:</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <a
                      href="tel:01351327933"
                      className="cursor-pointer min-h-[44px] bg-white border border-brand-green/30 text-brand-green-deep hover:bg-brand-green hover:text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                    >
                      <Phone className="w-3.5 h-3.5 text-brand-red" />
                      <span>01351327933</span>
                    </a>
                    <a
                      href="tel:01760780000"
                      className="cursor-pointer min-h-[44px] bg-white border border-brand-green/30 text-brand-green-deep hover:bg-brand-green hover:text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
                    >
                      <Phone className="w-3.5 h-3.5 text-brand-orange" />
                      <span>01760780000</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-brand-cream/80 p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-subtle flex items-start gap-4">
                <div className="min-h-[44px] min-w-[44px] w-12 h-12 rounded-2xl bg-brand-orange text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-brand-charcoal mb-1">
                    সার্ভিস সময় (Service Hours)
                  </h3>
                  <div className="space-y-1.5 text-xs sm:text-sm text-brand-charcoal font-medium">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-brand-green">লাঞ্চ (Lunch):</span>
                      <span>দুপুর ১২:০০ PM – বিকাল ০৪:০০ PM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-brand-red">ডিনার (Dinner):</span>
                      <span>সন্ধ্যা ০৬:৩০ PM – রাত ১১:০০ PM</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-2">
                    সপ্তাহের ৭ দিনই আপনার সেবায় খোলা
                  </p>
                </div>
              </div>
            </div>

            {/* Right Map Visual Card */}
            <div className="lg:col-span-7 bg-brand-green-surface rounded-3xl p-6 sm:p-8 border border-brand-green/20 shadow-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 bg-brand-green/10 text-brand-green text-xs font-bold px-3 py-1 rounded-full">
                    <MapPin className="w-3.5 h-3.5" /> ভাণ্ডারিয়া রিজার্ভ পুকুর পাড়
                  </span>
                  <span className="text-xs font-semibold text-gray-500">২য় তলা (2nd Floor)</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-serif text-brand-green-deep mb-2">
                  ভাণ্ডারিয়া মেইন রোড থেকে কীভাবে আসবেন?
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                  ভাণ্ডারিয়া বাজারের প্রধান সড়ক ধরে রিজার্ভ পুকুর পাড় সংলগ্ন ভবনে আসুন। সিঁড়ি দিয়ে ২য় তলায় উঠলেই পেয়ে যাবেন কুটুমবাড়ি রেস্টুরেন্টের মনোমুগ্ধকর পরিবেশ।
                </p>

                <div className="relative h-60 sm:h-72 w-full rounded-2xl overflow-hidden border border-brand-green/20 bg-emerald-950 p-6 flex flex-col items-center justify-center text-center shadow-inner group">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

                  <div className="relative z-10 flex flex-col items-center">
                    <div className="relative w-16 h-16 rounded-full bg-brand-red text-white flex items-center justify-center shadow-glow">
                      <span className="absolute w-full h-full rounded-full bg-brand-red/40 animate-ping"></span>
                      <MapPin className="w-8 h-8 fill-white relative z-10" />
                    </div>
                    <div className="mt-3 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-gray-200">
                      <p className="font-bold text-sm text-brand-green-deep">
                        কুটুমবাড়ি রেস্টুরেন্ট
                      </p>
                      <p className="text-[11px] text-gray-600">
                        রিজারার্ভ পুকুর পাড় (২য় তলা), ভাণ্ডারিয়া
                      </p>
                    </div>
                  </div>

                  <p className="relative z-10 text-emerald-200 text-xs mt-4 max-w-sm">
                    পুকুর পাড়ের প্রাকৃতিক নির্মল বাতাস আর খোলামেলা মনোরম দৃশ্য
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href="https://maps.google.com/?q=Bhandaria+Pirojpur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer min-h-[44px] w-full sm:w-auto bg-brand-green hover:bg-brand-green-deep text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-green"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>গুগল ম্যাপে দেখুন (Open Maps)</span>
                </a>

                <a
                  href="https://wa.me/8801351327933?text=Hello%20KutumBari%20Restaurant,%20I%20want%20to%20know%20more%20details"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer min-h-[44px] w-full sm:w-auto bg-[#25D366] hover:bg-[#1EBE5D] text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>হোয়াটসঅ্যাপ মেসেজ</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-brand-green-dark text-white pt-16 pb-28 md:pb-12 border-t border-brand-green/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white p-0.5 shadow-md ring-2 ring-brand-red">
                  <Image
                    src="/logo.jpg"
                    alt="KutumBari Restaurant Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">
                    কুটুমবাড়ি <span className="text-brand-red">রেস্টুরেন্ট</span>
                  </h3>
                  <p className="text-[10px] text-amber-300 font-medium uppercase tracking-wider">
                    Good Food Together
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed mb-4">
                “স্বাদের সাথে ভালোবাসার এক আপন ঠিকানা” — ভাণ্ডারিয়ার সেরা বাংলা, চাইনিজ ও ফাস্ট-ফুড ডাইনিং।
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold">
                <span>সব উৎসবের ঠিকানা কুটুমবাড়ি</span>
              </div>
            </div>

            <div>
              <h4 className="font-serif font-bold text-base text-white mb-4 border-b border-white/10 pb-2">
                কুইক লিঙ্কস (Quick Links)
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-emerald-100/80">
                <li>
                  <a href="#home" className="cursor-pointer hover:text-amber-300 transition-colors flex items-center gap-1.5 min-h-[44px]">
                    <ChevronRight className="w-3.5 h-3.5 text-brand-red" /> হোম (Home)
                  </a>
                </li>
                <li>
                  <a href="#menu" className="cursor-pointer hover:text-amber-300 transition-colors flex items-center gap-1.5 min-h-[44px]">
                    <ChevronRight className="w-3.5 h-3.5 text-brand-red" /> খাবারের মেনু (Menu)
                  </a>
                </li>
                <li>
                  <a href="#events" className="cursor-pointer hover:text-amber-300 transition-colors flex items-center gap-1.5 min-h-[44px]">
                    <ChevronRight className="w-3.5 h-3.5 text-brand-red" /> উৎসবের আয়োজন (Events)
                  </a>
                </li>
                <li>
                  <a href="#about" className="cursor-pointer hover:text-amber-300 transition-colors flex items-center gap-1.5 min-h-[44px]">
                    <ChevronRight className="w-3.5 h-3.5 text-brand-red" /> আমাদের গল্প (Our Story)
                  </a>
                </li>
                <li>
                  <a href="#location" className="cursor-pointer hover:text-amber-300 transition-colors flex items-center gap-1.5 min-h-[44px]">
                    <ChevronRight className="w-3.5 h-3.5 text-brand-red" /> ঠিকানা ও ম্যাপ (Location)
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif font-bold text-base text-white mb-4 border-b border-white/10 pb-2">
                পরিষেবা ও সময়সূচি
              </h4>
              <div className="space-y-3 text-xs sm:text-sm text-emerald-100/80">
                <div>
                  <span className="font-bold text-amber-300 block">লাঞ্চ সার্ভিস:</span>
                  <span>১২:০০ PM - ০৪:০০ PM</span>
                </div>
                <div>
                  <span className="font-bold text-amber-300 block">ডিনার সার্ভিস:</span>
                  <span>০৬:৩০ PM - ১১:০০ PM</span>
                </div>
                <div className="pt-2 border-t border-white/10">
                  <span className="font-bold text-white block mb-1">কুইজিন ক্যাটাগরি:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="bg-white/10 px-2 py-0.5 rounded text-[11px]">বাংলা</span>
                    <span className="bg-white/10 px-2 py-0.5 rounded text-[11px]">চাইনিজ</span>
                    <span className="bg-white/10 px-2 py-0.5 rounded text-[11px]">ফাস্ট-ফুড</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-serif font-bold text-base text-white mb-4 border-b border-white/10 pb-2">
                যোগাযোগের তথ্য
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-emerald-100/80">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-brand-red flex-shrink-0 mt-0.5" />
                  <span>মেইন রোড (২য় তলা), রিজার্ভ পুকুর পাড়, ভাণ্ডারিয়া</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand-orange flex-shrink-0" />
                  <a href="tel:01351327933" className="cursor-pointer hover:text-white font-bold min-h-[44px] flex items-center">
                    01351327933
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand-orange flex-shrink-0" />
                  <a href="tel:01760780000" className="cursor-pointer hover:text-white font-bold min-h-[44px] flex items-center">
                    01760780000
                  </a>
                </li>
              </ul>

              <div className="mt-5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(true)}
                  className="cursor-pointer min-h-[44px] w-full bg-brand-red hover:bg-brand-red-hover text-white py-2.5 px-4 rounded-xl font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>অনলাইন টেবিল বুকিং</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-200/60 text-center sm:text-left">
            <p>© {new Date().getFullYear()} KutumBari Restaurant. সর্বস্বত্ব সংরক্ষিত।</p>
            <p className="flex items-center gap-1 justify-center">
              Made with <Heart className="w-3.5 h-3.5 text-brand-red fill-brand-red" /> for Bhandaria
            </p>
          </div>
        </div>
      </footer>

      {/* 10. STICKY MOBILE ACTION BAR */}
      <div className="block md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-2.5 shadow-[0_-4px_25px_rgba(0,0,0,0.12)] pb-safe">
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
          <a
            href="tel:01351327933"
            className="cursor-pointer min-h-[48px] bg-brand-green-surface border-2 border-brand-green/30 text-brand-green-deep hover:bg-brand-green hover:text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-green"
          >
            <Phone className="w-4 h-4 text-brand-green" />
            <span>কল করুন (Call)</span>
          </a>

          <button
            type="button"
            onClick={() => setBookingModalOpen(true)}
            className="cursor-pointer min-h-[48px] bg-brand-red hover:bg-brand-red-hover text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-md shadow-brand-red/30 focus:outline-none focus:ring-2 focus:ring-brand-red"
          >
            <Calendar className="w-4 h-4" />
            <span>টেবিল বুকিং</span>
          </button>
        </div>
      </div>

      {/* 11. TABLE RESERVATION MODAL (UI/UX Pro Max: Explicit labels, accessible IDs, clear focus) */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-h-[92vh] flex flex-col">
            <div className="bg-brand-green-deep text-white p-5 sm:p-6 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-amber-300">
                  KutumBari Reservation
                </span>
                <h3 className="font-serif font-bold text-xl sm:text-2xl mt-0.5">
                  টেবিল বুকিং ফরম (Book a Table)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setBookingModalOpen(false)}
                className="cursor-pointer min-h-[44px] min-w-[44px] w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close reservation modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto">
              {bookingSuccess ? (
                <div className="py-10 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="font-serif font-bold text-2xl text-brand-green-deep mb-2">
                    বুকিং সফলভাবে সম্পন্ন হয়েছে!
                  </h4>
                  <p className="text-sm text-gray-600 max-w-sm mb-4">
                    ধন্যবাদ, {formData.name}। আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।
                  </p>
                  <p className="text-xs text-brand-orange font-semibold">
                    জরুরি প্রয়োজনে কল করুন: 01351327933
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="customer-name" className="block text-xs font-bold text-brand-charcoal mb-1">
                      আপনার নাম (Your Name) *
                    </label>
                    <input
                      id="customer-name"
                      type="text"
                      name="name"
                      required
                      placeholder="যেমন: মোঃ রফিকুল ইসলাম"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="min-h-[44px] w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-red text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="customer-phone" className="block text-xs font-bold text-brand-charcoal mb-1">
                      মোবাইল নম্বর (Phone Number) *
                    </label>
                    <input
                      id="customer-phone"
                      type="tel"
                      name="phone"
                      required
                      placeholder="01XXXXXXXXX"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="min-h-[44px] w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-red text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="guest-count" className="block text-xs font-bold text-brand-charcoal mb-1">
                        অতিথি সংখ্যা (Guests)
                      </label>
                      <select
                        id="guest-count"
                        name="guests"
                        value={formData.guests}
                        onChange={handleInputChange}
                        className="cursor-pointer min-h-[44px] w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-red text-sm bg-white"
                      >
                        <option value="1">১ জন (1 Person)</option>
                        <option value="2">২ জন (2 Persons)</option>
                        <option value="4">৪ জন (4 Persons)</option>
                        <option value="6">৬ জন (6 Persons)</option>
                        <option value="10+">১০+ জন (Family / Party)</option>
                        <option value="25+">২৫+ জন (Event / Seminar)</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="time-slot" className="block text-xs font-bold text-brand-charcoal mb-1">
                        সময়সূচি (Time Slot)
                      </label>
                      <select
                        id="time-slot"
                        name="timeSlot"
                        value={formData.timeSlot}
                        onChange={handleInputChange}
                        className="cursor-pointer min-h-[44px] w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-red text-sm bg-white"
                      >
                        <option value="Lunch (১২:০০ PM - ৪:০০ PM)">
                          লাঞ্চ (Lunch: ১২:০০ - ৪:০০)
                        </option>
                        <option value="Dinner (৬:৩০ PM - ১১:০০ PM)">
                          ডিনার (Dinner: ৬:৩০ - ১১:০০)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="occasion-type" className="block text-xs font-bold text-brand-charcoal mb-1">
                      অনুষ্ঠানের ধরণ (Occasion)
                    </label>
                    <select
                      id="occasion-type"
                      name="occasion"
                      value={formData.occasion}
                      onChange={handleInputChange}
                      className="cursor-pointer min-h-[44px] w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-red text-sm bg-white"
                    >
                      <option value="Dine-in / সাধারণ ভোজন">সাধারণ ভোজন (Casual Dine-in)</option>
                      <option value="জন্মদিনের আয়োজন">জন্মদিনের আয়োজন (Birthday Party)</option>
                      <option value="বিবাহ বার্ষিকী">বিবাহ বার্ষিকী (Wedding Anniversary)</option>
                      <option value="মিটিং ও সেমিনার">মিটিং ও সেমিনার (Meeting / Seminar)</option>
                      <option value="ঘরোয়া অনুষ্ঠান">ঘরোয়া অনুষ্ঠান (Family Get-together)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="special-notes" className="block text-xs font-bold text-brand-charcoal mb-1">
                      বিশেষ কোনো চাওয়া বা পছন্দ (Special Requests)
                    </label>
                    <textarea
                      id="special-notes"
                      name="notes"
                      rows={2}
                      placeholder="নির্দিষ্ট আসন, কেক ডেকোরেশন বা পছন্দের খাবার..."
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-red text-sm"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="cursor-pointer min-h-[48px] w-full bg-brand-red hover:bg-brand-red-hover text-white py-3.5 px-6 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>বুকিং নিশ্চিত করুন (Confirm Booking)</span>
                    </button>
                    <p className="text-[11px] text-gray-500 text-center mt-2">
                      বুকিং কনফার্মেশনের জন্য কোনো অগ্রিম ফি লাগবে না।
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 12. FULLSCREEN MOBILE-OPTIMIZED MENU VIEWER MODAL */}
      {selectedMenuPage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-label={`Menu page ${selectedMenuPage.pageNum}`}
        >
          {/* Lightbox Top Control Bar */}
          <div className="p-3 sm:p-4 bg-black/60 border-b border-white/10 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <span className="bg-brand-red text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                {language === "bn"
                  ? `পৃষ্ঠা ${selectedMenuPage.pageNum} / ১৯`
                  : `Page ${selectedMenuPage.pageNum} of 19`}
              </span>
              <div className="hidden sm:block">
                <h4 className="text-white text-sm font-bold font-serif line-clamp-1">
                  {language === "bn" ? selectedMenuPage.titleBn : selectedMenuPage.titleEn}
                </h4>
                <p className="text-[11px] text-emerald-200/70">
                  {selectedMenuPage.categoryLabelBn}
                </p>
              </div>
            </div>

            {/* Zoom Controls & Close Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleZoomToggle}
                className="cursor-pointer min-h-[44px] px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                title="Toggle Zoom"
                aria-label="Toggle Zoom"
              >
                {zoomLevel === 1 ? (
                  <>
                    <ZoomIn className="w-4 h-4" />
                    <span>১.৫x জুম</span>
                  </>
                ) : zoomLevel === 1.5 ? (
                  <>
                    <ZoomIn className="w-4 h-4" />
                    <span>২x জুম</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    <span>রিসেট</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleClosePageModal}
                className="cursor-pointer min-h-[44px] min-w-[44px] w-11 h-11 rounded-full bg-white/10 hover:bg-brand-red text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red"
                aria-label="Close menu viewer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Lightbox Center Image Viewport */}
          <div className="relative flex-1 overflow-auto flex items-center justify-center p-2 sm:p-4 touch-pan-x touch-pan-y">
            {/* Desktop Left / Right Navigation Arrows */}
            <button
              type="button"
              onClick={handlePrevPage}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 min-h-[48px] min-w-[48px] w-12 h-12 rounded-full bg-black/60 hover:bg-brand-red text-white items-center justify-center backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Previous menu page"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={handleNextPage}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 min-h-[48px] min-w-[48px] w-12 h-12 rounded-full bg-black/60 hover:bg-brand-red text-white items-center justify-center backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Next menu page"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Menu Image Container */}
            <div
              className="relative max-h-full transition-transform duration-200 flex items-center justify-center"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: "center center",
              }}
            >
              <div className="relative max-h-[72vh] sm:max-h-[78vh] aspect-[1132/1600] w-auto h-[72vh] sm:h-[78vh] rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                <Image
                  src={selectedMenuPage.imageWebp}
                  alt={`KutumBari Restaurant Menu Page ${selectedMenuPage.pageNum} - ${selectedMenuPage.titleBn}`}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 85vw"
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Lightbox Bottom Actions Bar */}
          <div className="p-3 sm:p-4 bg-black/80 border-t border-white/10 z-10 pb-safe">
            <div className="max-w-xl mx-auto flex flex-col gap-2.5">
              {/* Prev / Next & Order Actions */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={handlePrevPage}
                  className="cursor-pointer min-h-[46px] rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">পূর্ববর্তী</span>
                </button>

                <a
                  href="tel:01351327933"
                  className="cursor-pointer min-h-[46px] col-span-1 rounded-xl bg-brand-green hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-green"
                >
                  <Phone className="w-4 h-4" />
                  <span className="truncate">কল করুন</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    handleOrderDish(selectedMenuPage.titleBn);
                    handleClosePageModal();
                  }}
                  className="cursor-pointer min-h-[46px] col-span-1 rounded-xl bg-brand-red hover:bg-brand-red-hover text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-brand-red"
                >
                  <Calendar className="w-4 h-4" />
                  <span>টেবিল বুকিং</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextPage}
                  className="cursor-pointer min-h-[46px] rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                >
                  <span className="hidden sm:inline">পরবর্তী</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Mini Thumbnail Carousel */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {ALL_MENU_PAGES.map((pg) => {
                  const isCurrent = pg.id === selectedMenuPage.id;
                  return (
                    <button
                      key={pg.id}
                      type="button"
                      onClick={() => {
                        setSelectedMenuPage(pg);
                        setZoomLevel(1);
                      }}
                      className={`cursor-pointer flex-shrink-0 min-h-[38px] px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        isCurrent
                          ? "bg-brand-red text-white shadow-md ring-2 ring-white scale-105"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      }`}
                    >
                      {pg.pageNum}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
