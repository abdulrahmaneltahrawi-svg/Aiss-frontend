import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const API_URL = "";

function getXsrfToken() {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="));

  return cookie ? decodeURIComponent(cookie.split("=")[1]) : "";
}

function Edit_magazine() {
  const navigate = useNavigate();
  const { id } = useParams();
  const magazineId = id ? id.split("-")[0] : null;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    if (!magazineId) {
      alert("معرف المجلة غير موجود. الرجاء اختيار مجلة من صفحة المجلات");
      navigate("/magazine");
      return;
    }

    loadMagazineData();

    fetch(`${API_URL}/api/me`, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    })
      .then((r) => r.json())
      .then((data) => {
        const user = data.user || data;
        if (
          !user ||
          (user.role !== "admin" && user.can_add_article != 1)
        ) {
          navigate("/");
        }
      });
  }, []);

  async function loadMagazineData() {
    try {
      const response = await fetch(`${API_URL}/api/magazines/${magazineId}`);
      const data = await response.json();

      const magazineData = data.magazine || data;

      if (response.ok && magazineData) {
        setTitle(magazineData.title);
        setSlug(magazineData.slug || "");
      } else {
        alert("فشل في جلب بيانات المجلة");
      }
    } catch (err) {
      console.error("Error loading data:", err);
    }
  }

  async function saveMagazineChanges() {
    try {
      // Get CSRF token
      await fetch(`${API_URL}/sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
      });

      const xsrfToken = getXsrfToken();

      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("magazine_id", magazineId);
      formData.append("title", title);
      formData.append("slug", slug);

      if (coverImage) formData.append("cover_image", coverImage);
      if (pdfFile) formData.append("file", pdfFile);

      const response = await fetch(`${API_URL}/api/magazines/${magazineId}`, {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": xsrfToken,
        },
      });
      const data = await response.json();

      if (response.ok) {
        alert("تم تحديث المجلة بنجاح!");
        navigate("/magazine");
      } else {
        alert("خطأ: " + (data.message || "فشل التحديث"));
      }
    } catch (err) {
      console.error("Error updating:", err);
      alert("خطأ في الاتصال بالسيرفر");
    }
  }

  return (
    <div className="min-h-screen pt-35 lg:pt-37.5 pb-10 px-4 sm:px-6">
      <div className="max-w-300 mx-auto flex flex-col lg:flex-row gap-7.5 items-start">
        <aside className="block w-full lg:w-62.5 lg:shrink-0 bg-white p-5 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.06)]">
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
                to="/magazine"
                className="block px-4 py-3 rounded-[10px] font-bold no-underline transition-colors duration-300 bg-sidebar-bg text-accent"
              >
                اختيار مجلة للتعديل
              </Link>
            </li>
          </ul>
        </aside>

        <form className="flex-1 w-full bg-white p-6 sm:p-7.5 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.06)]">
          <h2 className="text-primary text-2xl font-bold mb-6.25">تعديل المجلة</h2>

          <div className="mb-5">
            <label className="block mb-2 font-bold text-primary">عنوان المجلة:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="أدخل عنوان المجلة هنا..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-2.5 focus:border-primary focus:outline-none"
            />
            <label className="block mb-2 font-bold text-primary">المجلة باللغة الانجليزية:</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="أدخل اسم المجلة بالانجليزي..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-2.5 focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block mb-2 font-bold text-primary">صورة المجلة:</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(e) => setCoverImage(e.target.files[0])}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 font-bold text-primary">ملف المجلة:</label>
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
              type="button"
              className="bg-primary text-white border-none py-3 px-7.5 rounded-lg font-bold cursor-pointer text-base transition-colors duration-300 hover:bg-primary-dark"
              onClick={saveMagazineChanges}
            >
              حفظ ونشر التعديل
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

export default Edit_magazine;