import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";
import Card from "../../common/Card.jsx";

const ITEMS_PER_PAGE = 8;
const API_URL = "";

function getXsrfToken() {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="));

  return cookie ? decodeURIComponent(cookie.split("=")[1]) : "";
}

function fixImagePath(imgPath) {
  if (!imgPath) return "assets/imge/0006.jpg";
  if (imgPath.startsWith("http")) return imgPath;
  if (imgPath.startsWith("/Aiss")) return imgPath;
  if (imgPath.startsWith("/")) return imgPath;
  // Laravel storage paths (booklets/images/..., booklets/files/...)
  if (imgPath.startsWith("booklets/") || imgPath.startsWith("magazines/")) {
    return "http://localhost/aissco-backend-dev/public/storage/" + imgPath;
  }
  // Legacy PHP uploads (assets/uploads/...)
  return "/Aiss/backend/" + imgPath;
}

export default function Books() {
  const [allItems, setAllItems] = useState([]);
  const [displayedCount, setDisplayedCount] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // Check if user is admin
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

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(`${API_URL}/api/booklets`);
        const data = await response.json();
        const items = data.booklets || data.data || (Array.isArray(data) ? data : []);
        setAllItems(items);
        setDisplayedCount(Math.min(ITEMS_PER_PAGE, items.length));
      } catch (error) {
        console.error("Error fetching manuals:", error);
      }
    }
    loadData();
  }, []);

  const loadMore = useCallback(() => {
    setDisplayedCount((prev) => Math.min(prev + ITEMS_PER_PAGE, allItems.length));
  }, [allItems.length]);

  const displayedItems = allItems.slice(0, displayedCount);

  async function deleteBooklet(id) {
    if (!confirm("هل أنت متأكد من حذف هذا الكتيب؟")) return;
    try {
      // Get CSRF token
      await fetch(`${API_URL}/sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
      });

      const xsrfToken = getXsrfToken();

      const response = await fetch(`${API_URL}/api/booklets/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": xsrfToken,
        },
      });
      const data = await response.json();
      if (response.ok) {
        alert("تم الحذف بنجاح");
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
        <img src="assets/imge/0006.jpg" alt="manuals-pic" loading="lazy" className="page-hero-bg" />
        <div className="logo-text">
          <p className="page-hero-title">كتيبات السلامة</p>
        </div>
      </div>
      <main className="page-content">

        <div className="section-title-bar">
          <p>كتيبات السلامة</p>
        </div>

        <div className="cards-grid" style={{ minHeight: "600px" }}>
          {displayedItems.length === 0 ? (
            <p className="text-center w-full p-5">
              {allItems.length === 0 ? "لا يوجد كتيبات" : "لا توجد كتيبات لعرضها."}
            </p>
          ) : (
            displayedItems.map((item, idx) => {
              const title = (item.titlesubject || item.title || "").trim();
              const slug = title.replace(/[^\u0600-\u06FFa-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "");

              return (
                <Card
                  key={item.id ?? idx}
                  id={item.id ?? idx}
                  title={title}
                  image={fixImagePath(item.cover_image || item.image)}
                  fallbackImage="assets/imge/0006.jpg"
                  href={`/flipbook?id=${item.id}&type=booklet&title=${encodeURIComponent(title)}`}
                  btnText="عرض الكتيب"
                  editLink={isAdmin ? `/admin/edit-book/${item.id}` : null}
                  onDelete={isAdmin ? () => deleteBooklet(item.id) : null}
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
      <Footer />
    </>
  );
}