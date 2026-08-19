import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";
import Scroll from "../../common/Scroll.jsx";
import Card from "../../common/Card.jsx";

const API_URL = "";

function getXsrfToken() {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="));

  return cookie ? decodeURIComponent(cookie.split("=")[1]) : "";
}

export default function Magazines() {
  const [magazines, setMagazines] = useState([]);
  const [sortedMagazines, setSortedMagazines] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [isAdmin, setIsAdmin] = useState(false);

  // Fix image path for magazines (same as articles)
  function fixMagazineImage(imgPath) {
    if (!imgPath) return "assets/magazine/placeholder.webp";
    if (imgPath.startsWith("http")) return imgPath;
    if (imgPath.startsWith("/Aiss")) return imgPath;
    if (imgPath.startsWith("/")) return imgPath;
    // Images stored in backend/assets/uploads/
    return "/Aiss/backend/" + imgPath;
  }

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    async function loadMagazines() {
      try {
        const response = await fetch(`${API_URL}/api/magazines`);
        const data = await response.json();
        const items = data.magazines || data.data || (Array.isArray(data) ? data : []);
        if (items.length > 0) {
          setMagazines(items);
        }
      } catch (error) {
        console.error("Error fetching magazines:", error);
      }
    }
    loadMagazines();
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
    let sorted = [...magazines];
    if (sortOrder === "newest") {
      sorted.sort((a, b) => b.id - a.id);
    } else {
      sorted.sort((a, b) => a.id - b.id);
    }
    setSortedMagazines(sorted);
  }, [magazines, sortOrder]);

  async function deleteMagazine(id) {
    if (!confirm("هل أنت متأكد من حذف هذه المجلة؟")) return;
    try {
      // Get CSRF token
      await fetch(`${API_URL}/sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
      });

      const xsrfToken = getXsrfToken();

      const response = await fetch(`${API_URL}/api/magazines/${id}`, {
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
        setMagazines((prev) => prev.filter((m) => m.id != id));
      } else {
        alert("فشل الحذف: " + (data.message || "خطأ غير معروف"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("حدث خطأ في الاتصال بالسيرفر");
    }
  }

  const latestMagazines = sortedMagazines.slice(0, 4);

  return (
    <>
      <Header />
      <div className="page-hero">
        <img src="assets/imge/0004.jpg" alt="magazine-pic" loading="lazy" className="page-hero-bg" />
        <div className="logo-text">
          <p className="page-hero-title">المجلات</p>
        </div>
      </div>
      <main className="page-content">

        {/* أحدث الإصدارات */}
        <div className="section-title-bar">
          <p>
            <span className="text-accent">آخر</span> ما تم إصدارة
          </p>
        </div>

        <div className="cards-grid">
          {latestMagazines.map((item, idx) => (
            <Card
              key={item.id ?? idx}
              id={item.id ?? idx}
              title={item.title}
              image={fixMagazineImage(item.cover_image)}
              fallbackImage="assets/magazine/placeholder.webp"
              href={`/flipbook?id=${item.id}&type=magazine&title=${encodeURIComponent(item.title)}`}
              btnText="عرض المجلة"
              editLink={isAdmin ? `/admin/edit-magazine/${item.id}` : null}
              onDelete={isAdmin ? () => deleteMagazine(item.id) : null}
            />
          ))}
        </div>

        {/* جميع الإصدارات */}
        <div className="section-title-bar">
          <p>
            <span className="text-accent">إصدارات</span> مجلات السلامة العربية
          </p>
        </div>

        <div className="filter-bar">
          <label htmlFor="magazines-sort" className="font-bold text-[15px] whitespace-nowrap">ترتيب المجلات:</label>
          <select
            id="magazines-sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3.75 py-1.5 text-[14px] appearance-none bg-white rounded-[30px] border border-black font-bold text-accent cursor-pointer outline-none transition-all duration-300 ease-in-out hover:bg-[#ecebeb]"
            style={{
              backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23e4293a' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "left 2px center"
            }}
          >
            <option value="newest">من الأحدث للأقدم</option>
            <option value="oldest">من الأقدم للأحدث</option>
          </select>
        </div>

        <div className="cards-grid">
          {sortedMagazines.map((item, idx) => (
            <Card
              key={item.id ?? idx}
              id={item.id ?? idx}
              title={item.title}
              image={fixMagazineImage(item.cover_image)}
              fallbackImage="assets/magazine/placeholder.webp"
              href={`/flipbook?id=${item.id}&type=magazine&title=${encodeURIComponent(item.title)}`}
              btnText="عرض المجلة"
              editLink={isAdmin ? `/admin/edit-magazine/${item.id}` : null}
              onDelete={isAdmin ? () => deleteMagazine(item.id) : null}
            />
          ))}
        </div>
      </main>
      <Scroll />
      <Footer />
    </>
  );
}