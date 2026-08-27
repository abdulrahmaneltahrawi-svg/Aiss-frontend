import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

/* قائمة التنقل الجانبية في لوحة التحكم */
const MENU_GROUPS = [
  {
    label: "الإدارة",
    items: [
      { to: "/admin/comments", label: "إدارة التعليقات" },
      { to: "/admin/manage-events", label: "إدارة الفعاليات" },
      { to: "/admin/manage-actors", label: "إدارة الممثلين" },
    ],
  },
  {
    label: "إضافة محتوى",
    items: [
      { to: "/admin/add-article", label: "إضافة مقال" },
      { to: "/admin/add-magazine", label: "إضافة مجلة" },
      { to: "/admin/add-book", label: "إضافة كتيب" },
      { to: "/admin/add-tag", label: "إضافة الوسوم" },
      { to: "/admin/add-code", label: "إضافة كود" },
    ],
  },
  {
    label: "الفعاليات",
    items: [
      { to: "/admin/add-conferences", label: "إضافة مؤتمر" },
      { to: "/admin/add-competitions", label: "إضافة مسابقة" },
    ],
  },
  {
    label: "الشهادات",
    items: [
      { to: "/admin/add-certificates", label: "إضافة شهادات" },
      { to: "/admin/add-accred", label: "الإعتمادات" },
    ],
  },
];

/* إعداد بطاقات الإحصائيات */
const STAT_CARDS = [
  { key: "articles", endpoint: "/api/articles", label: "المقالات", color: "from-[#235287] to-[#1a3c63]" },
  { key: "magazines", endpoint: "/api/magazines", label: "المجلات", color: "from-[#e4293a] to-[#b71c1c]" },
  { key: "booklets", endpoint: "/api/booklets", label: "الكتيبات", color: "from-[#0f766e] to-[#115e59]" },
  { key: "codes", endpoint: "/api/code-standards", label: "الأكواد", color: "from-[#7c3aed] to-[#6d28d9]" },
];

/* أزرار الوصول السريع */
const QUICK_ACTIONS = [
  { to: "/admin/add-article", label: "مقال جديد", sub: "إضافة مقال" },
  { to: "/admin/add-magazine", label: "مجلة جديدة", sub: "إضافة مجلة" },
  { to: "/admin/add-book", label: "كتيب جديد", sub: "إضافة كتيب" },
  { to: "/admin/manage-events", label: "الفعاليات", sub: "إدارة الفعاليات" },
  { to: "/admin/comments", label: "التعليقات", sub: "إدارة التعليقات" },
  { to: "/admin/manage-actors", label: "الممثلون", sub: "إدارة الممثلين" },
];

