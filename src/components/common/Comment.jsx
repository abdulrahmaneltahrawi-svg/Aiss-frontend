import { useState, useEffect } from "react";

export default function Comment({ source = "article", id }) {
  const [comments, setComments] = useState([]);
  const [commentName, setCommentName] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [commentText, setCommentText] = useState("");
  const [pendingMessage, setPendingMessage] = useState("");
  const [error, setError] = useState("");

  // تحديد مسار الـ API حسب المصدر
  const getApiPath = () => {
    if (source === "magazine") return `magazines/${id}/comments`;
    if (source === "booklet") return `booklets/${id}/comments`;
    if (source === "codes") return `code-standards/${id}/comments`;
    if (source === "conference") return `conferences/${id}/comments`;
    return `articles/${id}/comments`;
  };

  // ==========================================
  // تحميل التعليقات من الخادم
  // ==========================================

  async function fetchComments() {
    try {
      const response = await fetch(`/api/${getApiPath()}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "لم يتم تحميل التعليقات");
        return;
      }

      setComments(data.comments || data);
    } catch (e) {
      console.error("Error loading comments:", e);
    }
  }

  useEffect(() => {
    fetchComments();
  }, [id, source]);

  // ==========================================
  // إرسال تعليق جديد
  // ==========================================

  async function handleAddComment(e) {
    e.preventDefault();

    if (!commentName.trim() || !commentEmail.trim() || !commentText.trim()) {
      return;
    }

    setError(""); // مسح أي خطأ سابق

    try {
      // 1. الحصول على CSRF Cookie
      await fetch("/sanctum/csrf-cookie", {
        method: "GET",
        credentials: "include",
      });

      const xsrfCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="));

      const xsrfToken = xsrfCookie
        ? decodeURIComponent(xsrfCookie.split("=")[1])
        : "";

      // 2. إرسال التعليق
      const response = await fetch(`/api/${getApiPath()}`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": xsrfToken,
        },
        body: JSON.stringify({
          name: commentName.trim(),
          email: commentEmail.trim(),
          body: commentText.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "فشل إرسال التعليق");
        return;
      }

      setPendingMessage("تم إرسال تعليقك وهو بانتظار موافقة الإدارة");

      setCommentName("");
      setCommentEmail("");
      setCommentText("");

      // إعادة تحميل التعليقات
      try {
        const refreshResponse = await fetch(`/api/${getApiPath()}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        const refreshData = await refreshResponse.json();

        if (refreshResponse.ok) {
          setComments(refreshData.comments || refreshData);
        }
      } catch (refreshErr) {
        console.error("Error refreshing comments:", refreshErr);
      }
    } catch (e) {
      console.error("Error adding comment:", e);
      setError("حدث خطأ في إرسال التعليق");
    }
  }

  // ==========================================
  // التعليقات الظاهرة
  // الـ Backend يرجع فقط التعليقات المقبولة (approved)
  // لكن في حالة وجود status نستخدمه كفلتر إضافي
  // ==========================================

  const approvedComments = Array.isArray(comments)
    ? comments.filter((c) => {
        // إذا لم يكن الحقل status موجوداً فالمفترض أن هذه
        // التعليقات كلها مقبولة (لأن الـ Backend يفلترها)
        if (c.status === undefined || c.status === null) return true;

        return c.status === "approved";
      })
    : [];

  // عنوان القسم حسب المصدر
  const sectionTitle =
    source === "magazine"
      ? "تعليقات المجلة"
      : source === "booklet"
      ? "تعليقات الكتيب"
      : source === "codes"
      ? "تعليقات الكود"
      : source === "conference"
      ? "تعليقات المؤتمر"
      : "تعليقات المقال";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* عنوان القسم */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          {sectionTitle}
        </h1>

        {pendingMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            {pendingMessage}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* نموذج إضافة تعليق */}
        <form
          onSubmit={handleAddComment}
          className="bg-white p-6 rounded-lg shadow-md mb-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                الاسم
              </label>
              <input
                type="text"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                required
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={commentEmail}
                onChange={(e) => setCommentEmail(e.target.value)}
                required
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              التعليق
            </label>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
              rows={4}
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm resize-y"
            />
          </div>

          <button
            type="submit"
            className="bg-primary text-white font-bold py-2.5 px-6 rounded-lg text-sm hover:bg-primary-dark transition-colors"
          >
            إرسال التعليق
          </button>
        </form>

        {/* قائمة التعليقات المقبولة */}
        <div className="space-y-4">
          {approvedComments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              لا توجد تعليقات بعد. كن أول من يعلق!
            </p>
          ) : (
            approvedComments.map((comment) => (
              <div
                key={comment.id}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {comment.name}
                    </p>
                    <p className="text-sm text-gray-500" dir="ltr">
                      {comment.email}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {comment.created_at}
                  </span>
                </div>
                <p className="text-gray-700 mt-2 leading-relaxed whitespace-pre-wrap break-words">
                  {comment.body}
                </p>
              </div>
            ))
          )}
        </div>

        {/* عدد التعليقات */}
        <div className="mt-8 text-sm text-gray-500">
          {approvedComments.length} تعليق
        </div>
      </div>
    </div>
  );
}