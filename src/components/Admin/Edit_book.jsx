import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

function Edit_book() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookletId = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    if (!bookletId) {
      alert("معرف الكتيب غير موجود");
      navigate("/admin");
      return;
    }

    loadBookletData();

    fetch("/api/check_user_auth.php")
      .then((r) => r.json())
      .then((data) => {
        if (
          !data.authenticated ||
          (data.user.role !== "admin" && data.user.can_add_article !== 1)
        ) {
          window.location.href = "/";
        }
      });
  }, []);

  async function loadBookletData() {
    try {
      const response = await fetch(`/api/get_booklet.php?id=${bookletId}`);
      const data = await response.json();

      if (data.success) {
        setTitle(data.booklet.title);
        setSlug(data.booklet.slug || "");
      } else {
        alert("فشل في جلب بيانات الكتيب: " + data.message);
      }
    } catch (err) {
      console.error("Error loading data:", err);
    }
  }

  async function saveBooklet() {
    if (!title || !slug) {
      alert("يرجى ملء العنوان والاسم اللطيف");
      return;
    }

    const formData = new FormData();
    formData.append("booklet_id", bookletId);
    formData.append("title", title);
    formData.append("slug", slug);

    if (coverImage) formData.append("cover_image", coverImage);
    if (pdfFile) formData.append("file", pdfFile);

    try {
      const res = await fetch("/api/update_booklet.php", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert("تم تحديث الكتيب بنجاح!");
        navigate("/manuals");
      } else {
        alert("خطأ: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("خطأ في الاتصال بالسيرفر");
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
                to="/admin/edit-book"
                className="block px-4 py-3 rounded-[10px] font-bold no-underline transition-colors duration-300 bg-sidebar-bg text-accent"
              >
                تعديل كتيب
              </Link>
            </li>
          </ul>
        </aside>

        <form className="flex-1 w-full bg-white p-6 sm:p-7.5 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.06)]">
          <h2 className="text-primary text-2xl font-bold mb-6.25">تعديل الكتيب</h2>

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
              className="bg-primary text-white border-none py-3 px-7.5 rounded-lg font-bold cursor-pointer text-base transition-colors duration-300 hover:bg-primary-dark"
              onClick={saveBooklet}
            >
              حفظ ونشر التعديل
            </button>
            <Link
              to="/"
              className="inline-block py-2.5 px-5 bg-primary text-white no-underline rounded-lg font-bold text-center transition-colors duration-300 hover:bg-primary-dark hover:text-white"
            >
              الرجوع للموقع
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Edit_book;