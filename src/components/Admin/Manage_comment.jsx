import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Comment() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentsList, setCommentsList] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedComment, setSelectedComment] = useState(null); // التعليق المعروض في نافذة التفاصيل
  const [copiedId, setCopiedId] = useState(null); // معرف التعليق الذي تم نسخ نصه

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
        commentableType: item.commentable_type,
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

  function viewContent(comment) {
    const id = comment.commentable_id;
    const type = (comment.commentable_type || "").toLowerCase();

    console.log("View content - id:", id, "type:", type);

    if (!id) {
      alert("لا يوجد معرف للمحتوى المرتبط بهذا التعليق");
      return;
    }

    if (type.includes("article")) {
      navigate(`/views?id=${id}`);
    } else if (type.includes("conference")) {
      // تعليق على مؤتمر -> صفحة تفاصيل المؤتمر (المعرف في المسار)
      navigate(`/conferences/${id}`);
    } else if (
      type.includes("magazine") ||
      type.includes("booklet") ||
      type.includes("brochure")
    ) {
      navigate(`/flipbook?id=${id}`);
    } else if (type.includes("code") || type.includes("standard")) {
      // تعليق على كود/معيار -> نفتح صفحة تفاصيل هذا الكود (المصدر: codes)
      navigate(`/views?id=${id}&source=codes`);
    } else {
      // افتراضياً نعرض المقال
      navigate(`/views?id=${id}`);
    }
  }

  function getXsrfToken() {
    const xsrfCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="));

    if (!xsrfCookie) return "";

    return decodeURIComponent(xsrfCookie.split("=")[1]);
  }

  // فتح نافذة تفاصيل التعليق الكامل
  function openCommentDetails(comment) {
    setSelectedComment(comment);
  }

  // نسخ نص التعليق إلى الحافظة
  async function copyComment(comment) {
    const text = comment.text !== undefined ? comment.text : comment.body;
    try {
      await navigator.clipboard.writeText(text || "");
      setCopiedId(comment.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (e) {
      console.error("Copy error:", e);
      alert("تعذر نسخ النص");
    }
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
      <div className="min-h-screen flex items-center justify-center ">
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
                        <div className="line-clamp-3 leading-relaxed text-[#555]">
                          {c.text}
                        </div>

                        <button
                          type="button"
                          className="text-primary text-[12px] font-bold cursor-pointer hover:underline transition-colors mt-2"
                          onClick={() => openCommentDetails(c)}
                        >
                          👁️ التفاصيل (عرض كامل)
                        </button>
                      </td>

                      <td className="p-3 border-b border-gray-100 text-[12px] text-primary">
                        #{c.articleRef}
                        <button
                          type="button"
                          className="block mt-1 bg-primary text-white py-1 px-2.5 rounded-lg text-[11px] font-bold cursor-pointer hover:bg-primary-dark transition-colors"
                          onClick={() => viewContent(c)}
                        >
                          عرض المحتوى
                        </button>
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
                             بانتظار
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

        {/* نافذة تفاصيل التعليق (عرض كامل) */}
        {selectedComment && (
          <div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-down"
            onClick={(e) => e.target === e.currentTarget && setSelectedComment(null)}
          >
            <div className="bg-white rounded-[18px] shadow-[0_20px_60px_rgba(0,0,0,0.25)] w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden">
              {/* رأس النافذة */}
              <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200 bg-[#f9f9f9]">
                <h3 className="text-lg font-bold text-primary">💬 تفاصيل التعليق</h3>
                <button
                  type="button"
                  onClick={() => setSelectedComment(null)}
                  className="w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-900 text-lg font-bold"
                  aria-label="إغلاق"
                >
                  ✕
                </button>
              </div>

              {/* محتوى النافذة */}
              <div className="px-5 py-4 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-400 block text-xs mb-1">الاسم</span>
                    <span className="font-bold text-[#333]">{selectedComment.name || "-"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-xs mb-1">البريد الإلكتروني</span>
                    <span className="font-bold text-[#333] break-all" dir="ltr">
                      {selectedComment.email || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-xs mb-1">التاريخ</span>
                    <span className="font-bold text-[#333]" dir="ltr">
                      {selectedComment.created_at || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-xs mb-1">الحالة</span>
                    {selectedComment.approved ? (
                      <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-[12px] font-bold">
                        ✓ مقبول
                      </span>
                    ) : (
                      <span className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full text-[12px] font-bold">
                        ⏳ بانتظار
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-2">
                  <span className="text-gray-400 block text-xs mb-1">التعليق الكامل</span>
                  <div className="bg-[#fafafa] border border-gray-200 rounded-lg p-4 max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed text-[#333] text-[15px]">
                    {selectedComment.text}
                  </div>
                </div>
              </div>

              {/* أزرار النافذة */}
              <div className="px-5 py-3 border-t border-gray-200 bg-[#f9f9f9] flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => copyComment(selectedComment)}
                  className="bg-gray-100 text-[#444] py-1.5 px-3 rounded-lg text-[12px] font-bold cursor-pointer hover:bg-gray-300 transition-colors"
                >
                  {copiedId === selectedComment.id ? "✓ تم النسخ" : "📋 نسخ النص"}
                </button>

                <button
                  type="button"
                  onClick={() => viewContent(selectedComment)}
                  className="bg-primary text-white py-1.5 px-3 rounded-lg text-[12px] font-bold cursor-pointer hover:bg-primary-dark transition-colors"
                >
                  📄 عرض المحتوى
                </button>

                {!selectedComment.approved && (
                  <button
                    type="button"
                    onClick={() => { approveComment(selectedComment.id); setSelectedComment(null); }}
                    className="bg-green-500 text-white py-1.5 px-3 rounded-lg text-[12px] font-bold cursor-pointer hover:bg-green-600 transition-colors"
                  >
                    ✓ قبول
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => { rejectComment(selectedComment.id); setSelectedComment(null); }}
                  className="bg-accent text-white py-1.5 px-3 rounded-lg text-[12px] font-bold cursor-pointer hover:bg-accent-dark transition-colors"
                >
                  ✕ رفض
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedComment(null)}
                  className="bg-gray-100 text-[#444] py-1.5 px-3 rounded-lg text-[12px] font-bold cursor-pointer hover:bg-gray-400 transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}

        </main>
      </div>
    </div>
  );
}

export default Comment;