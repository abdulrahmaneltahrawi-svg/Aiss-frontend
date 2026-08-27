import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "";

function getXsrfToken() {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="));

  return cookie ? decodeURIComponent(cookie.split("=")[1]) : "";
}

function Add_actor() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);

  /* ==========================================
     Auth check
     ========================================== */
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

    if (!name.trim()) {
      alert("يرجى كتابة اسم الممثل");
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

      // 2. FormData
      const formData = new FormData();
      formData.append("name", name.trim());
      if (country) formData.append("country", country.trim());
      if (email) formData.append("email", email.trim());
      if (description) formData.append("description", description.trim());
      if (image) formData.append("image", image);

      // 3. إرسال إلى Laravel
      const res = await fetch(`${API_URL}/api/actors`, {
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
        alert(data.message || "فشل إضافة الممثل");
        setSaving(false);
        return;
      }

      alert("تم إضافة الممثل بنجاح");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      setSaving(false);
      alert("حصل خطأ في الاتصال بالخادم");
    }
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
                to="/admin/add-actor"
                className="block px-4 py-3 rounded-[10px] font-bold no-underline transition-colors duration-300 bg-sidebar-bg text-accent"
              >
                إضافة ممثل
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
            إضافة ممثل جديد
          </h2>
<div className="mb-5">
            <label className="block mb-2 font-bold text-primary">
              اسم الممثل:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: د. م سامي عمارنة"
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block mb-2 font-bold text-primary">
                الدولة:
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="مثال: الأردن"
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 font-bold text-primary">
                البريد الإلكتروني (اختياري):
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@aiss.co"
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-bold text-primary">
              صورة الممثل:
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
              الوصف:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="اكتب وصف الممثل هنا..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none resize-y"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <button
              type="submit"
              disabled={saving}
              className="bg-accent text-white border-none py-3 px-7.5 rounded-lg font-bold cursor-pointer text-base transition-colors duration-300 hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "جاري الحفظ..." : "حفظ الممثل"}
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

export default Add_actor;