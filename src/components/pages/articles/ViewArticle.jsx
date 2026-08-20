import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";

// أكواد ثابتة
import { codesData } from "./Code.jsx";
// بيانات الفعاليات
import events from "../events/eventsData.js";

const FALLBACK_IMG = "assets/imge/0006.jpg";

// Laravel API
const API_URL = "";

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
  if (path.startsWith("magazines/") || path.startsWith("articles/") || path.startsWith("booklets/")) {
    return `http://localhost/aiss-backend/public/storage/${path}`;
  }
  return `http://127.0.0.1:8000/storage/${path}`;
}

// معالجة مسار ملف PDF من Laravel storage
function fixPdfPath(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return path;
  if (path.startsWith("magazines/") || path.startsWith("articles/") || path.startsWith("booklets/")) {
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

  const [comments, setComments] = useState([]);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");

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
        // الأكواد الثابتة
        // ==========================================
        if (source === "codes") {
          const found = codesData.find((c, idx) => {
            const slug = c.title
              .replace(/[^\u0600-\u06FFa-zA-Z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "");

            return slug === id || idx + 1 === parseInt(id);
          });

          if (found) {
            setArticle({
              title: found.title,
              image: found.image,
              content: found.content,
              source: "codes",
            });
          } else {
            setError("لم يتم العثور على الكود المطلوب");
          }
        }

        // ==========================================
        // الفعاليات
        // ==========================================
        else if (source === "events") {
          const eventId = parseInt(id);

          const found = events.find((ev) => ev.id === eventId);

          if (found) {
            setArticle({
              title: found.title,
              image: found.image || FALLBACK_IMG,
              content: found.description || "",
              source: "events",
            });
          } else {
            setError("لم يتم العثور على الفعالية المطلوبة");
          }
        }

        // ==========================================
        // المجلات - عرض PDF
        // ==========================================
        else if (source === "magazine") {
          const numericId = id ? id.split("-")[0] : null;

          if (!numericId) {
            setError("معرف المجلة غير موجود");
            setLoading(false);
            return;
          }

          const response = await fetch(
            `${API_URL}/api/magazines/${numericId}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
              },
            }
          );

          const data = await response.json();

          if (!response.ok) {
            setError(data.message || "لم يتم العثور على المجلة");
            setLoading(false);
            return;
          }

          const item = data.magazine || data;

          setArticle({
            ...item,
            title: item.title,
            image: fixStoragePath(item.cover_image),
            pdfUrl: fixPdfPath(item.file_path),
            source: "magazine",
          });
        }

        // ==========================================
        // الكتيبات - عرض PDF
        // ==========================================
        else if (source === "booklet") {
          const numericId = id ? id.split("-")[0] : null;

          if (!numericId) {
            setError("معرف الكتيب غير موجود");
            setLoading(false);
            return;
          }

          const response = await fetch(
            `${API_URL}/api/booklets/${numericId}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
              },
            }
          );

          const data = await response.json();

          if (!response.ok) {
            setError(data.message || "لم يتم العثور على الكتيب");
            setLoading(false);
            return;
          }

          const item = data.booklet || data;

          setArticle({
            ...item,
            title: item.title,
            image: fixStoragePath(item.cover_image),
            pdfUrl: fixPdfPath(item.file_path),
            source: "booklet",
          });
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

    // ==========================================
    // تحميل التعليقات من localStorage
    // ==========================================

    const savedComments = localStorage.getItem(
      `comments-${source}-${id}`
    );

    if (savedComments) {
      try {
        setComments(JSON.parse(savedComments));
      } catch (e) {
        console.error("Error loading comments:", e);
      }
    } else {
      setComments([]);
    }
  }, [id, source]);

  // ==========================================
  // حفظ التعليقات
  // ==========================================

  function saveComments(newComments) {
    setComments(newComments);

    localStorage.setItem(
      `comments-${source}-${id}`,
      JSON.stringify(newComments)
    );
  }

  // ==========================================
  // إضافة تعليق
  // ==========================================

  function handleAddComment(e) {
    e.preventDefault();

    if (!commentName.trim() || !commentText.trim()) {
      return;
    }

    const newComment = {
      id: Date.now(),
      name: commentName.trim(),
      text: commentText.trim(),
      date: new Date().toLocaleDateString("ar-SA"),
    };

    saveComments([...comments, newComment]);

    setCommentName("");
    setCommentText("");
  }

  // ==========================================
  // حذف تعليق
  // ==========================================

  function handleDeleteComment(commentId) {
    saveComments(
      comments.filter((c) => c.id !== commentId)
    );
  }

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
                : source === "events"
                ? "/event"
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

        {/* عنوان المقال */}
        <div className="section-title-bar">
          <p>{article.title}</p>
        </div>

        {/* صورة المقال */}
        <div className="max-w-350 mx-auto my-5 px-5">
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
          <div className="max-w-350 mx-auto my-5 px-5 flex flex-wrap gap-2 justify-end">
            {article.tags.map((tag) => (
              <span
                key={tag.id}
                className="bg-sidebar-bg text-accent px-3 py-1 rounded-full text-sm font-bold"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* محتوى المقال - PDF للمجلات والكتيبات */}
        {article.pdfUrl ? (
          <div
            className="max-w-200 mx-auto my-5 p-5 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
            data-aos="fade-up"
          >
            <iframe
              src={article.pdfUrl}
              title={article.title}
              className="w-full rounded-lg"
              style={{ minHeight: "600px", border: "none" }}
            />
            <div className="text-center mt-5">
              <a
                href={article.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn1 inline-block bg-primary text-white px-5 py-2.5 text-[14px]"
              >
                📥 تحميل PDF
              </a>
            </div>
          </div>
        ) : (
          <div
            className="article-content w-full max-w-350 mx-auto my-5 p-5 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] leading-[1.8] text-[16px] text-right overflow-wrap-break-word wrap-break-word [&_*]:overflow-visible [&_*]:max-h-none [&_*]:min-h-0 [&_img]:max-w-full [&_img]:w-auto [&_img]:h-auto [&_img]:mx-auto [&_img]:my-4 [&_img]:rounded-lg [&_img]:object-contain [&_p]:max-w-full [&_div]:max-w-full [&_section]:max-w-full [&_figure]:max-w-full [&_span]:max-w-full [&_a]:max-w-full [&_h1]:max-w-full [&_h2]:max-w-full [&_h3]:max-w-full [&_h4]:max-w-full [&_h5]:max-w-full [&_h6]:max-w-full [&_ul]:max-w-full [&_ol]:max-w-full [&_li]:max-w-full [&_table]:max-w-full [&_tr]:max-w-full [&_td]:max-w-full [&_th]:max-w-full [&_iframe]:max-w-full [&_video]:max-w-full [&_blockquote]:max-w-full [&_h1]:text-primary [&_h2]:text-primary [&_h3]:text-primary [&_h4]:text-primary [&_h5]:text-primary [&_h6]:text-primary [&_h1]:my-6 [&_h2]:my-6 [&_h3]:my-6 [&_h4]:my-6 [&_h5]:my-6 [&_h6]:my-6 [&_a]:text-primary [&_a]:underline [&_ul]:pr-6 [&_ol]:pr-6 [&_ul]:my-3 [&_ol]:my-3 [&_blockquote]:border-r-4 [&_blockquote]:border-accent [&_blockquote]:p-3 [&_blockquote]:my-4 [&_blockquote]:bg-[#f9f9f9] [&_blockquote]:rounded-lg"
            dangerouslySetInnerHTML={{
              __html: fixContentImages(
                article.content || ""
              ),
            }}
          />
        )}

        {/* زر العودة */}
        <div className="text-center my-7.5">
          <Link
            to={
              source === "codes"
                ? "/cods"
                : source === "events"
                ? "/event"
                : source === "magazine"
                ? "/magazine"
                : source === "booklet"
                ? "/manuals"
                : "/blogs"
            }
            className="btn1 inline-block px-7.5 py-3"
          >
            ← العودة للقائمة
          </Link>
        </div>

        {/* التعليقات */}
        <div
          className="max-w-200 mx-auto my-10 p-5 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] text-right"
          data-aos="fade-up"
        >
          <h3 className="text-primary mb-5 text-[20px]">
            💬 التعليقات ({comments.length})
          </h3>

          {/* نموذج التعليق */}
          <form
            onSubmit={handleAddComment}
            className="mb-6.25 bg-[#f9f9f9] p-3.75 rounded-lg"
          >
            <input
              type="text"
              placeholder="اسمك"
              value={commentName}
              onChange={(e) =>
                setCommentName(e.target.value)
              }
              required
              className="w-full p-2.5 border border-[#ddd] rounded-lg mb-2.5 text-[14px]"
            />

            <textarea
              placeholder="اكتب تعليقك..."
              value={commentText}
              onChange={(e) =>
                setCommentText(e.target.value)
              }
              required
              rows={3}
              className="w-full p-2.5 border border-[#ddd] rounded-lg mb-2.5 text-[14px] resize-y"
            />

            <button
              type="submit"
              className="btn1 bg-primary text-white border-none px-7.5 py-3 cursor-pointer text-[14px] rounded-lg"
            >
              إرسال التعليق
            </button>
          </form>

          {/* قائمة التعليقات */}
          {comments.length === 0 ? (
            <p className="text-[#999] text-center p-5">
              لا توجد تعليقات بعد. كن أول من يعلق!
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-[#f9f9f9] p-2.75 rounded-lg border-r-[3px] border-accent"
              >
                <div className="flex justify-between items-center mb-2.5">
                  <strong className="text-primary text-[14px]">
                    {comment.name}
                  </strong>

                  <div className="flex gap-2 items-center">
                    <span className="text-[#999] text-[11px]">
                      {comment.date}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteComment(comment.id)
                      }
                      className="bg-transparent border-none text-accent cursor-pointer text-[12px]"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <p className="text-[14px] text-[#444] m-0">
                  {comment.text}
                </p>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}