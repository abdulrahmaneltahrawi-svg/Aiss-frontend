import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";
import Card from "../../common/Card.jsx";

const FALLBACK_IMG = "assets/icons/logo.webp";
const API_URL = "";

function getXsrfToken() {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="));

  return cookie ? decodeURIComponent(cookie.split("=")[1]) : "";
}

// دالة لاستخراج رقم المؤتمر من العنوان
function getConferenceNumber(title = "") {
  const match = title.match(/(الأول|الثاني|الثالث|الرابع|الخامس|السادس|السابع|الثامن|التاسع|العاشر)/);
  const arabicNumbers = {
    "الأول": 1,
    "الثاني": 2,
    "الثالث": 3,
    "الرابع": 4,
    "الخامس": 5,
    "السادس": 6,
    "السابع": 7,
    "الثامن": 8,
    "التاسع": 9,
    "العاشر": 10,
  };
  return match ? arabicNumbers[match[1]] : null;
}

// معالجة مسار صورة المؤتمر من Laravel storage
function fixStoragePath(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return path;
  if (path.startsWith("conferences/")) {
    return `http://localhost/aiss-backend/public/storage/${path}`;
  }
  return `http://127.0.0.1:8000/storage/${path}`;
}

export default function Conferences() {
  const [conferences, setConferences] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchParams] = useSearchParams();
  const confParam = searchParams.get("conf");

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    async function loadConferences() {
      try {
        const response = await fetch(`${API_URL}/api/conferences`, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        const data = await response.json();

        const confs = Array.isArray(data)
          ? data
          : (data.conferences || data.data || []);

        // ترتيب تصاعدي (الأول أولاً)
        confs.sort((a, b) => a.id - b.id);
        setConferences(confs);
      } catch (err) {
        console.error("Error fetching conferences:", err);
        setConferences([]);
      }
    }

    loadConferences();
  }, []);

  // تطبيق الفلتر حسب رقم المؤتمر المحدد في الرابط
  const filteredConferences = confParam
    ? conferences.filter((item) => String(getConferenceNumber(item.title)) === String(confParam))
    : conferences;

  const currentConference = confParam
    ? conferences.find((item) => String(getConferenceNumber(item.title)) === String(confParam))
    : null;

  // فحص صلاحية المشرف
  useEffect(() => {
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

  async function deleteConference(id) {
    if (!confirm("هل أنت متأكد من حذف هذا المؤتمر؟")) return;
    try {
      // Get CSRF token
      await fetch(`${API_URL}/sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
      });

      const xsrfToken = getXsrfToken();

      const response = await fetch(`${API_URL}/api/conferences/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": xsrfToken,
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert("تم حذف المؤتمر بنجاح");
        setConferences((prev) => prev.filter((c) => c.id != id));
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
      <div className="page-hero">
        <img src="assets/imge/0006.jpg" alt="hero-logo" loading="lazy" className="page-hero-bg" />
        <div className="logo-text">
          <p className="page-hero-title">
            {currentConference ? currentConference.title : "مؤتمرات السلامة العربية"}
          </p>
        </div>
      </div>
      <main className="page-content">

        <div className="section-title-bar">
          <p>
            {currentConference ? (
              <span>
                <span className="text-black">{currentConference.title}</span>
              </span>
            ) : (
              "مؤتمرات السلامة العربية"
            )}
          </p>
        </div>

        <div className="cards-grid gap-7" style={{ minHeight: "300px" }}>
          {filteredConferences.length === 0 ? (
            <p className="text-center w-full p-12">
              جاري تحميل المؤتمرات...
            </p>
          ) : (
            filteredConferences.map((item, idx) => (
              <Card
                key={item.id ?? idx}
                id={item.id ?? idx}
                title={item.title}
                image={item.image_url || fixStoragePath(item.image)}
                fallbackImage={FALLBACK_IMG}
                href={`/conferences/${item.id}`}
                btnText="عرض التفاصيل"
                editLink={isAdmin ? `/admin/edit-conference/${item.id}` : undefined}
                onDelete={isAdmin ? () => deleteConference(item.id) : undefined}
              />
            ))
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}