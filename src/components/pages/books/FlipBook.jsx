import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";

const API_URL = "";

export default function FlipBook() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const pdfUrl = searchParams.get("pdf");
  const title = searchParams.get("title");
  const type = searchParams.get("type") || "magazine";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullPdfUrl, setFullPdfUrl] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    async function loadPdf() {
      try {
        setLoading(true);
        let finalPdfUrl = pdfUrl;

        // If only id is provided, fetch from API
        if (!finalPdfUrl && id) {
          const apiPath = type === "booklet" ? "booklets" : "magazines";
          const res = await fetch(`${API_URL}/api/${apiPath}/${id}`);
          const data = await res.json();
          const item = data.booklet || data.magazine || data;
          if (res.ok && item) {
            finalPdfUrl = item.file || item.file_path || item.pdf;
            if (!finalPdfUrl) {
              setError("لا يوجد ملف PDF لهذا الإصدار");
              setLoading(false);
              return;
            }
          } else {
            setError(data.message || "فشل تحميل البيانات");
            setLoading(false);
            return;
          }
        }

        if (!finalPdfUrl) {
          setError("معرف الإصدار غير موجود");
          setLoading(false);
          return;
        }

        // Build the full PDF URL
        let resolvedUrl;
        if (finalPdfUrl.startsWith("http")) {
          resolvedUrl = finalPdfUrl;
        } else if (finalPdfUrl.startsWith("/Aiss")) {
          resolvedUrl = finalPdfUrl;
        } else if (finalPdfUrl.startsWith("/")) {
          resolvedUrl = finalPdfUrl;
        } else if (finalPdfUrl.startsWith("magazines/") || finalPdfUrl.startsWith("booklets/") || finalPdfUrl.startsWith("articles/")) {
          resolvedUrl = "http://localhost/aiss-backend/public/storage/" + finalPdfUrl;
        } else {
          resolvedUrl = "/Aiss/backend/" + finalPdfUrl;
        }
        // Log for debugging
        console.log("Loading PDF from:", resolvedUrl);
        console.log("Original file_path:", finalPdfUrl);

        if (!resolvedUrl) {
          setError("رابط الملف غير صالح");
          setLoading(false);
          return;
        }

        setFullPdfUrl(resolvedUrl);
        setLoading(false);
      } catch (err) {
        console.error("Error loading PDF:", err);
        setError("حدث خطأ في تحميل الملف: " + (err.message || ""));
        setLoading(false);
      }
    }

    if (id || pdfUrl) {
      loadPdf();
    } else {
      setError("معرف الإصدار غير موجود");
      setLoading(false);
    }
  }, [id, pdfUrl, type]);

  return (
    <>
      <Header />
      <main className="page-content" style={{ marginTop: "100px" }}>
        <div className="section-title-bar">
          <p>{title || (type === "booklet" ? "كتيب السلامة" : "المجلة")}</p>
        </div>

        <div className="text-center p-5 max-w-200 mx-auto">
          {loading && (
            <div className="text-center p-25">
              <p className="text-[18px] text-primary">جاري تحميل الملف...</p>
            </div>
          )}

          {error && (
            <div className="text-center p-25">
              <p className="text-[18px] text-accent">{error}</p>
              <Link to={type === "booklet" ? "/manuals" : "/magazine"} className="btn1 inline-block mt-5">
                العودة للإصدارات
              </Link>
            </div>
          )}

          {!loading && !error && fullPdfUrl && (
            <>
              {/* PDF Viewer using iframe */}
              <div className="bg-[#f5f5f5] rounded-xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] mb-5 overflow-hidden">
                <iframe
                  src={fullPdfUrl}
                  title={title || "PDF Viewer"}
                  className="w-full rounded-lg bg-white"
                  style={{ minHeight: "700px", border: "none" }}
                />
              </div>

              {/* Download link */}
              <div className="mt-5">
                <a
                  href={fullPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn1 inline-block bg-primary text-white px-5 py-2.5 text-[14px]"
                >
                  📥 تحميل PDF
                </a>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}