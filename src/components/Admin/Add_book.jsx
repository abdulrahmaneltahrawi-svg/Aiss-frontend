import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "";

function getXsrfToken() {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="));

  return cookie ? decodeURIComponent(cookie.split("=")[1]) : "";
}

function Add_book() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/me`, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    })
      .then((r) => r.json())
      .then((data) => {
        const user = data.user || data;
        if (!data || !user || user.can_add_article != 1) {
          window.location.href = "/";
        }
      })
      .catch(() => {
        window.location.href = "/";
      });
  }, []);

  async function handleSave(e) {
  e.preventDefault();
    if (!title || !coverImage || !pdfFile) {
      alert("يرجى ملء جميع الحقول واختيار الملفات المطلوبة");
      return;
    }

    try {
      // 1. CSRF Cookie
      await fetch(`${API_URL}/sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
      });

      const xsrfToken = getXsrfToken();

      if (!xsrfToken) {
        alert("لم يتم الحصول على CSRF Token");
        return;
      }

      // 2. تجهيز FormData
      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", slug);
      formData.append("cover_image", coverImage);
      formData.append("file", pdfFile);

      // 3. إرسال إلى Laravel
      const res = await fetch(`${API_URL}/api/booklets`, {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": xsrfToken,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "فشل إضافة الكتيب");
        return;
      }

      alert("تم إضافة الكتيب بنجاح");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("حصل خطأ في الاتصال بالخادم");
    }
  }

  return (
    <div className="min-h-screen pt-35 lg:pt-37.5 pb-10 px-4 sm:px-6">
      <div className="max-w-300 mx-auto flex flex-col lg:flex-row gap-7.5 items-start">
        <aside className="hidden lg:block w-62.5 shrink-0 bg-white p-5 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.06)]">
          <h3 className="text-primary text-lg font-bold mb-5">القائمة</h3>
          <ul className="flex flex-col gap-2.5 p-0 m-0 list-none">
            <li>
              <Link
                to="/admin"
                className="block px-4 py-3 rounded-[10px] text-[#444] font-bold no-underline transition-colors duration-300 hover:bg-sidebar-bg hover:text-accent"
              >
                الرجوع
              </Link>
            </li>
            <li>
              <Link
                to="/admin/add-book"
                className="block px-4 py-3 rounded-[10px] font-bold no-underline transition-colors duration-300 bg-sidebar-bg text-accent"
              >
                إضافة كتيب
              </Link>
            </li>
          </ul>
        </aside>

        <form
  onSubmit={handleSave}
  className="flex-1 w-full bg-white p-6 sm:p-7.5 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.06)]"
>
          <h2 className="text-primary text-2xl font-bold mb-6.25">إضافة كتيب جديد</h2>

          <div className="mb-5">
            <label className="block mb-2 font-bold text-primary">عنوان الكتيب:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="أدخل عنوان الكتيب هنا..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-2.5 focus:border-primary focus:outline-none"
            />
            <label className="block mb-2 font-bold text-primary">الكتيب باللغة الانجليزية:</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="أدخل اسم الكتيب بالانجليزي..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-2.5 focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block mb-2 font-bold text-primary">صورة الكتيب:</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(e) => setCoverImage(e.target.files[0])}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 font-bold text-primary">ملف الكتيب:</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files[0])}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <button
  type="submit"
  className="bg-accent text-white border-none py-3 px-7.5 rounded-lg font-bold cursor-pointer text-base transition-colors duration-300 hover:bg-accent-dark"
>
              حفظ ونشر الكتيب
            </button>
            <Link
              to="/"
              className="inline-block py-2.5 px-5 bg-primary text-white no-underline rounded-lg font-bold text-center transition-colors duration-300 hover:bg-[#1a3d63] hover:text-white"
            >
              الرجوع للموقع
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Add_book;