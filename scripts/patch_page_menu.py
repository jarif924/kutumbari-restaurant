# scripts/patch_page_menu.py
import re

with open('app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Verify section id="menu"
start_marker = '{/* 6. MENU SECTION'
end_marker = '{/* 7. EVENT HOSTING'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print(f"Error: Markers not found. start: {start_idx}, end: {end_idx}")
    exit(1)

new_menu_section = '''{/* 6. MENU SECTION (UI/UX Pro Max: Full 144-Product Interactive Catalog + 19-Page Authentic Menu Book) */}
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
                        className={`cursor-pointer min-h-[32px] px-2.5 py-1 rounded-full font-bold text-[11px] transition-all ${
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
                                        className={`cursor-pointer min-h-[34px] px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
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

      '''

updated_content = content[:start_idx] + new_menu_section + content[end_idx:]

with open('app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(updated_content)

print("Successfully replaced Menu section in app/page.tsx!")
