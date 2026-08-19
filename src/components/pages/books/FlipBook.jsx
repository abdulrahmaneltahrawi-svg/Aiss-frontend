import { useEffect, useState, useRef } from "react";
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

  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [fullPdfUrl, setFullPdfUrl] = useState(null);
  const [pdfjsReady, setPdfjsReady] = useState(false);
  const canvasRef = useRef(null);
  const pdfjsRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // Load pdfjs dynamically
  useEffect(() => {
    async function initPdfjs() {
      const module = await import("pdfjs-dist");
      const pdfjs = module.default || module;
      // Use worker from the installed package version (v6.x)
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@6.1.200/build/pdf.worker.min.mjs`;
      pdfjsRef.current = pdfjs;
      setPdfjsReady(true);
    }
    initPdfjs();
  }, []);

  useEffect(() => {
    const pdfjs = pdfjsRef.current;
    if (!pdfjs) return;

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
        } else {
          resolvedUrl = "/Aiss/backend/" + finalPdfUrl;
        }
        setFullPdfUrl(resolvedUrl);

        // Log for debugging
        console.log("Loading PDF from:", resolvedUrl);
        console.log("Original file_path:", finalPdfUrl);

        if (!resolvedUrl) {
          setError("رابط الملف غير صالح");
          setLoading(false);
          return;
        }

        const pdf = await pdfjs.getDocument({ url: resolvedUrl }).promise;
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);

        // Render first page
        renderPage(pdf, 1);
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
  }, [id, pdfUrl, type, pdfjsReady]);

  async function renderPage(pdf, pageNum) {
    if (!pdf) return;
    try {
      const page = await pdf.getPage(pageNum);
      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const ctx = canvas.getContext("2d");
      await page.render({ canvasContext: ctx, viewport }).promise;
    } catch (err) {
      console.error("Error rendering page:", err);
    }
  }

  const goToPage = (pageNum) => {
    if (pageNum < 1 || pageNum > numPages) return;
    setCurrentPage(pageNum);
    renderPage(pdfDoc, pageNum);
  };

  const goPrev = () => goToPage(currentPage - 1);
  const goNext = () => goToPage(currentPage + 1);

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

          {!loading && !error && pdfDoc && (
            <>
              {/* PDF Viewer */}
              <div className="bg-[#f5f5f5] rounded-xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.1)] mb-5 overflow-hidden">
                <div className="flex justify-center items-center min-h-125">
                  <div className="shadow-[0_4px_20px_rgba(0,0,0,0.2)] rounded-sm overflow-hidden max-w-full">
                    <canvas ref={canvasRef} className="max-w-full h-auto" />
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-1.25 flex-wrap mt-5">
                <button
                  onClick={goPrev}
                  disabled={currentPage <= 1}
                  className="btn1 text-[14px] px-5 py-2.5"
                  style={{
                    opacity: currentPage <= 1 ? 0.5 : 1,
                    cursor: currentPage <= 1 ? "not-allowed" : "pointer"
                  }}
                >
                  ‹ السابق
                </button>

                <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                  <input
                    type="number"
                    value={currentPage}
                    min={1}
                    max={numPages}
                    onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                    className="w-15 p-2 border border-[#ddd] rounded-sm text-center text-[14px]"
                  />
                  <span className="text-[14px] text-[#666]">/ {numPages}</span>
                </div>

                <button
                  onClick={goNext}
                  disabled={currentPage >= numPages}
                  className="btn1 text-[14px] px-5 py-2.5"
                  style={{
                    opacity: currentPage >= numPages ? 0.5 : 1,
                    cursor: currentPage >= numPages ? "not-allowed" : "pointer"
                  }}
                >
                  التالي ›
                </button>
              </div>

              {/* Download link */}
              {fullPdfUrl && (
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
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}