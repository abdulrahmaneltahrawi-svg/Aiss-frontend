import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Comment() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentsList, setCommentsList] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
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

      setUser(currentUser);

      loadAllComments();
    } catch (error) {
      console.error("Auth error:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  }

  async function loadAllComments() {
    try {
      const response = await fetch("/api/admin/comments", {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        console.error("Failed to load comments:", response.status);
        return;
      }

      const data = await response.json();

      const rawItems = data.data || data.comments || (Array.isArray(data) ? data : []);

      const items = (Array.isArray(rawItems) ? rawItems : rawItems.data || []).map((item) => ({
        ...item,
        text: item.body,
        approved: item.status === "approved",
        articleRef: item.commentable_id,
      }));

      setCommentsList(items);
    } catch (e) {
      console.error("Error loading comments:", e);
      setCommentsList([]);
    }
  }

  async function approveComment(commentId) {
    try {
      const response = await fetch(`/api/admin/comments/${commentId}/approve`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": getXsrfToken(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "فشل قبول التعليق");
        return;
      }

      alert("تم قبول التعليق ✅");
      loadAllComments();
    } catch (e) {
      console.error("Error approving comment:", e);
      alert("حدث خطأ في قبول التعليق");
    }
  }

  async function rejectComment(commentId) {
    try {
      const response = await fetch(`/api/admin/comments/${commentId}/reject`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": getXsrfToken(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message?.message || "فشل رفض التعليق");
        return;
      }

      alert("تم رفض التعليق ❌");
      loadAllComments();
    } catch (e) {
      console.error("Error rejecting comment:", e);
      alert("حدث خطأ في رفض التعليق");
    }
  }

  function getXsrfToken() {
    const xsrfCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="));

    if (!xsrfCookie) return "";

    return decodeURIComponent(xsrfCookie.split("=")[1]);
  }

  const totalCount = commentsList.length;
  const approvedCount = commentsList.filter((c) => c.approved).length;
  const pendingCount = commentsList.filter((c) => !c.approved).length;

  const filteredComments = commentsList.filter((c) => {
    if (filter === "approved" && !c.approved) return false;
    if (filter === "pending" && c.approved) return false;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const nameMatch = (c.name || "").toLowerCase().includes(q);
      const textMatch = (c.text || "").toLowerCase().includes(q);
      if (!nameMatch && !textMatch) return false;
    }

    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8]">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="font-bold text-primary">جاري التحقق...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-35 lg:pt-37.5 pb-10 px-4 sm:px-6">
      <div className="max-w-300 mx-auto flex flex-col lg:flex-row gap-7.5 items-start">

        {/* القائمة الجانبية */}
        <aside className="hidden lg:block w-62.5 shrink-0 bg-white p-5 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.06)] mt-15">
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
          </ul>
        </aside>

        {/* المحتوى */}
        <main className="flex-1 w-full">

        {/* العنوان */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-primary text-2xl font-bold">💬 إدارة التعليقات</h2>
            <p className="text-[#888] text-sm">راجع وقبل أو ارفض تعليقات الزوار</p>
          </div>
        </div>


        {/* جدول التعليقات */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-accent mb-4">التعليقات</h3>

          {filteredComments.length === 0 ? (
            <div className="text-center py-8 text-[#999]">
              لا توجد تعليقات حالياً
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-3 text-right bg-[#f9f9f9] text-primary border-b border-gray-200">الاسم</th>
                    <th className="p-3 text-right bg-[#f9f9f9] text-primary border-b border-gray-200">التعليق</th>
                    <th className="p-3 text-right bg-[#f9f9f9] text-primary border-b border-gray-200">المقال</th>
                    <th className="p-3 text-right bg-[#f9f9f9] text-primary border-b border-gray-200">التاريخ</th>
                    <th className="p-3 text-right bg-[#f9f9f9] text-primary border-b border-gray-200">الحالة</th>
                    <th className="p-3 text-right bg-[#f9f9f9] text-primary border-b border-gray-200">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComments.map((c) => (
                    <tr key={c.id}>
                      <td className="p-3 border-b border-gray-100 font-bold text-[#333]">
                        {c.name}
                      </td>

                      <td className="p-3 border-b border-gray-100 text-[#555] max-w-70">
                        {c.text}
                      </td>

                      <td className="p-3 border-b border-gray-100 text-[12px] text-primary">
                        #{c.articleRef}
                      </td>

                      <td className="p-3 border-b border-gray-100 text-[12px] text-[#888]" dir="ltr">
                        {c.created_at}
                      </td>

                      <td className="p-3 border-b border-gray-100 text-center">
                        {c.approved ? (
                          <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-[12px] font-bold">
                            ✓ مقبول
                          </span>
                        ) : (
                          <span className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full text-[12px] font-bold">
                            ⏳ بانتظار
                          </span>
                        )}
                      </td>

                      <td className="p-3 border-b border-gray-100">
                        <div className="flex gap-2">
                          {!c.approved && (
                            <button
                              type="button"
                              className="bg-green-500 text-white py-1.5 px-3 rounded-lg text-[12px] font-bold cursor-pointer hover:bg-green-600 transition-colors"
                              onClick={() => approveComment(c.id)}
                            >
                              قبول
                            </button>
                          )}

                          <button
                            type="button"
                            className="bg-accent text-white py-1.5 px-3 rounded-lg text-[12px] font-bold cursor-pointer hover:bg-accent-dark transition-colors"
                            onClick={() => rejectComment(c.id)}
                          >
                            رفض
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* الرجوع للموقع */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-block py-2.5 px-5 bg-primary text-white no-underline rounded-lg font-bold text-sm hover:bg-primary-dark transition-colors"
          >
             الرجوع للموقع
          </Link>
        </div>

        </main>
      </div>
    </div>
  );
}

export default Comment;