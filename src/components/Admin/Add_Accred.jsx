import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "";

function getXsrfToken() {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="));

  return cookie ? decodeURIComponent(cookie.split("=")[1]) : "";
}

function AddAccred() {
  const navigate = useNavigate();

  // القسم النشط: issue | view
  const [activeSection, setActiveSection] = useState("add");

  // حالات الطلبات
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);

  // حالات الفورم
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [code, setCode] = useState("");
  const [holderName, setHolderName] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [status, setStatus] = useState("active");
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // حالات عرض الشهادات الصادرة
  const [certificates, setCertificates] = useState([]);
  const [certificatesLoading, setCertificatesLoading] = useState(true);
  const [certificatesError, setCertificatesError] = useState(null);

  // حالات تعديل الشهادة
  const [editingCert, setEditingCert] = useState(null);
  const [editFormData, setEditFormData] = useState({
    code: "",
    holder_name: "",
    issue_date: "",
    expiry_date: "",
    status: "active",
  });
  const [editPdfFile, setEditPdfFile] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editResult, setEditResult] = useState(null);

  // جلب الشهادات الصادرة من API
  async function fetchCertificates() {
    setCertificatesLoading(true);
    setCertificatesError(null);

    try {
      // 1. الحصول على CSRF Cookie من Laravel
      const csrfResponse = await fetch(`${API_URL}/sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
      });

      if (!csrfResponse.ok) {
        throw new Error("فشل الحصول على CSRF Cookie");
      }

      // 2. قراءة XSRF-TOKEN من الكوكيز
      const xsrfToken = getXsrfToken();

      if (!xsrfToken) {
        throw new Error("لم يتم الحصول على CSRF Token");
      }

      // 3. جلب الشهادات الصادرة
      const res = await fetch(`${API_URL}/api/issued-certificates`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": xsrfToken,
        },
        credentials: "include",
      });

      // قراءة الرد بطريقة آمنة
      const contentType = res.headers.get("content-type") || "";

      let data;

      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();

        if (text) {
          try {
            data = JSON.parse(text);
          } catch {
            data = {};
          }
        } else {
          data = {};
        }
      }

      if (!res.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "فشل في جلب الشهادات"
        );
      }

      // البيانات قد تكون داخل certificates أو data
      const items = Array.isArray(data)
        ? data
        : data.certificates &&
          data.certificates.data
          ? data.certificates.data
          : Array.isArray(data.certificates)
          ? data.certificates
          : data.data ||
            [];

      setCertificates(items);
    } catch (error) {
      console.error("خطأ في جلب الشهادات:", error);
      setCertificatesError(
        error.message || "حدث خطأ أثناء جلب الشهادات"
      );
    } finally {
      setCertificatesLoading(false);
    }
  }

  // جلب الطلبات المقبولة والمدفوعة
  async function fetchOrders() {
    setOrdersLoading(true);
    setOrdersError(null);

    try {
      // 1. الحصول على CSRF Cookie من Laravel
      const csrfResponse = await fetch(`${API_URL}/sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
      });

      if (!csrfResponse.ok) {
        throw new Error("فشل الحصول على CSRF Cookie");
      }

      // 2. قراءة XSRF-TOKEN من الكوكيز
      const xsrfToken = getXsrfToken();

      if (!xsrfToken) {
        throw new Error("لم يتم الحصول على CSRF Token");
      }

      // 3. جلب الطلبات
      const res = await fetch(`${API_URL}/api/certificate-requests`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": xsrfToken,
        },
        credentials: "include",
      });

      // قراءة الرد بطريقة آمنة
      const contentType = res.headers.get("content-type") || "";

      let data;

      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();

        if (text) {
          try {
            data = JSON.parse(text);
          } catch {
            data = {};
          }
        } else {
          data = {};
        }
      }

      if (!res.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "فشل في جلب الطلبات"
        );
      }

      // البيانات قد تكون داخل certificate_requests أو data
      const items = Array.isArray(data)
        ? data
        : data.certificate_requests &&
          data.certificate_requests.data
          ? data.certificate_requests.data
          : Array.isArray(data.certificate_requests)
          ? data.certificate_requests
          : data.data ||
            data.requests ||
            [];

      // تصفية الطلبات: مقبولة ومدفوعة فقط (يمكن إصدار شهادة لها)
      const eligibleOrders = items.filter(
        (order) =>
          order.order_status === "approved" &&
          order.payment_status === "paid"
      );

      setOrders(eligibleOrders);
    } catch (error) {
      console.error("خطأ في جلب الطلبات:", error);
      setOrdersError(
        error.message || "حدث خطأ أثناء جلب الطلبات"
      );
    } finally {
      setOrdersLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  // فتح فورم تعديل الشهادة
  function handleEditClick(cert) {
    setEditingCert(cert);
    setEditFormData({
      code: cert.code || "",
      holder_name: cert.holder_name || "",
      issue_date: cert.issue_date ? cert.issue_date.slice(0, 10) : "",
      expiry_date: cert.expiry_date ? cert.expiry_date.slice(0, 10) : "",
      status: cert.status || "active",
    });
    setEditPdfFile(null);
    setEditResult(null);
  }

  // إغلاق فورم تعديل الشهادة
  function handleEditCancel() {
    setEditingCert(null);
    setEditPdfFile(null);
    setEditResult(null);
  }

  // تغيير بيانات فورم تعديل الشهادة
  function handleEditChange(e) {
    const { name, value } = e.target;

    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // حفظ تعديلات الشهادة عبر PUT /api/issued-certificates/{id}
  async function handleEditSubmit(e) {
    e.preventDefault();

    if (!editingCert) return;

    if (!editFormData.code.trim()) {
      setEditResult({
        success: false,
        message: "يرجى إدخال كود الشهادة",
      });
      return;
    }

    if (!editFormData.holder_name.trim()) {
      setEditResult({
        success: false,
        message: "يرجى إدخال اسم الحاصل على الشهادة",
      });
      return;
    }

    if (!editFormData.issue_date) {
      setEditResult({
        success: false,
        message: "يرجى إدخال تاريخ الإصدار",
      });
      return;
    }

    setEditLoading(true);
    setEditResult(null);

    try {
      // 1. الحصول على CSRF Cookie من Laravel
      const csrfResponse = await fetch(`${API_URL}/sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
      });

      if (!csrfResponse.ok) {
        throw new Error("فشل الحصول على CSRF Cookie");
      }

      // 2. قراءة XSRF-TOKEN من الكوكيز
      const xsrfToken = getXsrfToken();

      if (!xsrfToken) {
        throw new Error("لم يتم الحصول على CSRF Token");
      }

      // 3. إرسال طلب التعديل مع FormData
      // Laravel يتطلب _method=PUT مع POST عند استخدام FormData
      const fd = new FormData();
      fd.append("_method", "PUT");
      fd.append("code", editFormData.code.trim());
      fd.append("holder_name", editFormData.holder_name.trim());
      fd.append("issue_date", editFormData.issue_date);
      fd.append("expiry_date", editFormData.expiry_date || "");
      fd.append("status", editFormData.status);
      if (editPdfFile) fd.append("certificate_pdf", editPdfFile);

      const res = await fetch(
        `${API_URL}/api/issued-certificates/${editingCert.id}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "X-XSRF-TOKEN": xsrfToken,
          },
          credentials: "include",
          body: fd,
        }
      );

      // قراءة الرد بطريقة آمنة
      const contentType = res.headers.get("content-type") || "";

      let data;

      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();

        if (text) {
          try {
            data = JSON.parse(text);
          } catch {
            data = {};
          }
        } else {
          data = {};
        }
      }

      if (!res.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "فشل في تعديل الشهادة"
        );
      }

      setEditResult({
        success: true,
        message:
          data.message || "تم تعديل الشهادة بنجاح",
      });

      // إغلاق فورم التعديل
      setEditingCert(null);
      setEditPdfFile(null);

      // تحديث قائمة الشهادات
      fetchCertificates();
    } catch (error) {
      console.error("خطأ في تعديل الشهادة:", error);
      setEditResult({
        success: false,
        message:
          error.message || "حدث خطأ أثناء تعديل الشهادة",
      });
    } finally {
      setEditLoading(false);
    }
  }

  // عند اختيار طلب - إعادة تعبئة اسم الحاصل تلقائياً
  function handleOrderChange(e) {
    const orderId = e.target.value;
    setSelectedOrderId(orderId);

    const selectedOrder = orders.find(
      (order) => String(order.id) === orderId
    );

    if (selectedOrder) {
      setHolderName(
        `${selectedOrder.first_name} ${selectedOrder.last_name}`
      );
    } else {
      setHolderName("");
    }
  }

  // إصدار الشهادة عبر POST /api/certificate-requests/{id}/issue-certificate
  async function handleSubmit(e) {
    e.preventDefault();

    if (!selectedOrderId) {
      setResult({
        success: false,
        message: "يرجى اختيار الطلب",
      });
      return;
    }

    if (!code.trim()) {
      setResult({
        success: false,
        message: "يرجى إدخال كود الشهادة",
      });
      return;
    }

    if (!holderName.trim()) {
      setResult({
        success: false,
        message: "يرجى إدخال اسم الحاصل على الشهادة",
      });
      return;
    }

    if (!issueDate) {
      setResult({
        success: false,
        message: "يرجى إدخال تاريخ الإصدار",
      });
      return;
    }

    if (!pdfFile) {
      setResult({
        success: false,
        message: "يرجى اختيار ملف الشهادة (PDF)",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // 1. الحصول على CSRF Cookie من Laravel
      const csrfResponse = await fetch(`${API_URL}/sanctum/csrf-cookie`, {
        method: "GET",
        credentials: "include",
      });

      if (!csrfResponse.ok) {
        throw new Error("فشل الحصول على CSRF Cookie");
      }

      // 2. قراءة XSRF-TOKEN من الكوكيز
      const xsrfToken = getXsrfToken();

      if (!xsrfToken) {
        throw new Error("لم يتم الحصول على CSRF Token");
      }

      // 3. إرسال الطلب مع FormData (لأنه يحتوي ملف PDF)
      const fd = new FormData();
      fd.append("code", code.trim());
      fd.append("holder_name", holderName.trim());
      fd.append("issue_date", issueDate);
      fd.append("expiry_date", expiryDate || "");
      fd.append("status", status);
      fd.append("certificate_pdf", pdfFile);

      const res = await fetch(
        `${API_URL}/api/certificate-requests/${selectedOrderId}/issue-certificate`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "X-XSRF-TOKEN": xsrfToken,
          },
          credentials: "include",
          body: fd,
        }
      );

      // قراءة الرد بطريقة آمنة
      const contentType = res.headers.get("content-type") || "";

      let data;

      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();

        if (text) {
          try {
            data = JSON.parse(text);
          } catch {
            data = {};
          }
        } else {
          data = {};
        }
      }

      if (!res.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "فشل في إصدار الشهادة"
        );
      }

      setResult({
        success: true,
        message:
          data.message || "تم إصدار الشهادة بنجاح",
      });

      // تفريغ الفورم
      setSelectedOrderId("");
      setCode("");
      setHolderName("");
      setIssueDate("");
      setExpiryDate("");
      setStatus("active");
      setPdfFile(null);

      // تحديث قائمة الطلبات
    } catch (error) {
      console.error("خطأ في إصدار الشهادة:", error);
      setResult({
        success: false,
        message:
          error.message || "حدث خطأ أثناء إصدار الشهادة",
      });
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full p-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none";

  const labelClass =
    "block mb-2 font-bold text-primary";

  return (
    <div className="min-h-screen pt-35 lg:pt-37.5 pb-10 px-4 sm:px-6">
      <div className="max-w-300 mx-auto flex flex-col lg:flex-row gap-7.5 items-start">
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
              <button
                onClick={() => setActiveSection("add")}
                className={`w-full block px-4 py-3 rounded-[10px] font-bold no-underline transition-colors duration-300 cursor-pointer border-none text-right ${
                  activeSection === "add"
                    ? "bg-sidebar-bg text-accent"
                    : "text-[#444] hover:bg-sidebar-bg hover:text-accent"
                }`}
              >
                إصدار شهادة
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveSection("view");
                  fetchCertificates();
                }}
                className={`w-full block px-4 py-3 rounded-[10px] font-bold no-underline transition-colors duration-300 cursor-pointer border-none text-right ${
                  activeSection === "view"
                    ? "bg-sidebar-bg text-accent"
                    : "text-[#444] hover:bg-sidebar-bg hover:text-accent"
                }`}
              >
                عرض الشهادات
              </button>
            </li>
          </ul>
        </aside>

        {/* المحتوى الرئيسي */}
        <div className="flex-1 w-full flex flex-col gap-7.5">

        {/* فورم إصدار الشهادة */}
        {activeSection === "add" && (
        <form
          onSubmit={handleSubmit}
          className="w-full bg-white p-6 sm:p-7.5 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.06)]"
        >
          <h2 className="text-primary text-2xl font-bold mb-6.25">
            إصدار شهادة معتمدة
          </h2>

          {/* اختيار الطلب */}
          <div className="mb-5">
            <label className={labelClass}>
              الطلب <span className="text-accent">*</span>
            </label>

            {ordersLoading ? (
              <div className="p-4 text-center text-[#94a3b8]">
                جاري تحميل الطلبات...
              </div>
            ) : ordersError ? (
              <div className="p-4 rounded-lg bg-[#fee2e2] text-[#991b1b] text-sm">
                {ordersError}
              </div>
            ) : orders.length === 0 ? (
              <div className="p-4 rounded-lg bg-[#fef3c7] text-[#92400e] text-sm">
                لا توجد طلبات مقبولة ومدفوعة لإصدار شهادة لها
              </div>
            ) : (
              <select
                value={selectedOrderId}
                onChange={handleOrderChange}
                className={inputClass}
              >
                <option value="">اختر الطلب...</option>
                {orders.map((order) => (
                  <option key={order.id} value={order.id}>
                    #{order.id} - {order.first_name} {order.last_name} -{" "}
                    {order.certificate_name || "شهادة"} - {order.amount} د.ا
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* كود الشهادة */}
          <div className="mb-5">
            <label className={labelClass}>
              كود الشهادة <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="AISSFC2510001"
              className={inputClass}
            />
          </div>

          {/* اسم الحاصل */}
          <div className="mb-5">
            <label className={labelClass}>
              اسم الحاصل على الشهادة <span className="text-accent">*</span>
            </label>
            <input
              type="text"
              value={holderName}
              onChange={(e) => setHolderName(e.target.value)}
              placeholder="أحمد محمد"
              className={inputClass}
            />
          </div>

          {/* التواريخ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className={labelClass}>
                تاريخ الإصدار <span className="text-accent">*</span>
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>
                تاريخ الانتهاء (اختياري)
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* الحالة */}
          <div className="mb-5">
            <label className={labelClass}>الحالة</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={inputClass}
            >
              <option value="active">سارية</option>
              <option value="expired">منتهية الصلاحية</option>
              <option value="revoked">ملغاة</option>
            </select>
          </div>

          {/* ملف PDF */}
          <div className="mb-5">
            <label className={labelClass}>
              ملف الشهادة (PDF) <span className="text-accent">*</span>
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setPdfFile(e.target.files[0])}
              className={inputClass}
            />
          </div>

          {/* النتيجة */}
          {result && (
            <div
              className={`mt-6 p-5 rounded-xl text-sm font-medium leading-relaxed ${
                result.success
                  ? "bg-[#d1fae5] border border-[#34d399] text-[#065f46]"
                  : "bg-[#fee2e2] border border-[#f87171] text-[#991b1b]"
              }`}
            >
              {result.message}
            </div>
          )}

          {/* الأزرار */}
          <div className="flex flex-col sm:flex-row gap-3 items-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-accent text-white border-none py-3 px-7.5 rounded-lg font-bold cursor-pointer text-base transition-colors duration-300 hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "جاري الإصدار..." : "إصدار الشهادة"}
            </button>
            <Link
              to="/"
              className="inline-block py-2.5 px-5 bg-primary text-white no-underline rounded-lg font-bold text-center transition-colors duration-300 hover:bg-[#1a3d63] hover:text-white"
            >
              الرجوع للموقع
            </Link>
          </div>
        </form>
        )}

        {/* ============================================
            عرض الشهادات الصادرة
        ============================================ */}
        {activeSection === "view" && (
        <div className="w-full bg-white p-6 sm:p-8 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.06)]">

          {/* الترويسة */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-[#f1f5f9]">
            <div className="flex-1">
              <h2 className="text-primary text-2xl font-bold">
                الشهادات الصادرة
              </h2>

              <p className="text-[#94a3b8] text-sm mt-1">
                جميع الشهادات المعتمدة الصادرة
              </p>
            </div>
          </div>

          {/* حالة التحميل */}
          {certificatesLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <span className="inline-block w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></span>
              <p className="text-[#94a3b8] font-medium">
                جاري تحميل الشهادات...
              </p>
            </div>
          )}

          {/* الخطأ */}
          {!certificatesLoading && certificatesError && (
            <div className="p-5 rounded-xl text-sm font-medium leading-relaxed border bg-[#fee2e2] border-[#f87171] text-[#991b1b]">
              {certificatesError}
            </div>
          )}

          {/* لا توجد بيانات */}
          {!certificatesLoading &&
            !certificatesError &&
            certificates.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📜</div>
                <h3 className="text-primary text-xl font-bold mb-2">
                  لا توجد شهادات
                </h3>
                <p className="text-[#94a3b8]">
                  لم يتم إصدار أي شهادة بعد
                </p>
              </div>
            )}

          {/* جدول الشهادات */}
          {!certificatesLoading &&
            !certificatesError &&
            certificates.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#f8fafc]">
                      <th className="p-4 text-right text-[13px] font-bold text-[#64748b] border-b border-[#e2e8f0]">
                        #
                      </th>

                      <th className="p-4 text-right text-[13px] font-bold text-[#64748b] border-b border-[#e2e8f0]">
                        كود الشهادة
                      </th>

                      <th className="p-4 text-right text-[13px] font-bold text-[#64748b] border-b border-[#e2e8f0]">
                        اسم الحاصل
                      </th>

                      <th className="p-4 text-right text-[13px] font-bold text-[#64748b] border-b border-[#e2e8f0]">
                        تاريخ الإصدار
                      </th>

                      <th className="p-4 text-right text-[13px] font-bold text-[#64748b] border-b border-[#e2e8f0]">
                        تاريخ الانتهاء
                      </th>

                      <th className="p-4 text-right text-[13px] font-bold text-[#64748b] border-b border-[#e2e8f0]">
                        الحالة
                      </th>

                      <th className="p-4 text-right text-[13px] font-bold text-[#64748b] border-b border-[#e2e8f0]">
                        إجراءات
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {certificates.map((cert, index) => (
                      <tr
                        key={cert.id || index}
                        className="border-b border-[#f1f5f9] hover:bg-[#fafbfc] transition-colors duration-200"
                      >
                        <td className="p-4 text-[14px] text-[#64748b]">
                          {index + 1}
                        </td>

                        <td className="p-4 text-[14px] font-bold text-primary" dir="ltr">
                          {cert.code}
                        </td>

                        <td className="p-4 text-[14px] text-[#334155]">
                          {cert.holder_name}
                        </td>

                        <td className="p-4 text-[14px] text-[#64748b]">
                          {cert.issue_date ? cert.issue_date.slice(0, 10) : "—"}
                        </td>

                        <td className="p-4 text-[14px] text-[#64748b]">
                          {cert.expiry_date ? cert.expiry_date.slice(0, 10) : "—"}
                        </td>

                        <td className="p-4">
                          {cert.status === "active" ? (
                            <span className="inline-block px-3 py-1.5 rounded-full text-[12px] font-bold bg-[#d1fae5] text-[#065f46]">
                              سارية
                            </span>
                          ) : cert.status === "expired" ? (
                            <span className="inline-block px-3 py-1.5 rounded-full text-[12px] font-bold bg-[#fef3c7] text-[#92400e]">
                              منتهية
                            </span>
                          ) : (
                            <span className="inline-block px-3 py-1.5 rounded-full text-[12px] font-bold bg-[#fee2e2] text-[#991b1b]">
                              ملغاة
                            </span>
                          )}
                        </td>

                        <td className="p-4">
                          <button
                            onClick={() => handleEditClick(cert)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold bg-[#e0f2fe] text-[#0369a1] border-none cursor-pointer transition-all duration-300 hover:bg-[#bae6fd]"
                          >
                            ✏️ تعديل
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          {/* عدد النتائج */}
          {!certificatesLoading &&
            !certificatesError &&
            certificates.length > 0 && (
              <div className="mt-6 pt-6 border-t-2 border-[#f1f5f9]">
                <p className="text-[13px] text-[#94a3b8] font-medium">
                  إجمالي الشهادات:{" "}
                  <span className="text-primary font-bold">
                    {certificates.length}
                  </span>
                </p>
              </div>
            )}

        </div>
        )}

        {/* ============================================
            فورم تعديل الشهادة
        ============================================ */}
        {activeSection === "view" && editingCert && (
          <div className="w-full bg-white p-6 sm:p-8 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.06)] border-2 border-[#e0f2fe]">
            <form onSubmit={handleEditSubmit}>
              {/* الترويسة */}
              <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b-2 border-[#f1f5f9]">
                <div>
                  <h2 className="text-primary text-2xl font-bold">
                    تعديل الشهادة
                  </h2>

                  <p className="text-[#94a3b8] text-sm mt-1">
                    تعديل بيانات: {editingCert.code}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleEditCancel}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[#fee2e2] text-[#991b1b] text-lg font-bold border-none cursor-pointer transition-all duration-300 hover:bg-[#fecaca]"
                  title="إغلاق"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* كود الشهادة */}
                <div>
                  <label className={labelClass}>
                    كود الشهادة <span className="text-accent">*</span>
                  </label>

                  <input
                    type="text"
                    name="code"
                    value={editFormData.code}
                    onChange={handleEditChange}
                    placeholder="AISSFC2510001"
                    className={inputClass}
                  />
                </div>

                {/* اسم الحاصل */}
                <div>
                  <label className={labelClass}>
                    اسم الحاصل <span className="text-accent">*</span>
                  </label>

                  <input
                    type="text"
                    name="holder_name"
                    value={editFormData.holder_name}
                    onChange={handleEditChange}
                    placeholder="أحمد محمد"
                    className={inputClass}
                  />
                </div>

                {/* تاريخ الإصدار */}
                <div>
                  <label className={labelClass}>
                    تاريخ الإصدار <span className="text-accent">*</span>
                  </label>

                  <input
                    type="date"
                    name="issue_date"
                    value={editFormData.issue_date}
                    onChange={handleEditChange}
                    className={inputClass}
                  />
                </div>

                {/* تاريخ الانتهاء */}
                <div>
                  <label className={labelClass}>
                    تاريخ الانتهاء
                  </label>

                  <input
                    type="date"
                    name="expiry_date"
                    value={editFormData.expiry_date}
                    onChange={handleEditChange}
                    className={inputClass}
                  />
                </div>

                {/* الحالة */}
                <div>
                  <label className={labelClass}>الحالة</label>

                  <select
                    name="status"
                    value={editFormData.status}
                    onChange={handleEditChange}
                    className={inputClass}
                  >
                    <option value="active">سارية</option>
                    <option value="expired">منتهية الصلاحية</option>
                    <option value="revoked">ملغاة</option>
                  </select>
                </div>

                {/* ملف PDF */}
                <div>
                  <label className={labelClass}>
                    ملف الشهادة (PDF)
                  </label>

                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setEditPdfFile(e.target.files[0])}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* النتيجة */}
              {editResult && (
                <div
                  className={`mt-6 p-5 rounded-xl text-sm font-medium leading-relaxed border ${
                    editResult.success
                      ? "bg-[#d1fae5] border-[#34d399] text-[#065f46]"
                      : "bg-[#fee2e2] border-[#f87171] text-[#991b1b]"
                  }`}
                >
                  {editResult.message}
                </div>
              )}

              {/* الأزرار */}
              <div className="flex flex-col sm:flex-row gap-3 items-center mt-8 pt-6 border-t-2 border-[#f1f5f9]">
                <button
                  type="submit"
                  disabled={editLoading}
                  className="bg-[#0369a1] text-white border-none py-3 px-8 rounded-xl font-bold cursor-pointer text-base transition-all duration-300 hover:bg-[#075985] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {editLoading ? "جاري الحفظ..." : "حفظ التعديلات"}
                </button>

                <button
                  type="button"
                  onClick={handleEditCancel}
                  className="inline-block py-3 px-6 bg-[#f1f5f9] text-primary no-underline rounded-xl font-bold text-center transition-all duration-300 hover:bg-[#e2e8f0] hover:text-accent cursor-pointer border-none"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        </div>
      </div>
    </div>
  );
}

export default AddAccred;
