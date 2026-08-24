import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const API_URL = "";

function getXsrfToken() {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="));

  return cookie ? decodeURIComponent(cookie.split("=")[1]) : "";
}

function Edit_conferences() {
  const navigate = useNavigate();
  const { id } = useParams();
  const conferenceId = id ? id.split("-")[0] : null;

  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ==========================================
     Quill
     ========================================== */

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
    if (!conferenceId) {
      alert("معرف المؤتمر غير موجود. الرجاء اختيار مؤتمر من صفحة المؤتمرات");
      navigate("/admin");
      return;
    }

    checkAuth();
    loadConferenceData();
  }, []);

  async function checkAuth() {
    try {
      const response = await fetch(`${API_URL}/api/me`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
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

  async function loadConferenceData() {
    try {
      const response = await fetch(`${API_URL}/api/conferences/${conferenceId}`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      const data = await response.json();

      const conferenceData = data.conference || data;

      if (response.ok && conferenceData) {
        setTitle(conferenceData.title || "");
        setYear(conferenceData.year || "");
        setDescription(conferenceData.description || "");
        setVideoUrl(conferenceData.video_url || "");
        setExistingImage(conferenceData.image_url || conferenceData.image || "");
      } else {
        alert("فشل في جلب بيانات المؤتمر");
      }
    } catch (err) {
      console.error("Error loading conference:", err);
      alert("حدث خطأ في جلب بيانات المؤتمر");
    } finally {
      setLoading(false);
    }
  }

  async function saveConferenceChanges(e) {
    e.preventDefault();

    if (!title.trim()) {
      alert("يرجى كتابة عنوان المؤتمر");
      return;
    }

    try {
      setSaving(true);

      // 1. CSRF Cookie
      await fetch(`${API_URL}/sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
      });

      const xsrfToken = getXsrfToken();

      if (!xsrfToken) {
        alert("لم يتم الحصول على CSRF Token");
        setSaving(false);
        return;
      }

      // 2. تجهيز FormData
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("title", title.trim());
      if (year) formData.append("year", year);
      if (description) formData.append("description", description);
      if (videoUrl) formData.append("video_url", videoUrl.trim());
      if (image) formData.append("image", image);

      // 3. إرسال إلى Laravel
      const response = await fetch(`${API_URL}/api/conferences/${conferenceId}`, {
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
        alert("تم تحديث المؤتمر بنجاح!");
        navigate("/admin");
      } else {
        alert("خطأ: " + (data.message || "فشل التحديث"));
      }
    } catch (err) {
      console.error("Error updating conference:", err);
      alert("خطأ في الاتصال بالسيرفر");
    } finally {
      setSaving(false);
    }
  }
return (
    <div className="min-h-screen pt-35 lg:pt-37.5 pb-10 px-4 sm:px-6">
      <div className="max-w-300 mx-auto flex flex-col lg:flex-row gap-7.5 items-start">
        {/* Sidebar */}
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
                to="/conferences"
                className="block px-4 py-3 rounded-[10px] font-bold no-underline transition-colors duration-300 bg-sidebar-bg text-accent"
              >
                اختيار مؤتمر للتعديل
              </Link>
            </li>
          </ul>
        </aside>

        <form className="flex-1 w-full bg-white p-6 sm:p-7.5 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.06)]">
          <h2 className="text-primary text-2xl font-bold mb-6.25">تعديل المؤتمر</h2>

          <div className="mb-5">
            <label className="block mb-2 font-bold text-primary">عنوان المؤتمر:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="أدخل عنوان المؤتمر هنا..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-2.5 focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block mb-2 font-bold text-primary">سنة المؤتمر:</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="مثال: 2025"
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 font-bold text-primary">رابط الفيديو (اختياري):</label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-bold text-primary">صورة المؤتمر:</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-bold text-primary">وصف المؤتمر:</label>

            <div
              style={{
                direction: "rtl",
                textAlign: "right",
              }}
            >
              <ReactQuill
                value={description}
                onChange={setDescription}
                modules={quillModules}
                formats={quillFormats}
                placeholder="اكتب وصف المؤتمر هنا..."
                style={{
                  height: "300px",
                  marginBottom: "50px",
                }}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <button
              type="button"
              onClick={saveConferenceChanges}
              className="bg-primary text-white border-none py-3 px-7.5 rounded-lg font-bold cursor-pointer text-base transition-colors duration-300 hover:bg-primary-dark"
            >
              حفظ التعديلات
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

export default Edit_conferences;