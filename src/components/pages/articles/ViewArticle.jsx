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

// معالجة مسارات الصور داخل محتوى HTML
function fixContentImages(html) {
  if (!html) return "";
  // Fix src attributes that are relative paths
  return html.replace(
    /src=["']([^"']+)["']/g,
    (match, src) => {
      if (src.startsWith("http") || src.startsWith("/") || src.startsWith("data:")) {
        return match;
      }
      return `src="/Aiss/backend/${src}"`;
    }
  );
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
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    async function loadArticle() {
      setLoading(true);
      setError(null);

      try {
        if (source === "codes") {
          // البحث في الأكواد الثابتة بالـ slug أو id
          const found = codesData.find((c, idx) => {
            const slug = c.title.replace(/[^\u0600-\u06FFa-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "");
            return slug === id || idx + 1 === parseInt(id);
          });
          if (found) {
            setArticle({ title: found.title, image: found.image, content: found.content, source: "codes" });
          } else {
            setError("لم يتم العثور على الكود المطلوب");
          }
        } else if (source === "events") {
          // البحث في بيانات الفعاليات
          const eventId = parseInt(id);
          const found = events.find((ev) => ev.id === eventId);
          if (found) {
            setArticle({
              title: found.title,
              image: found.image || FALLBACK_IMG,
              content: found.description || "",
              source: "events"
            });
          } else {
            setError("لم يتم العثور على الفعالية المطلوبة");
          }
        } else if (source === "article" || !source) {
          // جلب المقال من قاعدة البيانات
          const numericId = id ? id.split("-")[0] : null;
          if (!numericId) {
            setError("معرف المقال غير موجود");
            setLoading(false);
            return;
          }
          const res = await fetch(`/api/get_article.php?id=${numericId}`);
          const data = await res.json();
          if (data.success && data.article) {
            // Fix image paths
            const articleData = { ...data.article };
            if (articleData.inner_image && !articleData.inner_image.startsWith("http") && !articleData.inner_image.startsWith("/")) {
              articleData.image = "/Aiss/backend/" + articleData.inner_image;
            } else {
              articleData.image = articleData.inner_image || articleData.image;
            }
            setArticle({ ...articleData, source: "db" });
          } else {
            setError(data.message || "لم يتم العثور على المقال");
          }
        } else {
          setError("مصدر غير معروف");
        }
      } catch (err) {
        console.error("Error loading article:", err);
        setError("حدث خطأ في تحميل المحتوى");
      }
      setLoading(false);
    }

    loadArticle();

    // تحميل التعليقات المحفوظة
    const savedComments = localStorage.getItem(`comments-${source}-${id}`);
    if (savedComments) {
      try {
        setComments(JSON.parse(savedComments));
      } catch (e) {
        // ignore
      }
    }
  }, [id, source]);

  // حفظ التعليقات في localStorage
  function saveComments(newComments) {
    setComments(newComments);
    localStorage.setItem(`comments-${source}-${id}`, JSON.stringify(newComments));
  }

  function handleAddComment(e) {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

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

  function handleDeleteComment(commentId) {
    saveComments(comments.filter((c) => c.id !== commentId));
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="page-content flex items-center justify-center" style={{ minHeight: "500px" }}>
          <p className="text-[18px] text-primary">جاري تحميل المحتوى...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="page-content flex flex-col items-center justify-center gap-5" style={{ minHeight: "500px" }}>
          <p className="text-[18px] text-accent">{error}</p>
          <Link to={source === "codes" ? "/cods" : source === "events" ? "/event" : "/blogs"} className="btn1 inline-block mt-5">
            العودة للقائمة
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="relative w-full h-100 flex justify-center items-center overflow-hidden mt-21.25">
        <img src="assets/imge/0006.jpg" alt="hero" loading="lazy" className="absolute inset-0 w-full h-full object-cover -z-10" />
        <div className="logo-text">
          <p className="text-accent text-[5rem] [text-shadow:2px_3px_9px_rgba(0,0,0,0.6)]">{article.title}</p>
        </div>
      </div>
      <main className="page-content">

        <div className="flex text-[25px] justify-center px-5 py-5 gap-1.25 font-bold border-t-[5px] border-accent bg-white mt-5">
          <p>{article.title}</p>
        </div>

        {/* صورة المقال */}
        <div className="max-w-200 mx-auto my-5 px-5" data-aos="fade-up">
          <img
            src={article.image || FALLBACK_IMG}
            alt={article.title}
            className="w-full max-h-125 object-contain rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
            onError={(e) => { e.target.src = FALLBACK_IMG; }}
          />
        </div>

        {/* المحتوى (HTML) */}
        <div
          className="article-content max-w-200 mx-auto my-5 p-5 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] leading-[1.8] text-[16px] text-right overflow-wrap-break-word wrap-break-word"
          data-aos="fade-up"
          dangerouslySetInnerHTML={{ __html: fixContentImages(article.content || "") }}
        />

        {/* زر العودة */}
        <div className="text-center my-7.5">
          <Link
            to={source === "codes" ? "/cods" : source === "events" ? "/event" : "/blogs"}
            className="btn1 inline-block px-7.5 py-3"
          >
            ← العودة للقائمة
          </Link>
        </div>

        {/* قسم التعليقات */}
        <div
          className="max-w-200 mx-auto my-10 p-5 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] text-right"
          data-aos="fade-up"
        >
          <h3 className="text-primary mb-5 text-[20px]">
            💬 التعليقات ({comments.length})
          </h3>

          {/* نموذج إضافة تعليق */}
          <form onSubmit={handleAddComment} className="mb-6.25 bg-[#f9f9f9] p-3.75 rounded-lg">
            <input
              type="text"
              placeholder="اسمك"
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
              required
              className="w-full p-2.5 border border-[#ddd] rounded-lg mb-2.5 text-[14px]"
            />
            <textarea
              placeholder="اكتب تعليقك..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
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
                  <strong className="text-primary text-[14px]">{comment.name}</strong>
                  <div className="flex gap-2 items-center">
                    <span className="text-[#999] text-[11px]">{comment.date}</span>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="bg-transparent border-none text-accent cursor-pointer text-[12px]"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <p className="text-[14px] text-[#444] m-0">{comment.text}</p>
              </div>
            ))
          )}
        </div>

      </main>
      <Footer />
    </>
  );
}