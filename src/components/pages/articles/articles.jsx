import { useEffect, useState, useCallback } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";
import Scroll from "../../common/Scroll.jsx";
import Card from "../../common/Card.jsx";

function slugify(text = "") {
  return text
    .trim()
    .replace(/[^\u0600-\u06FFa-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getCategory(item) {
  if (item.source === "db") {
    if (item.type == 0) return "محتويات علمية";
    if (item.type == 1) return "مقالات الخبراء";
    if (item.type == 2) return "مقالات المجلة";
  }
  return item.category || "مقالات تجربه";
}

const CATEGORIES = ["محتويات علمية", "مقالات الخبراء", "مقالات المجلة"];
const BLOGS_PER_PAGE = 8;

export default function Articles() {
  const [allBlogs, setAllBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [displayedCount, setDisplayedCount] = useState(0);
  const [category, setCategory] = useState("all");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // Get initial category from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialCat = params.get("cat");
    if (initialCat && CATEGORIES.includes(initialCat)) {
      setCategory(initialCat);
    }
  }, []);

  // Fetch blogs
  useEffect(() => {
    async function loadBlogs() {
      try {
        const response = await fetch("/api/articles");
        const data = await response.json();
        const articlesArray = data.articles || data.data || (Array.isArray(data) ? data : []);
        const mapped = (articlesArray || []).map((a) => {
          // Fix image path - Laravel storage
          let imgPath = a.cover_image || a.image || "";
          if (imgPath && !imgPath.startsWith("http") && !imgPath.startsWith("/")) {
            imgPath = "/" + imgPath;
          }
          return {
            ...a,
            source: "db",
            img: imgPath,
            title: a.title,
          };
        });
        setAllBlogs(mapped);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    }
    loadBlogs();
  }, []);

  // Apply filter when blogs or category changes
  useEffect(() => {
    let filtered =
      category === "all"
        ? allBlogs
        : allBlogs.filter((it) => getCategory(it) === category);
    setFilteredBlogs(filtered);
    setDisplayedCount(Math.min(BLOGS_PER_PAGE, filtered.length));
  }, [allBlogs, category]);

  const loadMore = useCallback(() => {
    setDisplayedCount((prev) =>
      Math.min(prev + BLOGS_PER_PAGE, filteredBlogs.length)
    );
  }, [filteredBlogs.length]);

  async function deleteArticle(id) {
    if (!confirm("هل أنت متأكد من حذف هذا المقال نهائياً؟")) return;
    try {
      // Get CSRF token
      await fetch("/sanctum/csrf-cookie", {
        method: "GET",
        credentials: "include",
      });

      const xsrfCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="));

      const xsrfToken = xsrfCookie
        ? decodeURIComponent(xsrfCookie.split("=")[1])
        : "";

      const response = await fetch(
        `/api/articles/${id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "X-XSRF-TOKEN": xsrfToken,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("تم حذف المقال بنجاح");
        setAllBlogs((prev) => prev.filter((blog) => blog.id != id));
      } else {
        alert("فشل الحذف: " + (data.message || "خطأ غير معروف"));
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("حدث خطأ في الاتصال بالسيرفر");
    }
  }

  const displayedBlogs = filteredBlogs.slice(0, displayedCount);
  const latestBlogs = allBlogs.slice(0, 4);

  return (
    <>
      <Header />
      <div className="page-hero">
        <img src="assets/imge/0006.jpg" alt="blogs-pic" loading="lazy" className="page-hero-bg" />
        <div className="logo-text">
          <p className="page-hero-title">المقالات</p>
        </div>
      </div>
      <main className="page-content">

        {/* أحدث الإصدارات */}
        <div className="section-title-bar">
          <p>
            <span className="text-accent">آخر</span> ما تم إصدارة
          </p>
        </div>

        <div className="cards-grid gap-10.5">
          {latestBlogs.map((item, idx) => {
            const slug = slugify(item.title);
            const idParam =
              item.source === "db"
                ? `${item.id}-${slug}`
                : slug;
            const link = `/views?id=${item.id}&source=article`;
            const image =
              item.img || item.cover_image || "assets/magazine/placeholder.webp";

            return (
              <Card
                key={item.id ?? idx}
                id={item.id ?? idx}
                title={item.title}
                image={image}
                fallbackImage="assets/magazine/IMG_1325.webp"
                href={link}
                btnText="عرض المدونة"
                editLink={isAdmin && item.source === "db" ? `/admin/edit-article/${item.id}` : null}
                onDelete={isAdmin && item.source === "db" ? () => deleteArticle(item.id) : null}
              />
            );
          })}
        </div>

        {/* جميع المدونات */}
        <div className="section-title-bar">
          <p>كتابات و مدونات</p>
        </div>

        <div className="filter-bar gap-1.25 px-6.25 mt-5">
          <label htmlFor="blog-category" className="font-bold text-[#666] text-[15px] whitespace-nowrap p-2">التصنيف:</label>
          <select
            id="blog-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3.75 py-1.5 text-[14px] appearance-none bg-white rounded-[30px] border-[1.5px] border-accent font-bold text-accent cursor-pointer outline-none transition-all duration-300 ease-in-out hover:bg-[#ecebeb]"
            style={{
              backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23e4293a' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "left 1px center"
            }}
          >
            <option value="all">الكل</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div
          id="blogs-grid"
          className="cards-grid"
          style={{ minHeight: "600px" }}
        >
          {displayedBlogs.length === 0 ? (
            <p className="text-center w-full p-12.5">
              {allBlogs.length === 0
                ? "جاري تحميل المدونات..."
                : "لا توجد مقالات لعرضها."}
            </p>
          ) : (
            displayedBlogs.map((item, idx) => {
              const slug = slugify(item.title);
              const idParam =
                item.source === "db"
                  ? `${item.id}-${slug}`
                  : slug;
              const link = `/views?id=${item.id}&source=article`;
              const image =
                item.img || item.cover_image || "assets/magazine/placeholder.webp";

              return (
                <Card
                  key={item.id ?? idx}
                  id={item.id ?? idx}
                  title={item.title}
                  image={image}
                  fallbackImage="assets/magazine/IMG_1325.webp"
                  href={link}
                  btnText="عرض المدونة"
                  editLink={isAdmin && item.source === "db" ? `/admin/edit-article/${item.id}` : null}
                  onDelete={isAdmin && item.source === "db" ? () => deleteArticle(item.id) : null}
                />
              );
            })
          )}
        </div>

        {displayedCount < filteredBlogs.length && (
          <div className="text-center my-[20px_0_40px] w-full flex justify-center">
            <button
              id="load-more-blogs"
              className="btn1 inline-block"
              onClick={loadMore}
            >
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