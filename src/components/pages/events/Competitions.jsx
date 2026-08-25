import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";
import Scroll from "../../common/Scroll.jsx";
import Card from "../../common/Card.jsx";

const FALLBACK_IMG = "assets/icons/logo.webp";
const API_URL = "";

// المسار المطابق للمسار الخلفي: Route::get('/competitions', [CompetitionController::class, 'index']);
const GET_URL = `${API_URL}/api/competitions`;

function getXsrfToken() {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="));

  return cookie ? decodeURIComponent(cookie.split("=")[1]) : "";
}

// معالجة مسار صورة المسابقة من Laravel storage (نفس نمط Conferences.jsx)
function fixStoragePath(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return path;
  if (path.startsWith("competitions/")) {
    return `http://localhost/aiss-backend/public/storage/${path}`;
  }
  return `http://127.0.0.1:8000/storage/${path}`;
}

export default function Events() {
  // قائمة المسابقات من الـ API (GET /api/competitions)
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    async function loadCompetitions() {
      try {
        const response = await fetch(GET_URL, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        const data = await response.json();

        const list = Array.isArray(data)
          ? data
          : (data.competitions || data.data || []);

        // ترتيب تصاعدي
        list.sort((a, b) => a.id - b.id);
        setCompetitions(list);
      } catch (err) {
        console.error("Error fetching competitions:", err);
        setCompetitions([]);
      } finally {
        setLoading(false);
      }
    }

    loadCompetitions();

    // فحص صلاحية المشرف
    fetch(`${API_URL}/api/me`, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    })
      .then((r) => r.json())
      .then((data) => {
        const user = data.user || data;
        if (user && (user.role === "admin" || user.can_add_article == 1)) {
          setIsAdmin(true);
        }
      })
      .catch(() => {});
  }, []);

  // حذف مسابقة: Route::delete('/competitions/{competition}', [CompetitionController::class, 'destroy']);
  async function deleteCompetition(id) {
    if (!confirm("هل أنت متأكد من حذف هذه المسابقة؟")) return;

    try {
      // الحصول على CSRF Cookie
      await fetch(`${API_URL}/sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
      });

      const xsrfToken = getXsrfToken();

      const response = await fetch(`${API_URL}/api/competitions/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": xsrfToken,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        alert("تم حذف المسابقة بنجاح");
        setCompetitions((prev) => prev.filter((c) => c.id != id));
      } else {
        alert("فشل الحذف: " + (data.message || "خطأ غير معروف"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("حدث خطأ في الاتصال بالسيرفر");
    }
  }

  return (
    <>
      <Header />
      <main className="page-content">
        {/* Hero Section */}
        <div className="page-hero">
          <img src="assets/imge/0006.jpg" alt="hero-logo" loading="lazy" className="page-hero-bg" />
          <div className="logo-text">
            <p className="page-hero-title">مسابقات السلامة العربية</p>
          </div>
        </div>

        {/* Section Title */}
        <div className="section-title-bar">
          <p>مسابقات السلامة العربية</p>
        </div>

        {/* Competition Section */}
        <section id="arabic-competition-section" className="competition-section active">
          <div className="text-center bg-white text-accent p-[20px_40px] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] mb-7.5 border-t-[5px] border-accent max-w-225 mx-auto mt-12.5" data-aos="fade-down">
            <h1 className="comp-main-title text-[2.2rem] mb-5">مسابقة السلامة العربية</h1>
            <p className="text-[1.15rem] leading-[1.8] text-[#636e72] max-w-225 mx-auto">
              تُعد مسابقة السلامة العربية، التي ينظمها المعهد العربي لعلوم
              السلامة، إحدى أبرز المبادرات العلمية العربية المتخصصة في مجال
              علوم السلامة والصحة المهنية، حيث تُقام للعام الخامس على التوالي
              على مستوى الوطن العربي، استمرارًا لرسالة المعهد في دعم البحث
              العلمي وتعزيز ثقافة السلامة والابتكار.
            </p>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-7.5 max-w-300 mx-auto p-5">
            <div className="bg-white p-3.75 rounded-[15px] border transition-all duration-300 ease-in-out border-b-[5px] border-black hover:-translate-y-2.5 hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)]" data-aos="fade-right" data-aos-delay="200">
              <div className="card-icon">
                <img src="assets/icons/goal (2).png" alt="goals" className="text-[40px] mb-3.75 w-10 h-10" />
              </div>
              <h3 className="text-[1.5rem] mb-3.75 text-accent">أهداف المسابقة</h3>
              <p className="text-[1rem] leading-[1.7] text-justify">
                تهدف المسابقة إلى توفير منصة علمية تجمع الباحثين والمبتكرين
                والمهتمين بعلوم السلامة من مختلف الدول العربية، لعرض أبحاثهم
                وأفكارهم ومشروعاتهم المتميزة، بما يسهم في تطوير حلول مبتكرة
                وممارسات فعّالة تعزز مستويات السلامة في بيئات العمل والمجتمع.
              </p>
            </div>

            <div className="bg-white p-3.75 rounded-[15px] border transition-all duration-300 ease-in-out border-b-[5px] border-black hover:-translate-y-2.5 hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)]" data-aos="fade-left" data-aos-delay="400">
              <div className="card-icon">
                <img src="assets/icons/medal (1).png" alt="reword" className="text-[40px] mb-3.75 w-10 h-10" />
              </div>
              <h3 className="text-[1.5rem] mb-3.75 text-primary">جوائز قيمة وتقدير</h3>
              <p className="text-[1rem] leading-[1.7] text-justify">
                وتمنح المسابقة جوائز قيمة، تقديرًا للأبحاث والابتكارات
                المتميزة التي تقدم قيمة علمية وعملية حقيقية في مجالات علوم
                السلامة المختلفة.
              </p>
            </div>
          </div>

          {/* دورات مسابقة السلامة العربية */}
          <div className="section-title-bar mt-10">
            <p>دورات مسابقة السلامة العربية</p>
          </div>
          <div className="cards-grid" style={{ minHeight: "200px" }}>
            {loading ? (
              <p className="text-center w-full p-12">
                جاري تحميل المسابقات...
              </p>
            ) : competitions.length === 0 ? (
              <p className="text-center w-full p-12">
                لا توجد مسابقات حالياً.
              </p>
            ) : (
              competitions.map((item) => (
                <Card
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  image={item.image_url || fixStoragePath(item.image)}
                  fallbackImage={FALLBACK_IMG}
                  href={`/competitions/${item.id}`}
                  btnText="عرض التفاصيل"
                  editLink={isAdmin ? `/admin/edit-competition/${item.id}` : undefined}
                  onDelete={isAdmin ? () => deleteCompetition(item.id) : undefined}
                />
              ))
            )}
          </div>
        </section>
      </main>
      <Scroll />
      <Footer />
    </>
  );
}