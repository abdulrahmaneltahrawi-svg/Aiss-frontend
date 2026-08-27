import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const API_URL = "";

// المسارات المطابقة للخلفية:
//   Route::put('/competitions/{competition}', ...)
//   Route::patch('/competitions/{competition}', ...)
const PUT_URL = `${API_URL}/api/competitions`;

function getXsrfToken() {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="));

  return cookie ? decodeURIComponent(cookie.split("=")[1]) : "";
}

function Edit_Competitions() {
  const navigate = useNavigate();
  const { id } = useParams();
  const competitionId = id ? id.split("-")[0] : null;

  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
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

  const checkAuth = async () => {
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

      if (currentUser.role !== "admin" && currentUser.can_add_article != 1) {
        navigate("/");
        return;
      }
    } catch (error) {
      console.error("Auth error:", error);
      navigate("/");
    }
  };

  const loadCompetitionData = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/competitions/${competitionId}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
        }
      );

      const data = await response.json();

      const competitionData = data.competition || data;

      if (response.ok && competitionData) {
        setTitle(competitionData.title || "");
        setYear(competitionData.year || "");
        setDescription(competitionData.description || "");
        setExistingImage(competitionData.image_url || competitionData.image || "");
      } else {
        alert("فشل في جلب بيانات المسابقة");
      }
    } catch (err) {
      console.error("Error loading competition:", err);
      alert("حدث خطأ في جلب بيانات المسابقة");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!competitionId) {
      alert("معرف المسابقة غير موجود. الرجاء اختيار مسابقة من صفحة المسابقات");
      navigate("/admin");
      return;
    }

    checkAuth();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCompetitionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function saveCompetitionChanges(e) {
    e.preventDefault();

    if (!title.trim()) {
      alert("يرجى كتابة عنوان المسابقة");
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

      // 2. تجهيز FormData (باستخدام _method = PUT ليتوافق مع Route::put)
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("title", title.trim());
      if (year) formData.append("year", year);
      if (description) formData.append("description", description);
      if (image) formData.append("image", image);

      // 3. إرسال إلى Laravel
      const response = await fetch(`${PUT_URL}/${competitionId}`, {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": xsrfToken,
        },
      });

const data = await response.json().catch(() => ({}));

      if (response.ok) {
        alert("تم تحديث المسابقة بنجاح!");
        navigate("/competitions");
      } else {
        alert("خطأ: " + (data.message || "فشل التحديث"));
      }
    } catch (err) {
      console.error("Error updating competition:", err);
      alert("خطأ في الاتصال بالسيرفر");
    } finally {
      setSaving(false);
    }
  }
if (loading) {
    return (
      <div className="min-h-screen pt-35 lg:pt-37.5 pb-10 px-4 sm:px-6">
        <div className="max-w-300 mx-auto text-center font-bold text-primary">
          جاري تحميل بيانات المسابقة...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-35 lg:pt-37.5 pb-10 px-4 sm:px-6">
      <div className="max-w-300 mx-auto flex flex-col lg:flex-row gap-7.5 items-start">
        {/* Sidebar */}
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
                to="/event"
                className="block px-4 py-3 rounded-[10px] font-bold no-underline transition-colors duration-300 bg-sidebar-bg text-accent"
              >
                اختيار مسابقة للتعديل
              </Link>
            </li>
          </ul>
        </aside>

        <div className="flex-1 w-full bg-white p-6 sm:p-7.5 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.06)]">
          <h2 className="text-primary text-2xl font-bold mb-6.25">تعديل المسابقة</h2>

          {existingImage && (
            <div className="mb-5">
              <p className="block mb-2 font-bold text-primary">الصورة الحالية:</p>
              <img
                src={existingImage || "assets/icons/logo.webp"}
                alt="المسابقة"
                className="w-60 h-40 object-cover rounded-lg"
              />
            </div>
          )}

          <form onSubmit={saveCompetitionChanges}>
            <div className="mb-5">
              <label className="block mb-2 font-bold text-primary">
                عنوان المسابقة:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="أدخل عنوان المسابقة هنا..."
                className="w-full p-3 border border-gray-300 rounded-lg mb-2.5 focus:border-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block mb-2 font-bold text-primary">
                  السنة:
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="مثال: 2026"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block mb-2 font-bold text-primary">
                صورة المسابقة (اختياري لفئة نفس الصورة):
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2 font-bold text-primary">
                وصف المسابقة:
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
                  placeholder="اكتب وصف المسابقة هنا..."
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
                className="bg-primary text-white border-none py-3 px-7.5 rounded-lg font-bold cursor-pointer text-base transition-colors duration-300 hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
}

export default Edit_Competitions;