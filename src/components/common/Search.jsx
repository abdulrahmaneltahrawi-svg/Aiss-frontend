import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/**
 * مكوّن بحث شامل في الهيدر
 * يبحث عبر محتوى الموقع (مقالات، مجلات، كتيبات، أكواد، مؤتمرات، مسابقات)
 * ويعرض النتائج في قائمة منسدلة تحت حقل البحث.
 */
export default function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef(null);

  // إغلاق البحث عند الضغط خارج المكوّن
  useEffect(() => {
    const closeOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", closeOutside);
    return () => document.removeEventListener("click", closeOutside);
  }, []);

  // استخراج المصفوفة من استجابة الـ API (تختلف البنية حسب المسار)
  const extractList = (data, fallbackKey) =>
    (data && data[fallbackKey]) ||
    (data && data.data) ||
    (Array.isArray(data) ? data : []);
// البحث في محتوى الموقع
  async function runSearch(rawQuery) {
    const term = String(rawQuery || "").trim();
    if (!term) {
      setSuggestions([]);
      return;
    }

    setSearching(true);
    const lower = term.toLowerCase();

    const sources = [
      {
        key: "articles",
        endpoint: "/api/articles",
        type: "مقال",
        getTitle: (a) => a.title || "",
        getDetail: (a) => `/views?id=${a.id}&source=article`,
        searchText: (a) => `${a.title || ""} ${a.content || ""}`,
      },
      {
        key: "magazines",
        endpoint: "/api/magazines",
        type: "مجلة",
        getTitle: (m) => m.title || "",
        getDetail: (m) =>
          `/flipbook?id=${m.id}&type=magazine&title=${encodeURIComponent(m.title || "")}`,
        searchText: (m) => m.title || "",
      },
      {
        key: "booklets",
        endpoint: "/api/booklets",
        type: "كتيب",
        getTitle: (b) => b.title || b.titlesubject || "",
        getDetail: (b) =>
          `/flipbook?id=${b.id}&type=booklet&title=${encodeURIComponent(b.title || b.titlesubject || "")}`,
        searchText: (b) => `${b.title || b.titlesubject || ""}`,
      },
      {
        key: "code_standards",
        endpoint: "/api/code-standards",
        type: "كود ومعيار",
        getTitle: (c) => c.title || c.titlesubject || "",
        getDetail: (c) => {
          const slug = (c.title || "")
            .replace(/[^\u0600-\u06FFa-zA-Z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
          return `/views?id=${c.id}-${slug}&source=codes`;
        },
        searchText: (c) => `${c.title || c.titlesubject || ""}`,
      },
      {
        key: "conferences",
        endpoint: "/api/conferences",
        type: "مؤتمر",
        getTitle: (c) => c.title || "",
        getDetail: (c) => `/conferences/${c.id}`,
        searchText: (c) => c.title || "",
      },
      {
        key: "competitions",
        endpoint: "/api/competitions",
        type: "مسابقة",
        getTitle: (c) => c.title || "",
        getDetail: (c) => `/competitions/${c.id}`,
        searchText: (c) => c.title || "",
      },
    ];

    try {
      const settled = await Promise.allSettled(
        sources.map(async (src) => {
          const res = await fetch(src.endpoint, {
            headers: { Accept: "application/json" },
          });
          if (!res.ok) return [];
          const data = await res.json();
          const list = extractList(data, src.key) || [];
          return list
            .filter((item) =>
              src.searchText(item).toLowerCase().includes(lower)
            )
            .slice(0, 4)
            .map((item) => ({
              type: src.type,
              title: src.getTitle(item),
              url: src.getDetail(item),
            }));
        })
      );

      const merged = settled.flatMap((r) =>
        r.status === "fulfilled" ? r.value : []
      );
      setSuggestions(merged.slice(0, 8));
    } catch (err) {
      console.error("Search error:", err);
      setSuggestions([]);
    } finally {
      setSearching(false);
    }
  }

  // بحث حيّ (Debounced) أثناء الكتابة — 2 أحرف فأكثر
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(() => runSearch(query), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div
      ref={searchRef}
      className="relative max-[600px]:flex max-[600px]:items-center max-[600px]:order-2"
    >
      <div
        id="search-btn1"
        className="cursor-pointer max-[600px]:block max-[600px]:w-7.5 max-[600px]:h-10 max-[600px]:p-1.25"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        <img
          src="/assets/icons/loupe.webp"
          alt="search"
          loading="lazy"
          className="w-7.25 ml-45 hover:scale-110 hover:transition-transform max-[600px]:w-full max-[600px]:h-auto max-[600px]:ml-0 max-[600px]:filter-none"
        />
      </div>

      <input
        type="text"
        id="search-input1"
        name="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            runSearch(query);
          }
        }}
        className={
          open
            ? "block absolute top-[-15%] right-10 w-70 p-[10px_20px] rounded-[25px] border border-[#ddd] shadow-[0_5px_15px_rgba(0,0,0,0.1)] z-100 bg-white mr-r-12.5 max-[600px]:fixed max-[600px]:top-0 max-[600px]:left-0 max-[600px]:right-0 max-[600px]:w-auto max-[600px]:z-10050 max-[600px]:rounded-none max-[600px]:border-x-0 max-[600px]:border-t-0 max-[600px]:border-b max-[600px]:border-b-[#ddd] max-[600px]:p-3 max-[600px]:pr-11 max-[600px]:text-[14px] max-[600px]:shadow-[0_4px_12px_rgba(0,0,0,0.12)] max-[600px]:my-0 max-[600px]:mx-0"
            : "hidden"
        }
        placeholder="ابحث عن ما تريد..."
      />

      {open && query.trim().length >= 2 && (
        <ul
          id="search-suggestions"
          className="block absolute top-[calc(100%+25px)] left-1/5 -translate-x-1/2 w-62.5 max-w-[90vw] bg-white border border-[#ddd] rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.15)] z-98 list-none max-h-75 overflow-y-auto p-1.25 m-0 max-[600px]:fixed max-[600px]:top-12 max-[600px]:left-0 max-[600px]:right-0 max-[600px]:w-auto max-[600px]:max-w-none max-[600px]:max-h-[70vh] max-[600px]:translate-x-0 max-[600px]:rounded-none max-[600px]:border-x-0 max-[600px]:border-t-0 max-[600px]:p-1.5 max-[600px]:z-10045 max-[600px]:shadow-[0_6px_16px_rgba(0,0,0,0.15)]"
        >
          {searching ? (
            <li className="p-3 text-center text-[14px] text-[#666]">
              جارٍ البحث...
            </li>
          ) : suggestions.length === 0 ? (
            <li className="p-3 text-center text-[14px] text-[#666]">
              لا توجد نتائج مطابقة
            </li>
          ) : (
            suggestions.map((s, i) => (
              <li
                key={`${s.type}-${i}`}
                className="border-b border-[#f1f1f1] last:border-none"
              >
                <Link
                  to={s.url}
                  onClick={clearSearch}
                  className="flex items-center gap-2 px-3.75 py-2.5 no-underline text-[#333] transition-colors duration-150 hover:bg-[#f5f5f5]"
                >
                  <span className="shrink-0 rounded-full bg-accent text-white text-[11px] font-bold px-2 py-0.5">
                    {s.type}
                  </span>
                  <span className="text-[14px] leading-snug overflow-hidden wrap-break-word">
                    {s.title}
                  </span>
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}