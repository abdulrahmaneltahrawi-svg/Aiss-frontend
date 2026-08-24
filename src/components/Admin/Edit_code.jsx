import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

function getXsrfToken() {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="));

  return cookie ? decodeURIComponent(cookie.split("=")[1]) : "";
}

function Edit_code() {
  const navigate = useNavigate();
  const { id } = useParams();
  const codeId = id ? id.split("-")[0] : null;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [innerImage, setInnerImage] = useState(null);
  const [existingCoverImage, setExistingCoverImage] = useState("");
  const [existingInnerImage, setExistingInnerImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ align: ["right", "center", "left", "justify"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["blockquote", "code-block"],
      [{ direction: "rtl" }],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "align",
    "list",
    "bullet",
    "link",
    "image",
    "blockquote",
    "code-block",
    "direction",
  ];

  useEffect(() => {
    if (!codeId) {
      alert("معرف الكود غير موجود");
      navigate("/admin");
      return;
    }

    checkAuth();
    loadCodeData();
  }, []);

  async function checkAuth() {
    try {
      const response = await fetch("/api/me", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        navigate("/");
        return;
      }

      const currentUser = data.user || data;

      if (currentUser.can_add_article != 1) {
        navigate("/");
        return;
      }
    } catch (error) {
      console.error("Auth error:", error);
      navigate("/");
    }
  }

  async function loadCodeData() {
    try {
      const response = await fetch(`/api/code-standards/${codeId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      const codeData = data.code || data.data || data;

      if (response.ok && codeData) {
        setTitle(codeData.title || codeData.titlesubject || "");
        setSlug(codeData.slug || "");
        setContent(codeData.content || "");
        setExistingCoverImage(codeData.cover_image || "");
        setExistingInnerImage(codeData.inner_image || "");
      } else {
        alert("فشل في جلب بيانات الكود");
      }
    } catch (err) {
      console.error("Error loading code:", err);
      alert("حدث خطأ في جلب بيانات الكود");
    } finally {
      setLoading(false);
    }
  }

  async function updateCode(e) {
    e.preventDefault();

    if (saving) return;

    if (!title.trim()) {
      alert("يرجى كتابة عنوان الكود/المعيار");
      return;
    }

    if (!slug.trim()) {
      alert("يرجى كتابة الاسم الإنجليزي (Slug)");
      return;
    }

    if (!content.trim() || content === "<p><br></p>") {
      alert("يرجى كتابة محتوى الكود/المعيار");
      return;
    }

    try {
      setSaving(true);

      await fetch("/sanctum/csrf-cookie", {
        method: "GET",
        credentials: "include",
      });

      const xsrfToken = getXsrfToken();

      if (!xsrfToken) {
        alert("لم يتم الحصول على XSRF-TOKEN");
        return;
      }

      const formData = new FormData();

      formData.append("_method", "PUT");
      formData.append("title", title.trim());
      formData.append("slug", slug.trim());
      formData.append("content", content);

      if (coverImage) {
        formData.append("cover_image", coverImage);
      }

      if (innerImage) {
        formData.append("inner_image", innerImage);
      }

      const response = await fetch(`/api/code-standards/${codeId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": xsrfToken,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "فشل تحديث الكود");
        return;
      }

      alert("تم تحديث الكود بنجاح ✅");
      navigate("/admin");
    } catch (error) {
      console.error("EDIT CODE ERROR:", error);
      alert("حدث خطأ في الاتصال بالسيرفر");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-35 lg:pt-37.5 pb-10 px-4 sm:px-6">
        <div className="max-w-300 mx-auto flex flex-col lg:flex-row gap-7.5 items-start">
          <aside className="hidden lg:block w-62.5 shrink-0 bg-white p-5 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.06)]">
            <h3 className="text-primary text-lg font-bold mb-5">التحكم</h3>
            <ul className="flex flex-col gap-2.5 p-0 m-0 list-none">
              <li>
                <Link
                  to="/admin"
                  className="block px-4 py-3 rounded-[10px] text-[#444] font-bold no-underline transition-colors duration-300 hover:bg-sidebar-bg hover:text-accent"
                >
                  لوحة التحكم
                </Link>
              </li>
            </ul>
          </aside>
          <main className="flex-1 w-full bg-white p-6 sm:p-7.5 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.06)]">
            <p className="text-center py-12.5 text-lg text-primary">جاري تحميل بيانات الكود...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-35 lg:pt-37.5 pb-10 px-4 sm:px-6">
      <div className="max-w-300 mx-auto flex flex-col lg:flex-row gap-7.5 items-start">

        {/* القائمة */}
        <aside className="hidden lg:block w-62.5 shrink-0 bg-white p-5 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.06)]">
          <h3 className="text-primary text-lg font-bold mb-5">
            القائمة
          </h3>

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
                to="/admin/add-code"
                className="block px-4 py-3 rounded-[10px] text-[#444] font-bold no-underline transition-colors duration-300 hover:bg-sidebar-bg hover:text-accent"
              >
                إضافة كود
              </Link>
            </li>
          </ul>
        </aside>

        {/* النموذج */}
        <form
          onSubmit={updateCode}
          className="flex-1 w-full bg-white p-6 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.06)]"
        >
          <h2 className="text-primary text-2xl font-bold mb-6.25">
            تعديل كود / معيار
          </h2>

          {/* العنوان */}
          <div className="mb-5">
            <label className="block mb-2 font-bold text-primary">
              عنوان الكود/المعيار:
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="أدخل عنوان الكود هنا..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-2.5 focus:border-primary focus:outline-none"
            />

            <label className="block mb-2 font-bold text-primary">
              الاسم الإنجليزي (Slug):
            </label>

            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="أدخل الاسم بالانجليزي..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-2.5 focus:border-primary focus:outline-none"
            />
          </div>

          {/* الصور */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block mb-2 font-bold text-primary">
                صورة الواجهة (الغلاف):
              </label>

              {existingCoverImage && (
                <div className="mb-2.5">
                  <img
                    src={existingCoverImage}
                    alt="الغلاف الحالي"
                    className="w-40 h-28 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <p className="text-[12px] text-[#888] mt-1">الصورة الحالية</p>
                </div>
              )}

              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(e) => setCoverImage(e.target.files[0])}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
              <p className="text-[12px] text-[#888] mt-1">اتركه فارغاً للإبقاء على الصورة الحالية</p>
            </div>

            <div>
              <label className="block mb-2 font-bold text-primary">
                الصورة الداخلية:
              </label>

              {existingInnerImage && (
                <div className="mb-2.5">
                  <img
                    src={existingInnerImage}
                    alt="الصورة الداخلية الحالية"
                    className="w-40 h-28 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <p className="text-[12px] text-[#888] mt-1">الصورة الحالية</p>
                </div>
              )}

              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(e) => setInnerImage(e.target.files[0])}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
              <p className="text-[12px] text-[#888] mt-1">اتركه فارغاً للإبقاء على الصورة الحالية</p>
            </div>
          </div>

          {/* المحتوى */}
          <div className="mb-5">
            <label className="block mb-2 font-bold text-primary">
              محتوى الكود/المعيار:
            </label>

            <div
              style={{
                direction: "rtl",
                textAlign: "right",
              }}
            >
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={quillModules}
                formats={quillFormats}
                placeholder="اكتب محتوى الكود هنا..."
                style={{
                  height: "400px",
                  marginBottom: "50px",
                }}
              />
            </div>
          </div>

          {/* الأزرار */}
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <button
              type="submit"
              disabled={saving}
              className="bg-accent text-white border-none py-3 px-7.5 rounded-lg font-bold cursor-pointer text-base transition-colors duration-300 hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
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

export default Edit_code;