import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/me", {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          setUser(null);
          navigate("/");
          return;
        }

        const data = await response.json();

        const currentUser = data.user || data;

        // التأكد أن المستخدم لديه صلاحية لوحة التحكم
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

  // أثناء التحقق
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-bold text-primary">
          جاري التحقق من تسجيل الدخول...
        </p>
      </div>
    );
  }

  // إذا لم يكن المستخدم مسجل دخول
  if (!user) {
    return null;
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
                to="/admin/comments"
                className="block px-4 py-3 rounded-[10px] text-[#444] font-bold no-underline transition-colors duration-300 hover:bg-sidebar-bg hover:text-accent"
              >
                إدارة التعليقات
              </Link>
            </li>

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
                to="/admin/manage-actors"
                className="block px-4 py-3 rounded-[10px] text-[#444] font-bold no-underline transition-colors duration-300 hover:bg-sidebar-bg hover:text-accent"
              >
                إدارة الممثلين
              </Link>
            </li>

            <li>
              <Link
                to="/admin/add-article"
                className="block px-4 py-3 rounded-[10px] text-[#444] font-bold no-underline transition-colors duration-300 hover:bg-sidebar-bg hover:text-accent"
              >
                إضافة مقال
              </Link>
            </li>

            <li>
              <Link
                to="/admin/add-magazine"
                className="block px-4 py-3 rounded-[10px] text-[#444] font-bold no-underline transition-colors duration-300 hover:bg-sidebar-bg hover:text-accent"
              >
                إضافة مجلة
              </Link>
            </li>

            <li>
              <Link
                to="/admin/add-book"
                className="block px-4 py-3 rounded-[10px] text-[#444] font-bold no-underline transition-colors duration-300 hover:bg-sidebar-bg hover:text-accent"
              >
                إضافة كتيب
              </Link>
            </li>

            <li>
              <Link
                to="/admin/add-tag"
                className="block px-4 py-3 rounded-[10px] text-[#444] font-bold no-underline transition-colors duration-300 hover:bg-sidebar-bg hover:text-accent"
              >
                إضافة الوسوم
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

            <li>
              <Link
                to="/admin/add-conferences"
                className="block px-4 py-3 rounded-[10px] text-[#444] font-bold no-underline transition-colors duration-300 hover:bg-sidebar-bg hover:text-accent"
              >
                إضافة مؤتمر
              </Link>
            </li>

            <li>
              <Link
                to="/admin/add-competitions"
                className="block px-4 py-3 rounded-[10px] text-[#444] font-bold no-underline transition-colors duration-300 hover:bg-sidebar-bg hover:text-accent"
              >
                إضافة مسابقة
              </Link>
            </li>




            <li>
              <Link
                to="/admin/add-certificates"
                className="block px-4 py-3 rounded-[10px] text-[#444] font-bold no-underline transition-colors duration-300 hover:bg-sidebar-bg hover:text-accent"
              >
                إضافة شهادات
              </Link>
            </li>

                        <li>
              <Link
                to="/admin/add-accred"
                className="block px-4 py-3 rounded-[10px] text-[#444] font-bold no-underline transition-colors duration-300 hover:bg-sidebar-bg hover:text-accent"
              >
                الإعتمادات
              </Link>
            </li>

          </ul>
        </aside>

        {/* المحتوى */}
        <main className="flex-1 w-full">

          {/* الترحيب */}
          <div className="flex justify-center mb-7.5">

            <div className="bg-white p-6.25 rounded-[15px] text-center shadow-[0_4px_15px_rgba(0,0,0,0.05)] border-t-4 border-primary w-full max-w-[2000px]">

              <h4 className="text-[#888] text-sm mb-2.5">
                مرحباً بك
              </h4>

              <div className="text-[28px] font-extrabold text-primary">
                {user.name}
              </div>

            </div>
          </div>

          {/* آخر النشاطات */}
          <div className="bg-white p-6.25 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.05)]">

            <h3 className="text-accent mb-4">
              آخر النشاطات
            </h3>

            <div className="overflow-x-auto">

              <table className="w-full border-collapse mt-4">

                <thead>
                  <tr>

                    <th className="p-4 text-right bg-[#f9f9f9] text-primary border-b border-gray-200">
                      التاريخ
                    </th>

                    <th className="p-4 text-right bg-[#f9f9f9] text-primary border-b border-gray-200">
                      النشاط
                    </th>

                    <th className="p-4 text-right bg-[#f9f9f9] text-primary border-b border-gray-200">
                      الحالة
                    </th>

                  </tr>
                </thead>

                <tbody>

                  <tr>

                    <td className="p-4 border-b border-gray-100">
                      2026
                    </td>

                    <td className="p-4 border-b border-gray-100">
                      تسجيل دخول للنظام
                    </td>

                    <td className="p-4 border-b border-gray-100 text-green-600 font-bold">
                      ناجح
                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          </div>

          {/* الرجوع للموقع */}
          <Link
            to="/"
            className="inline-block mt-6 py-2.5 px-5 bg-primary text-white no-underline rounded-lg font-bold text-center transition-colors duration-300 hover:bg-primary-dark hover:text-white"
          >
            الرجوع للموقع
          </Link>

        </main>

      </div>
    </div>
  );
}

export default Dashboard;