/* يستخرج عدد العناصر من استجابات الواجهة الخلفية المتنوعة */
function getListLength(data) {
  if (Array.isArray(data)) return data.length;
  if (!data || typeof data !== "object") return 0;
  if (Array.isArray(data.data)) return data.data.length;
  for (const key of ["articles", "magazines", "booklets", "code_standards"]) {
    if (Array.isArray(data[key])) return data[key].length;
  }
  return 0;
}

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ articles: null, magazines: null, booklets: null, codes: null });

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/me", {
          method: "GET",
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          setUser(null);
          navigate("/");
          return;
        }

        const data = await response.json();
        const currentUser = data.user || data;

        if (currentUser.can_add_article != 1) {
          setUser(null);
          navigate("/");
          return;
        }

        setUser(currentUser);
      } catch (error) {
        console.error("Auth error:", error);
        setUser(null);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  /* تحميل العدادات الإحصائية */
  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      const results = {};
      for (const card of STAT_CARDS) {
        try {
          const res = await fetch(card.endpoint, {
            credentials: "include",
            headers: { Accept: "application/json" },
          });
          if (!res.ok) continue;
          const data = await res.json();
          results[card.key] = getListLength(data);
        } catch (error) {
          console.error(`فشل جلب إحصائيات ${card.key}:`, error);
        }
      }
      if (!cancelled) setStats(results);
    }

    loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-bold text-primary">جاري التحقق من تسجيل الدخول...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const firstLetter = (user.name || "أ").trim().charAt(0);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-[10px] font-bold no-underline transition-all duration-300 text-right w-full ${
      isActive
        ? "bg-sidebar-bg text-accent border-r-4 border-accent"
        : "text-[#444] hover:bg-sidebar-bg hover:text-accent"
    }`;


  return (
    <div className="min-h-screen pt-35 lg:pt-37.5 pb-10 px-4 sm:px-6 bg-[#f6f8fb]">
      <div className="max-w-300 mx-auto flex flex-col lg:flex-row gap-7.5 items-start">

        {/* القائمة الجانبية */}
        <aside className="block w-full lg:w-62.5 lg:shrink-0 bg-white p-5 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.06)] lg:sticky lg:top-37.5">
          <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-[#f1f5f9]">
      
            <div className="min-w-0">
              <h3 className="text-primary font-extrabold leading-tight truncate">لوحة التحكم</h3>
              <p className="text-[12px] text-[#94a3b8] font-medium">الإدارة العامة للموقع</p>
            </div>
          </div>

          <nav className="flex flex-col gap-4 p-0 m-0">
            {MENU_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="px-2 mb-1.5 text-[11px] font-extrabold text-[#94a3b8] uppercase tracking-wide">
                  {group.label}
                </p>
                <ul className="flex flex-col gap-1 p-0 m-0 list-none">
                  {group.items.map((item) => (
                    <li key={item.to}>
                      <NavLink to={item.to} className={navLinkClass}>
                        <span className="truncate">{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 mt-6 py-3 px-5 bg-primary text-white no-underline rounded-[12px] font-bold text-center transition-all duration-300 hover:bg-primary-dark hover:scale-[1.02]"
          >
            الرجوع للموقع
          </Link>
        </aside>

        {/* المحتوى */}
        <main className="flex-1 w-full flex flex-col gap-7.5">

          {/* بطاقة الترحيب */}
          <div className="rounded-[20px] overflow-hidden bg-gradient-to-l from-primary to-primary-dark text-white shadow-[0_10px_30px_rgba(35,82,135,0.25)] relative">
            <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-white/10" />
            <div className="absolute -bottom-16 -right-6 w-56 h-56 rounded-full bg-white/10" />
            <div className="relative p-7.5 flex flex-col sm:flex-row sm:items-center gap-5">
              <span className="w-16 h-16 shrink-0 flex items-center justify-center rounded-[16px] bg-white/15 text-3xl font-extrabold ring-2 ring-white/40">
                {firstLetter}
              </span>
              <div className="flex-1">
                <p className="text-white/70 text-sm font-medium mb-1">مرحباً بعودتك </p>
                <h2 className="text-[26px] font-extrabold leading-tight mb-1">{user.name}</h2>
                <p className="text-white/80 text-sm">
                  أهلاً بك في لوحة تحكم موقع السلامة العربية. يمكنك إدارة محتوى الموقع من هنا.
                </p>
              </div>
   
            </div>
          </div>

          {/* بطاقات الإحصائيات */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
            {STAT_CARDS.map((card) => (
              <div
                key={card.key}
                className="bg-white rounded-[16px] shadow-[0_4px_15px_rgba(0,0,0,0.05)] p-5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.10)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-4"
              >
   
                <div className="min-w-0">
                  <p className="text-[13px] text-[#94a3b8] font-bold mb-0.5">{card.label}</p>
                  <p className="text-[26px] font-extrabold text-primary leading-none">
                    {stats[card.key] === null || stats[card.key] === undefined ? (
                      <span className="text-[18px] text-[#cbd5e1]">...</span>
                    ) : (
                      stats[card.key]
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>


          {/* الوصول السريع */}
          <div className="bg-white p-6.25 rounded-[16px] shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-primary text-lg font-extrabold"> وصول سريع</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.to}
                  to={action.to}
                  className="group flex items-center gap-3 p-4 rounded-[14px] bg-[#f6f8fb] no-underline transition-all duration-300 hover:bg-sidebar-bg hover:shadow-md border border-transparent hover:border-accent/20"
                >
  
                  <div className="min-w-0">
                    <p className="text-primary font-bold text-[14px] truncate">{action.label}</p>
                    <p className="text-[12px] text-[#94a3b8] font-medium truncate">{action.sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* آخر النشاطات */}
          <div className="bg-white p-6.25 rounded-[16px] shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
            <h3 className="text-primary text-lg font-extrabold mb-5"> آخر النشاطات</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#f6f8fb]">
                    <th className="p-4 text-right text-primary font-extrabold rounded-r-[10px]">التاريخ</th>
                    <th className="p-4 text-right text-primary font-extrabold">النشاط</th>
                    <th className="p-4 text-right text-primary font-extrabold rounded-l-[10px]">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#f1f5f9] hover:bg-[#fafbfd] transition-colors duration-200">
                    <td className="p-4 font-medium text-[#444]">2026</td>
                    <td className="p-4 font-medium text-[#444]">تسجيل دخول للنظام</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-[13px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        ناجح
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </main>

      </div>
    </div>
  );
}

export default Dashboard;

