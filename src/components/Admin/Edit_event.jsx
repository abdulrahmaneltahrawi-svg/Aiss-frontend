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

function Edit_event() {
  const navigate = useNavigate();
  const { id } = useParams();
  const eventId = id ? id.split("-")[0] : null;

  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [description, setDescription] = useState("");
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

  /* ==========================================
     Auth
     ========================================== */
  async function checkAuth() {
    try {
      const response = await fetch(`${API_URL}/api/me`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      const data = await response.json();
      const user = data.user || data;

      if (!response.ok || !user || (user.role !== "admin" && user.can_add_article != 1)) {
        navigate("/");
        return;
      }
    } catch (error) {
      console.error("Auth error:", error);
      navigate("/");
    }
  }

  async function loadEventData() {
    try {
      const response = await fetch(`${API_URL}/api/events/${eventId}`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      const data = await response.json();

      if (response.ok && data) {
        setTitle(data.title || "");
        setEventDate(data.event_date || "");
        setDescription(data.description || "");
        setExistingImage(data.image_url || data.image || "");
      } else {
        alert(data.message || "فشل في جلب بيانات الفعالية");
        navigate("/admin/manage-events");
      }
    } catch (err) {
      console.error("Error loading event:", err);
      alert("حدث خطأ في جلب بيانات الفعالية");
      navigate("/admin/manage-events");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function init() {
      if (!eventId) {
        alert("معرف الفعالية غير موجود");
        navigate("/admin/manage-events");
        return;
      }

      await checkAuth();
      await loadEventData();
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
/* ==========================================
     Save (update)
     ========================================== */
  async function handleSave(e) {
    e.preventDefault();

    if (!title.trim()) {
      alert("يرجى كتابة عنوان الفعالية");
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

      // 2. FormData - Laravel يتطلب _method=PUT مع FormData
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("title", title.trim());
      if (eventDate) formData.append("event_date", eventDate);
      if (description) formData.append("description", description);
      if (image) formData.append("image", image);

      // 3. إرسال إلى Laravel
      const res = await fetch(`${API_URL}/api/events/${eventId}`, {
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
        alert(data.message || "فشل تحديث الفعالية");
        setSaving(false);
        return;
      }

      alert("تم تحديث الفعالية بنجاح");
      navigate("/admin/manage-events");
    } catch (err) {
      console.error(err);
      setSaving(false);
      alert("حصل خطأ في الاتصال بالخادم");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-bold text-primary">جاري تحميل بيانات الفعالية...</p>
      </div>
    );
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
                to="/admin/manage-events"
                className="block px-4 py-3 rounded-[10px] text-[#444] font-bold no-underline transition-colors duration-300 hover:bg-sidebar-bg hover:text-accent"
              >
                إدارة الفعاليات
              </Link>
            </li>
            <li>
              <Link
                to="/admin/add-event"
                className="block px-4 py-3 rounded-[10px] text-[#444] font-bold no-underline transition-colors duration-300 hover:bg-sidebar-bg hover:text-accent"
              >
                إضافة فعالية
              </Link>
            </li>
          </ul>
        </aside>

        {/* Main Form */}
        <form
          onSubmit={handleSave}
          className="flex-1 w-full bg-white p-6 sm:p-7.5 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.06)]"
        >
          <h2 className="text-primary text-2xl font-bold mb-6.25">
            تعديل الفعالية
          </h2>
<div className="mb-5">
            <label className="block mb-2 font-bold text-primary">
              عنوان الفعالية:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: المؤتمر العربي للسلامة - الدورة الخامسة"
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block mb-2 font-bold text-primary">
                تاريخ الفعالية:
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-bold text-primary">
              صورة الفعالية:
            </label>

            {existingImage && (
              <div className="mb-2.5">
                <img
                  src={existingImage}
                  alt="الصورة الحالية"
                  className="w-40 h-40 object-cover rounded-lg"
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
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            />
            <p className="text-[12px] text-[#888] mt-1">
              اتركه فارغاً للإبقاء على الصورة الحالية
            </p>
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-bold text-primary">
              وصف الفعالية:
            </label>

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
                placeholder="اكتب وصف الفعالية هنا..."
                style={{
                  height: "300px",
                  marginBottom: "50px",
                }}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <button
              type="submit"
              disabled={saving}
              className="bg-accent text-white border-none py-3 px-7.5 rounded-lg font-bold cursor-pointer text-base transition-colors duration-300 hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
            </button>

            <Link
              to="/admin/manage-events"
              className="inline-block py-2.5 px-5 bg-primary text-white no-underline rounded-lg font-bold text-center transition-colors duration-300 hover:bg-[#1a3d63] hover:text-white"
            >
              إلغاء
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Edit_event;