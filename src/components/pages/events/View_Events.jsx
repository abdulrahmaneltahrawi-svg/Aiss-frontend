import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";
import Comment from "../../common/Comment.jsx";

const API_URL = "";
const FALLBACK_IMG = "/assets/imge/0006.jpg";

// معالجة مسار الصورة من Laravel storage
function fixStoragePath(path) {
  if (!path) return FALLBACK_IMG;
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return path;
  if (path.startsWith("conferences/")) {
    return `http://localhost/aiss-backend/public/storage/${path}`;
  }
  if (path.startsWith("competitions/")) {
    return `http://localhost/aiss-backend/public/storage/${path}`;
  }
  return `http://127.0.0.1:8000/storage/${path}`;
}

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

export default function ConferenceDetails() {
  const { id } = useParams();
  const location = useLocation();

  // المسابقات (الأحداث) تُفتح عبر /competitions/:id أو /event/:id
  const isCompetition =
    location.pathname.startsWith("/competitions") ||
    location.pathname.startsWith("/event");

  const [conference, setConference] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  useEffect(() => {
    async function loadConference() {
      setLoading(true);
      setError(null);
      setConference(null);

      try {
        // ==========================================
        // المسابقة (حدث) - Laravel
        // المسار: Route::get('/competitions/{competition}', [CompetitionController::class, 'show']);
        // ==========================================
        if (isCompetition) {
          const response = await fetch(
            `${API_URL}/api/competitions/${id}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
              },
            }
          );

          const data = await response.json();

          if (!response.ok) {
            setError(data.message || "لم يتم العثور على المسابقة");
            setLoading(false);
            return;
          }

          // Laravel ممكن يرجع المسابقة مباشرة أو داخل competition
          const item = data.competition || data;

          let image = item.image_url || item.image;
          image = fixStoragePath(image);

          setConference({
            ...item,
            title: item.title || "",
            image,
            content: item.description || "",
          });
        } else {
          // ==========================================
          // المؤتمر - Laravel
          // ==========================================
          const response = await fetch(`${API_URL}/api/conferences/${id}`, {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          });

          const data = await response.json();

          if (!response.ok) {
            setError(data.message || "لم يتم العثور على المؤتمر");
            setLoading(false);
            return;
          }

          // Laravel ممكن يرجع المؤتمر مباشرة أو داخل conference
          const item = data.conference || data;

          let image = item.image_url || item.image;
          image = fixStoragePath(image);

          setConference({
            ...item,
            title: item.title || "",
            image,
            content: item.description || "",
          });
        }
      } catch (err) {
        console.error("Error loading event:", err);
        setError("حدث خطأ في تحميل المحتوى");
      }

      setLoading(false);
    }

    loadConference();
  }, [id, isCompetition]);

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
            جاري تحميل المؤتمر...
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
          <img
            src={FALLBACK_IMG}
            alt="not-found"
            className="w-40 h-40 rounded-xl object-cover shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMG;
            }}
          />
          <p className="text-[18px] text-accent">
            {error}
          </p>

          <Link
            to="/conference"
            className="btn1 inline-block mt-5"
          >
            العودة لقائمة المؤتمرات
          </Link>
        </main>

        <Footer />
      </>
    );
  }

  // ==========================================
  // المؤتمر
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
            {conference.title}
          </p>
        </div>
      </div>

      <main className="page-content">
{/* عنوان المؤتمر */}
        <div className="section-title-bar">
          <p>{conference.title}</p>
        </div>

        {/* صورة المؤتمر */}
        <div className="max-w-250 mx-auto my-5 px-5">
          <img
            src={conference.image || FALLBACK_IMG}
            alt={conference.title}
            className="w-full h-auto rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMG;
            }}
          />
        </div>

        {/* سنة المؤتمر */}
        {conference.year && (
          <div className="max-w-350 mx-auto my-5 px-5 text-center">
            <span className="inline-block bg-sidebar-bg text-accent px-4 py-1.5 rounded-full text-sm font-bold">
              سنة المؤتمر: {conference.year}
            </span>
          </div>
        )}


        {/* وصف المؤتمر */}
        <div
          className="article-content w-full max-w-350 mx-auto my-5 p-5 bg-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.06)] leading-[1.8] text-[16px] text-right overflow-wrap-break-word wrap-break-word **:overflow-visible **:max-h-none **:min-h-0 [&_img]:max-w-full [&_img]:w-auto [&_img]:h-auto [&_img]:mx-auto [&_img]:my-4 [&_img]:rounded-lg [&_img]:object-contain [&_p]:max-w-full [&_div]:max-w-full [&_section]:max-w-full [&_figure]:max-w-full [&_span]:max-w-full [&_a]:max-w-full [&_h1]:max-w-full [&_h2]:max-w-full [&_h3]:max-w-full [&_h4]:max-w-full [&_h5]:max-w-full [&_h6]:max-w-full [&_ul]:max-w-full [&_ol]:max-w-full [&_li]:max-w-full [&_table]:max-w-full [&_tr]:max-w-full [&_td]:max-w-full [&_th]:max-w-full [&_iframe]:max-w-full [&_video]:max-w-full [&_blockquote]:max-w-full [&_h1]:text-primary [&_h2]:text-primary [&_h3]:text-primary [&_h4]:text-primary [&_h5]:text-primary [&_h6]:text-primary [&_h1]:my-6 [&_h2]:my-6 [&_h3]:my-6 [&_h4]:my-6 [&_h5]:my-6 [&_h6]:my-6 [&_a]:text-primary [&_a]:underline [&_ul]:pr-6 [&_ol]:pr-6 [&_ul]:my-3 [&_ol]:my-3 [&_blockquote]:border-r-4 [&_blockquote]:border-accent [&_blockquote]:p-3 [&_blockquote]:my-4 [&_blockquote]:bg-[#f9f9f9] [&_blockquote]:rounded-lg"
          dangerouslySetInnerHTML={{
            __html: fixContentImages(conference.content || ""),
          }}
        />

                {/* رابط فيديو المؤتمر */}
        {conference.video_url && (
          <div className="max-w-350 mx-auto my-5 px-5 text-center">
            <a
              href={conference.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full text-sm font-bold no-underline hover:bg-primary-dark transition-colors shadow-[0_4px_12px_rgba(35,82,135,0.3)]"
            >
              <span className="text-base">🎥</span>
              مشاهدة فيديو المؤتمر
            </a>
          </div>
        )}

        {/* زر العودة */}
        <div className="text-center my-7.5">
          <Link
            to={isCompetition ? "/event" : "/conference"}
            className="btn1 inline-block px-7.5 py-3"
          >
            {isCompetition
              ? "← العودة لقائمة المسابقات"
              : "← العودة لقائمة المؤتمرات"}
          </Link>
        </div>

        {/* التعليقات */}
        <Comment
          source={isCompetition ? "competition" : "conference"}
          id={id ? id.split("-")[0] : ""}
        />
      </main>

      <Footer />
    </>
  );
}