import { useEffect, useState, useCallback } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";
import Scroll from "../../common/Scroll.jsx";
import Card from "../../common/Card.jsx";

const ITEMS_PER_PAGE = 8;

const FALLBACK_IMG = "assets/imge/0006.jpg";

function getXsrfToken() {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="));

  return cookie ? decodeURIComponent(cookie.split("=")[1]) : "";
}

// معالجة مسار صورة الكود القادمة من Laravel storage
function fixCodeImage(imgPath) {
  if (!imgPath) return null;
  if (imgPath.startsWith("http")) return imgPath;
  if (imgPath.startsWith("/")) return imgPath;
  if (imgPath.startsWith("assets/")) return imgPath;
  return `http://127.0.0.1:8000/storage/${imgPath.replace(/^\/+/, "")}`;
}

export default function Code() {
  const [allItems, setAllItems] = useState([]);
  const [displayedCount, setDisplayedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // التحقق من صلاحيات المدير
  useEffect(() => {
    fetch("/api/me", {
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

  // جلب الأكواد والمعايير من الـ API
  useEffect(() => {
    let cancelled = false;

    async function loadCodes() {
      try {
        const response = await fetch("/api/code-standards", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        const data = await response.json();

        if (cancelled) return;

        // Laravel paginator => data[] | code_standards => مصفوفة مباشرة
        const items =
          (data && data.data) ||
          (data && data.code_standards) ||
          (Array.isArray(data) ? data : []);

        const mapped = (items || []).map((item) => {
          const imgPath =
            item.cover_image_url ||
            fixCodeImage(item.cover_image || item.image);

          return {
            ...item,
            title: item.title || item.titlesubject || "",
            image: imgPath || FALLBACK_IMG,
          };
        });

        setAllItems(mapped);
        setDisplayedCount(Math.min(ITEMS_PER_PAGE, mapped.length));
      } catch (error) {
        console.error("Error fetching code standards:", error);
        if (cancelled) return;
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCodes();

    return () => {
      cancelled = true;
    };
  }, []);

  const loadMore = useCallback(() => {
    setDisplayedCount((prev) => Math.min(prev + ITEMS_PER_PAGE, allItems.length));
  }, [allItems.length]);

  const displayedItems = allItems.slice(0, displayedCount);

  // حذف كود/معيار من قاعدة البيانات
  async function deleteCode(id) {
    if (!confirm("هل أنت متأكد من حذف هذا الكود نهائياً؟")) return;
    try {
      // الحصول على CSRF Cookie
      await fetch("/sanctum/csrf-cookie", {
        method: "GET",
        credentials: "include",
      });

      const xsrfToken = getXsrfToken();

      const response = await fetch(`/api/code-standards/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": xsrfToken,
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert("تم حذف الكود بنجاح");
        setAllItems((prev) => prev.filter((item) => item.id != id));
        setDisplayedCount((prev) => Math.min(prev, allItems.length - 1));
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
        <img src={FALLBACK_IMG} alt="hero-logo" loading="lazy" className="page-hero-bg" />
        <div className="logo-text">
          <p className="page-hero-title">الأكواد والمعايير</p>
        </div>
      </div>
      <main className="page-content">

        <div className="section-title-bar">
          <p>الأكواد والمعايير</p>
        </div>

        <div className="cards-grid" style={{ minHeight: "600px" }}>
          {loading ? (
            <p className="text-center w-full p-12.5">
              جاري تحميل الأكواد...
            </p>
          ) : displayedItems.length === 0 ? (
            <p className="text-center w-full p-12.5">
              لا توجد أكواد لعرضها.
            </p>
          ) : (
            displayedItems.map((item, idx) => {
              const title = (item.title || "").trim();
              const slug = title.replace(/[^\u0600-\u06FFa-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "");
              const idParam = item.id != null ? `${item.id}-${slug}` : slug;

              const isDbItem = item.id != null;

              return (
                <Card
                  key={item.id ?? idx}
                  id={item.id ?? idx}
                  title={title}
                  image={item.image || FALLBACK_IMG}
                  fallbackImage={FALLBACK_IMG}
                  href={`/views?id=${idParam}&source=codes`}
                  btnText="عرض التفاصيل"
                  editLink={isAdmin && isDbItem ? `/admin/edit-code/${item.id}` : null}
                  onDelete={isAdmin && isDbItem ? () => deleteCode(item.id) : null}
                />
              );
            })
          )}
        </div>

        {displayedCount < allItems.length && (
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