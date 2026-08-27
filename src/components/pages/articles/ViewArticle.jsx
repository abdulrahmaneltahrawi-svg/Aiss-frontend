import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";
import Comment from "../../common/Comment.jsx";



// Laravel API
const API_URL = "";

const FALLBACK_IMG = "assets/imge/0006.jpg";

// معالجة مسارات الصور داخل محتوى HTML
function fixContentImages(html) {
  if (!html) return "";

  return html.replace(
    /src=["']([^"']+)["']/g,
    (match, src) => {
      if (
        src.startsWith("http") ||
        src.startsWith("/") ||
        src.startsWith("data:")
      ) {
        return match;
      }

      return `src="/${src.replace(/^\/+/, "")}"`;
    }
  );
}

// معالجة مسار الصور من Laravel storage
function fixStoragePath(path) {
  if (!path) return FALLBACK_IMG;
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return path;
  if (path.startsWith("articles/")) {
    return `http://localhost/aiss-backend/public/storage/${path}`;
  }
  return `http://127.0.0.1:8000/storage/${path}`;
}

export default function ViewArticle() {
  const [searchParams] = useSearchParams();

  const id = searchParams.get("id");
  const source = searchParams.get("source") || "article";

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  useEffect(() => {
    async function loadArticle() {
      setLoading(true);
      setError(null);
      setArticle(null);

      try {
        // ==========================================
        // الأكواد والمعايير
        // ==========================================
        if (source === "codes") {
          const numericId = id ? parseInt(id.split("-")[0], 10) : NaN;

          // إذا كان الرابط يحمل رقم معرف من قاعدة البيانات -> نجلب من الـ API
          if (!Number.isNaN(numericId)) {
            try {
              const response = await fetch(
                `${API_URL}/api/code-standards/${numericId}`,
                {
                  method: "GET",
                  headers: {
                    Accept: "application/json",
                  },
                }
              );

              const data = await response.json();

              if (response.ok) {
                const item = data.code_standard || data;

                setArticle({
                  ...item,
                  title: item.title || item.titlesubject || "",
                  image:
                    item.cover_image_url ||
                    fixStoragePath(item.cover_image) ||
                    FALLBACK_IMG,
                  content: item.content || "",
                  source: "codes",
                });
                setLoading(false);
                return;
              }
            } catch (err) {
              console.error("Error fetching code standard:", err);
            }
          }

          setError("لم يتم العثور على الكود المطلوب");
        }

        // ==========================================
        // المقالات - Laravel
        // ==========================================
        else if (source === "article" || !source) {
          const numericId = id ? id.split("-")[0] : null;

          if (!numericId) {
            setError("معرف المقال غير موجود");
            setLoading(false);
            return;
          }

          console.log("جاري جلب المقال رقم:", numericId);

          const response = await fetch(
            `${API_URL}/api/articles/${numericId}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
              },
            }
          );

          console.log("ARTICLE STATUS:", response.status);

          const data = await response.json();

          console.log("ARTICLE RESPONSE:", data);

          if (!response.ok) {
            setError(
              data.message || "لم يتم العثور على المقال"
            );
            setLoading(false);
            return;
          }

          // Laravel ممكن يرجع المقال مباشرة
          // أو داخل article
          const articleData = data.article || data;

          // ==========================================
          // تجهيز صورة المقال
          // ==========================================

          let image = articleData.inner_image || articleData.cover_image;

          image = fixStoragePath(image);

          setArticle({
            ...articleData,
            image,
            source: "db",
          });
        }

        // ==========================================
        // مصدر غير معروف
        // ==========================================
        else {
          setError("مصدر غير معروف");
        }
      } catch (err) {
        console.error("Error loading article:", err);
        setError("حدث خطأ في تحميل المحتوى");
      }

      setLoading(false);
    }

    loadArticle();
  }, [id, source]);

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <>
        <Header />

        <main
          className="page-content flex items-center justify-center"
          style={{ minHeight: "500px" }}
        >
          <p className="text-[18px] text-primary">
            جاري تحميل المحتوى...
          </p>
        </main>

        <Footer />
      </>
    );
  }

  // ==========================================
  // Error
  // ==========================================

  if (error) {
    return (
      <>
        <Header />

        <main
          className="page-content flex flex-col items-center justify-center gap-5"
          style={{ minHeight: "500px" }}
        >
          <p className="text-[18px] text-accent">
            {error}
          </p>

          <Link
            to={
              source === "codes"
                ? "/cods"
                : "/blogs"
            }
            className="btn1 inline-block mt-5"
          >
            العودة للقائمة
          </Link>
        </main>

        <Footer />
      </>
    );
  }

  // ==========================================
  // المقال
  // ==========================================

  return (
    <>
      <Header />

      {/* Hero */}
      <div className="page-hero">
        <img
          src={FALLBACK_IMG}
          alt="hero"
          loading="lazy"
          className="page-hero-bg"
        />

        <div className="logo-text">
          <p className="page-hero-title">
            {article.title}
          </p>
        </div>
      </div>

      <main className="page-content">

        {/* حاوية بيضاء موحّدة لكل محتوى المقال */}
        <div className="max-w-350 mx-auto my-5 bg-white rounded-2xl border border-[#eee] shadow-[0_4px_12px_rgba(0,0,0,0.06)] overflow-hidden">

          {/* عنوان المقال */}
          <div className="section-title-bar m-0 rounded-none">
            <p>{article.title}</p>
          </div>

          {/* صورة المقال */}
          <div className="px-5 pt-5">
            <img
              src={article.image || FALLBACK_IMG}
              alt={article.title}
              className="w-full h-auto rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_IMG;
              }}
            />
          </div>

          {/* التاجات */}
          {article.tags && article.tags.length > 0 && (
            <div className="px-5 pt-3 flex flex-wrap gap-2 justify-end">
              {article.tags.map((tag) => (
                <Link
                  key={tag.id}
                  to={`/tag-articles?id=${tag.id}&name=${encodeURIComponent(tag.name || "")}`}
                  title={`عرض مقالات الوسم ${tag.name}`}
                  className="bg-sidebar-bg text-accent px-3 py-1 rounded-full text-sm font-bold no-underline transition-all duration-200 hover:bg-accent hover:text-white"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}

          {/* محتوى المقال */}
          <div
            className="article-content w-full p-5 leading-[1.8] text-[16px] text-right overflow-wrap-break-word wrap-break-word **:overflow-visible **:max-h-none **:min-h-0 [&_img]:max-w-full [&_img]:w-auto [&_img]:h-auto [&_img]:mx-auto [&_img]:my-4 [&_img]:rounded-lg [&_img]:object-contain [&_p]:max-w-full [&_div]:max-w-full [&_section]:max-w-full [&_figure]:max-w-full [&_span]:max-w-full [&_a]:max-w-full [&_h1]:max-w-full [&_h2]:max-w-full [&_h3]:max-w-full [&_h4]:max-w-full [&_h5]:max-w-full [&_h6]:max-w-full [&_ul]:max-w-full [&_ol]:max-w-full [&_li]:max-w-full [&_table]:max-w-full [&_tr]:max-w-full [&_td]:max-w-full [&_th]:max-w-full [&_iframe]:max-w-full [&_video]:max-w-full [&_blockquote]:max-w-full [&_h1]:text-primary [&_h2]:text-primary [&_h3]:text-primary [&_h4]:text-primary [&_h5]:text-primary [&_h6]:text-primary [&_h1]:my-6 [&_h2]:my-6 [&_h3]:my-6 [&_h4]:my-6 [&_h5]:my-6 [&_h6]:my-6 [&_a]:text-primary [&_a]:underline [&_ul]:pr-6 [&_ol]:pr-6 [&_ul]:my-3 [&_ol]:my-3 [&_blockquote]:border-r-4 [&_blockquote]:border-accent [&_blockquote]:p-3 [&_blockquote]:my-4 [&_blockquote]:bg-[#f9f9f9] [&_blockquote]:rounded-lg"
            dangerouslySetInnerHTML={{
              __html: fixContentImages(
                article.content || ""
              ),
            }}
          />

          {/* زر العودة */}
          <div className="text-center mt-2 mb-5 px-5">
            <Link
              to={
                source === "codes"
                  ? "/cods"
                  : "/blogs"
              }
              className="btn1 inline-block px-7.5 py-3"
            >
              ← العودة للقائمة
            </Link>
          </div>

          {/* التعليقات */}
          <div className="border-t border-[#f1f1f1]">
            <Comment  source={source} id={id ? id.split("-")[0] : ""} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}