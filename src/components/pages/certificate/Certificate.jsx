import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";
import Scroll from "../../common/Scroll.jsx";
import Card from "../../common/Card.jsx";

const FALLBACK_IMG = "/assets/imge/logo-iss-site.jpg.jpeg";

export default function Store() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    fetch("/api/certificate-types")
      .then((res) => {
        if (!res.ok) {
          throw new Error("فشل في جلب أنواع الشهادات");
        }

        return res.json();
      })
      .then((data) => {
        console.log("Certificate Types:", data);

        setProducts(
          data.certificate_types.map((item) => ({
            id: item.id,
            title: item.name,
            price: item.price,
            image:
              item.id === 1
                ? "/assets/store&memberships/0011.webp"
                : "/assets/store&memberships/0012.webp",
          }))
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const viewProduct = (product) => {
    navigate(`/store/view/${product.id}`);
  };

  const requestCertificate = (product) => {
    localStorage.setItem("certificateType", String(product.id));
    localStorage.setItem("orderTotal", String(product.price));

    navigate("/store/payment");
  };

  return (
    <>
      <Header />

      <div className="page-hero">
        <img
          src="/assets/imge/0005.jpg"
          alt="store-pic"
          loading="lazy"
          className="page-hero-bg"
        />

        <div className="logo-text">
          <p className="page-hero-title">المتجر</p>
        </div>
      </div>

      <main className="page-content">
        {/* قسم التحقق من الشهادة */}
        <div className="section-title-bar">
          <p>التحقق من الشهادة</p>
        </div>

        <div className="mt-8">
          <Certificate embedded />
        </div>

        {/* قسم منتجات المتجر */}
        <div className="section-title-bar mt-14">
          <p>الشهادات المعتمدة</p>
        </div>

        <div className="cards-grid gap-10.5">
          {products.map((item) => (
            <Card
              key={item.id}
              id={item.id}
              title={item.title}
              image={item.image}
              fallbackImage={FALLBACK_IMG}
              btnText="طلب شهادة"
              price={`${item.price} د.ا`}
              onButtonClick={() => requestCertificate(item)}
              onCardClick={() => viewProduct(item)}
            />
          ))}
        </div>
      </main>

      <Scroll />
      <Footer />
    </>
  );
}

// ============================================================
// مكوّن التحقق من الشهادات — تم دمجه هنا من Certificate.jsx
// ============================================================

const API_URL = "";

export function Certificate({ embedded = false }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleVerify() {
    const trimmedCode = code.trim();

    if (!trimmedCode) {
      setError("يرجى إدخال كود الشهادة");
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(
        `${API_URL}/api/certificates/verify/${encodeURIComponent(trimmedCode)}`,
        { credentials: "include" }
      );

      // قراءة الرد بطريقة آمنة
      const contentType = res.headers.get("content-type") || "";

      let data;

      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();

        if (text) {
          try {
            data = JSON.parse(text);
          } catch {
            data = {};
          }
        } else {
          data = {};
        }
      }

      if (!res.ok) {
        setError(data.message || "الشهادة غير موجودة");
        setResult(null);
        return;
      }

      const cert = data.certificate || data;

      if (!cert || !cert.code) {
        setError("الشهادة غير موجودة");
        setResult(null);
        return;
      }

      setResult(cert);
    } catch (err) {
      setError("حدث خطأ أثناء التحقق: " + err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  const statusInfo = {
    active: {
      label: "سارية",
      badgeClass: "bg-[#d1fae5] text-[#065f46]",
      icon: "✅",
      title: "شهادة معتمدة",
      cardClass: "border-[#34d399] bg-gradient-to-br from-[#f0fdf4] to-white",
    },
    expired: {
      label: "منتهية الصلاحية",
      badgeClass: "bg-[#fef3c7] text-[#92400e]",
      icon: "⚠️",
      title: "الشهادة منتهية الصلاحية",
      cardClass: "border-[#f59e0b] bg-gradient-to-br from-[#fffbeb] to-white",
    },
    revoked: {
      label: "ملغاة",
      badgeClass: "bg-[#fee2e2] text-[#991b1b]",
      icon: "❌",
      title: "الشهادة ملغاة",
      cardClass: "border-[#f87171] bg-gradient-to-br from-[#fef2f2] to-white",
    },
  };

  const status = result ? statusInfo[result.status] || statusInfo.revoked : null;

  const card = (
    <div className="w-full max-w-150">
            {/* الترويسة */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#eef2ff] mb-4">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h1 className="text-3xl font-extrabold text-primary mb-2">
                التحقق من الإعتمادية
              </h1>
              <p className="text-[#94a3b8] text-sm">
                أدخل كود الشهادة للتحقق من صحتها وصلاحيتها
              </p>
            </div>

            {/* فورم البحث */}
            <div className="bg-white rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] p-8 border border-[#f1f5f9]">
              <label
                htmlFor="code"
                className="block text-[14px] font-bold text-[#334155] mb-2"
              >
                كود الشهادة
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="AISSFC25070050"
                  className="flex-1 px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-[15px] text-[#334155] placeholder-[#94a3b8] outline-none transition-all duration-300 focus:border-primary focus:bg-white focus:ring-4 focus:ring-[rgba(35,82,135,0.08)]"
                  dir="ltr"
                />

                <button
                  onClick={handleVerify}
                  disabled={loading}
                  className="bg-accent text-white px-8 py-3 rounded-xl font-bold text-base transition-all duration-300 hover:bg-[#ce2634] hover:shadow-lg hover:shadow-[rgba(228,42,58,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      جاري التحقق...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      تحقق
                    </>
                  )}
                </button>
              </div>

              {/* رسالة الخطأ */}
              {error && (
                <div className="mt-6 p-5 rounded-xl text-sm font-medium leading-relaxed border bg-[#fee2e2] border-[#f87171] text-[#991b1b] flex items-center gap-3">
                  <span className="text-xl">❌</span>
                  {error}
                </div>
              )}

              {/* نتيجة التحقق */}
              {result && status && (
                <div className={`mt-6 rounded-[20px] border-2 p-8 ${status.cardClass}`}>
                  {/* حالة الشهادة */}
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-3">{status.icon}</div>
                    <h3 className="text-2xl font-extrabold text-[#1e293b] mb-2">
                      {status.title}
                    </h3>
                    <span className={`inline-block px-4 py-1.5 rounded-full text-[13px] font-bold ${status.badgeClass}`}>
                      {status.label}
                    </span>
                  </div>

                  {/* بيانات الشهادة */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/80 rounded-xl p-4 border border-[#f1f5f9]">
                      <p className="text-[12px] font-bold text-[#94a3b8] mb-1">نوع الشهادة</p>
                      <p className="text-[15px] font-bold text-[#334155]">
                        {result.certificate_name || "—"}
                      </p>
                    </div>

                    <div className="bg-white/80 rounded-xl p-4 border border-[#f1f5f9]">
                      <p className="text-[12px] font-bold text-[#94a3b8] mb-1">اسم الحاصل</p>
                      <p className="text-[15px] font-bold text-[#334155]">
                        {result.holder_name || "—"}
                      </p>
                    </div>

                    <div className="bg-white/80 rounded-xl p-4 border border-[#f1f5f9]">
                      <p className="text-[12px] font-bold text-[#94a3b8] mb-1">كود الشهادة</p>
                      <p className="text-[15px] font-bold text-[#334155]">
                        {result.code || "—"}
                      </p>
                    </div>

                    <div className="bg-white/80 rounded-xl p-4 border border-[#f1f5f9]">
                      <p className="text-[12px] font-bold text-[#94a3b8] mb-1">تاريخ الإصدار</p>
                      <p className="text-[15px] font-bold text-[#334155]">
                        {result.issue_date ? result.issue_date.slice(0, 10) : "—"}
                      </p>
                    </div>

                    <div className="bg-white/80 rounded-xl p-4 border border-[#f1f5f9]">
                      <p className="text-[12px] font-bold text-[#94a3b8] mb-1">تاريخ الانتهاء</p>
                      <p className="text-[15px] font-bold text-[#334155]">
                        {result.expiry_date ? result.expiry_date.slice(0, 10) : "غير محدد"}
                      </p>
                    </div>

                    <div className="bg-white/80 rounded-xl p-4 border border-[#f1f5f9]">
                      <p className="text-[12px] font-bold text-[#94a3b8] mb-1">الحالة</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-[12px] font-bold ${status.badgeClass}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* زر عرض PDF */}
                  {result.file_url && (
                    <div className="text-center mt-6">
                      <a
                        href={result.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm no-underline transition-all duration-300 hover:bg-primary-dark hover:shadow-lg hover:shadow-[rgba(35,82,135,0.3)]"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        عرض الشهادة PDF
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
    </div>
  );

  if (embedded) {
    return (
      <div className="w-full flex justify-center">
        {card}
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="page-content">
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
          {card}
        </div>
      </main>
      <Footer />
    </>
  );
}