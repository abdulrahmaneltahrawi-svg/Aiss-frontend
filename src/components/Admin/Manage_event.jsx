import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "";

function getXsrfToken() {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="));

  return cookie ? decodeURIComponent(cookie.split("=")[1]) : "";
}

function formatEventDate(dateStr) {
  if (!dateStr) return "";
  const months = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
  ];
  const parts = dateStr.split("-");
  if (parts.length < 2) return dateStr;
  const year = parts[0];
  const month = parseInt(parts[1], 10);
  const monthName = months[month - 1] || parts[1];
  return `${monthName} ${year}`;
}

function Manage_event() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  /* ==========================================
     Auth + load events
     ========================================== */
  async function checkAuthAndLoad() {
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

      loadEvents();
    } catch (error) {
      console.error("Auth error:", error);
      navigate("/");
    }
  }

  async function loadEvents() {
    try {
      const response = await fetch(`${API_URL}/api/events`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("فشل جلب الفعاليات");
      }

      const data = await response.json();
      const items = Array.isArray(data) ? data : data.events || data.data || [];
      setEvents(items);
    } catch (err) {
      console.error(err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkAuthAndLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ==========================================
     Delete
     ========================================== */
  async function handleDelete(event) {
    if (!window.confirm(`هل أنت متأكد من حذف الفعالية "${event.title}"؟`)) {
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

      // 2. حذف
      const res = await fetch(`${API_URL}/api/events/${event.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": xsrfToken,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "فشل حذف الفعالية");
        return;
      }

      alert("تم حذف الفعالية بنجاح");
      loadEvents();
    } catch (err) {
      console.error(err);
      alert("حصل خطأ في الاتصال بالخادم");
    }
  }

  const filteredEvents = events.filter((event) =>
    search.trim()
      ? (event.title || "").includes(search.trim()) ||
        (event.event_date || "").includes(search.trim())
      : true
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-bold text-primary">جاري تحميل الفعاليات...</p>
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
                className="block px-4 py-3 rounded-[10px] font-bold no-underline transition-colors duration-300 bg-sidebar-bg text-accent"
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
{/* Main */}
        <main className="flex-1 w-full bg-white p-6 sm:p-7.5 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.06)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6.25">
            <h2 className="text-primary text-2xl font-bold">إدارة الفعاليات</h2>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث بالعنوان أو التاريخ..."
              className="w-full sm:w-72 p-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            />
          </div>

          {filteredEvents.length === 0 ? (
            <p className="text-center text-[#888] py-10">
              لا توجد فعاليات. أضف فعالية جديدة.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="border border-[#e0e0e0] rounded-xl overflow-hidden flex flex-col"
                >
                  <div className="h-48 bg-white flex items-center justify-center p-3 border-b border-[#eee]">
                    {event.image_url || event.image ? (
                      <img
                        src={event.image_url || event.image}
                        alt={event.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.textContent = "لا توجد صورة";
                        }}
                      />
                    ) : (
                      <span className="text-[#aaa] text-sm">لا توجد صورة</span>
                    )}
                  </div>

                  <div className="p-4 grow flex flex-col">
                    {event.event_date && (
                      <span className="bg-[#fde8e8] text-[#e63946] px-2.5 py-1 rounded-[20px] text-[12px] font-bold inline-block w-fit mb-2">
                        {formatEventDate(event.event_date)}
                      </span>
                    )}
                    <h3 className="text-[17px] font-bold text-[#2c3e50] leading-snug mb-2">
                      {event.title}
                    </h3>
                    {event.description && (
                      <div
                        className="text-[13px] leading-relaxed text-[#666] line-clamp-2 grow"
                        dangerouslySetInnerHTML={{
                          __html: event.description.replace(/<[^>]*>/g, " "),
                        }}
                      />
                    )}
                  </div>

                  <div className="p-4 border-t border-[#eee] flex gap-2">
                    <Link
                      to={`/admin/edit-event/${event.id}`}
                      className="flex-1 py-2 bg-primary text-white rounded-lg text-center font-bold text-[13px] no-underline transition-colors hover:bg-primary-dark"
                    >
                      تعديل
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(event)}
                      className="flex-1 py-2 bg-red-500 text-white rounded-lg font-bold text-[13px] cursor-pointer border-none transition-colors hover:bg-red-600"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Manage_event;