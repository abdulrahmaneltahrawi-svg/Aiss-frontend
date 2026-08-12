import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";
import Card from "../../common/Card.jsx";

const ITEMS_PER_PAGE = 8;

function fixImagePath(imgPath) {
  if (imgPath && !imgPath.startsWith("http") && !imgPath.startsWith("/")) {
    return "/Aiss/backend/" + imgPath;
  }
  return imgPath || "assets/imge/0006.jpg";
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
    fetch("/api/check_user_auth.php", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated && data.user && (data.user.role === "admin" || data.user.can_add_article == 1)) {
          setIsAdmin(true);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/api/get_booklets.php");
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
      const formData = new FormData();
      formData.append("booklet_id", id);
      const response = await fetch("/api/delete_booklet.php", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        alert("تم الحذف بنجاح");
        setAllItems((prev) => prev.filter((item) => item.id != id));
        setDisplayedCount((prev) => Math.min(prev, allItems.length - 1));
      } else {
        alert("فشل الحذف: " + data.message);
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
                  editLink={isAdmin ? `/admin/edit-book?id=${item.id}` : null}
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