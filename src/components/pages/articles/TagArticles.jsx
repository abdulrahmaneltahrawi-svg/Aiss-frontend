import { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";
import Scroll from "../../common/Scroll.jsx";
import Card from "../../common/Card.jsx";

const ITEMS_PER_PAGE = 12;

const FALLBACK_IMG = "assets/imge/0006.jpg";

// معالجة مسار صورة المقال القادمة من Laravel storage
function fixArticleImage(imgPath) {
  if (!imgPath) return FALLBACK_IMG;

  if (imgPath.startsWith("http")) return imgPath;

  if (imgPath.startsWith("/")) return imgPath;

  if (imgPath.startsWith("assets/")) return imgPath;

  if (imgPath.startsWith("articles/")) {
    return `http://localhost/aiss-backend/public/storage/${imgPath}`;
  }

  return `http://127.0.0.1:8000/storage/${imgPath.replace(/^\/+/, "")}`;
}

// صفحة عرض مقالات وسم معيّن عبر الـ Endpoint الجديد /api/tags/{id}/articles
export default function TagArticles() {
  const [searchParams] = useSearchParams();

  const tagId = searchParams.get("id");
  const tagNameFromUrl = searchParams.get("name") || "";

  const [articles, setArticles] = useState([]);
  const [tagName, setTagName] = useState(tagNameFromUrl);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayedCount, setDisplayedCount] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);
    setArticles([]);
    setTagName(tagNameFromUrl);

    async function loadTagArticles() {
      if (!tagId) {
        setError("معرف الوسم غير موجود");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/tags/${tagId}/articles`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        const data = await response.json();

        if (cancelled) return;

        if (!response.ok) {
          setError(data.message || "لم يتم العثور على الوسم");
          setLoading(false);
          return;
        }

        // الاستجابة قد تكون مقالات مباشرة أو داخل articles أو data
        const list =
          (data && data.articles) ||
          (data && data.data) ||
          (Array.isArray(data) ? data : []);

        // اسم الوسم من الاستجابة (أكثر دقة) مع الاحتفاظ بالاسم المُمرَّر كبديل
        if (data && data.tag && data.tag.name) {
          setTagName(data.tag.name);
        }

        const mapped = (list || []).map((a) => {
          const imgPath = fixArticleImage(
            a.cover_image_url || a.cover_image || a.image || ""
          );

          return {
            ...a,
            source: "db",
            img: imgPath,
            image: imgPath,
            title: a.title || "",
          };
        });

        setArticles(mapped);
        setDisplayedCount(Math.min(ITEMS_PER_PAGE, mapped.length));
      } catch (err) {
        console.error("Error fetching tag articles:", err);
        if (cancelled) return;
        setError("حدث خطأ في تحميل المقالات");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTagArticles();

    return () => {
      cancelled = true;
    };
  }, [tagId, tagNameFromUrl]);

  const loadMore = useCallback(() => {
    setDisplayedCount((prev) =>
      Math.min(prev + ITEMS_PER_PAGE, articles.length)
    );
  }, [articles.length]);

  const displayedArticles = articles.slice(0, displayedCount);

  return (
    <>
      <Header />

      {/* Hero */}
      <div className="page-hero">
        <img
          src={FALLBACK_IMG}
          alt="hero-logo"
          loading="lazy"
          className="page-hero-bg"
        />
        <div className="logo-text">
          <p className="page-hero-title">
            {tagName ? `مقالات الوسم: ${tagName}` : "مقالات الوسم"}
          </p>
        </div>
      </div>

      <main className="page-content">
        <div className="section-title-bar">
          <p>
            {tagName
              ? `مقالات مرتبطة بوسم «${tagName}»`
              : "المقالات حسب الوسم"}
          </p>
        </div>

        <div className="cards-grid" style={{ minHeight: "600px" }}>
          {loading ? (
            <p className="text-center w-full p-12.5">جاري تحميل المقالات...</p>
          ) : error ? (
            <div className="text-center w-full p-12.5 flex flex-col items-center gap-5">
              <p className="text-[18px] text-accent">{error}</p>
              <Link to="/blogs" className="btn1 inline-block mt-5">
                العودة للمدونات
              </Link>
            </div>
          ) : displayedArticles.length === 0 ? (
            <p className="text-center w-full p-12.5">
              لا توجد مقالات لهذا الوسم.
            </p>
          ) : (
            displayedArticles.map((item, idx) => (
              <Card
                key={item.id ?? idx}
                id={item.id ?? idx}
                title={item.title}
                image={item.image}
                fallbackImage="assets/magazine/IMG_1325.webp"
                href={`/views?id=${item.id}&source=article`}
                btnText="عرض المدونة"
              />
            ))
          )}
        </div>

        {!loading && !error && displayedCount < articles.length && (
          <div className="text-center my-[20px_0_40px] w-full flex justify-center">
            <button className="btn1 inline-block" onClick={loadMore}>
              عرض المزيد
            </button>
          </div>
        )}
      </main>

      <Scroll />
      <Footer />
    </>
  );
}
