import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "";

function getXsrfToken() {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="));

  return cookie ? decodeURIComponent(cookie.split("=")[1]) : "";
}

function AddCertificateType() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // حالات عرض الشهادات
  const [certificates, setCertificates] = useState([]);
  const [certificatesLoading, setCertificatesLoading] = useState(true);
  const [certificatesError, setCertificatesError] = useState(null);
  const [filter, setFilter] = useState("all"); // all | active | inactive

  // حالات تعديل الشهادة
  const [editingCert, setEditingCert] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    price: "",
    description: "",
    is_active: true,
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editResult, setEditResult] = useState(null);

  // القسم النشط: add | view | orders
  const [activeSection, setActiveSection] = useState("add");

  // حالات الطلبات
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // تأكيد الدفع عبر PATCH /api/certificate-requests/{id}/confirm-payment
  async function handleConfirmPayment(order) {
    // طلب الرقم المرجعي من المستخدم
    const paymentReference = window.prompt(
      `أدخل الرقم المرجعي للدفع للطلب رقم #${order.id}:`,
      ""
    );

    // إذا ألغى المستخدم أو لم يدخل شيئاً
    if (paymentReference === null) {
      return; // المستخدم ألغى
    }

    if (!paymentReference.trim()) {
      alert("يرجى إدخال الرقم المرجعي للدفع");
      return;
    }

    if (!window.confirm("هل أنت متأكد من تأكيد دفع هذا الطلب؟")) {
      return;
    }

    setActionLoadingId(order.id);

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

      // 3. إرسال طلب تأكيد الدفع مع الرقم المرجعي
      const res = await fetch(
        `${API_URL}/api/certificate-requests/${order.id}/confirm-payment`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": xsrfToken,
          },
          credentials: "include",
          body: JSON.stringify({
            payment_reference: paymentReference.trim(),
          }),
        }
      );

      // قراءة الرد بطريقة آمنة (قد يكون JSON أو نص فارغ)
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
            "فشل في تأكيد الدفع"
        );
      }

      alert(data.message || "تم تأكيد الدفع بنجاح");

      // تحديث قائمة الطلبات
      fetchOrders();
    } catch (error) {
      console.error("خطأ في تأكيد الدفع:", error);
      alert(error.message || "حدث خطأ أثناء تأكيد الدفع");
    } finally {
      setActionLoadingId(null);
    }
  }

  // تحديث حالة الطلب عبر PATCH /api/certificate-requests/{id}/status
  async function handleUpdateStatus(order, newStatus) {
    const actionText =
      newStatus === "approved" ? "قبول" : "رفض";

    if (
      !window.confirm(
        `هل أنت متأكد من ${actionText} هذا الطلب؟`
      )
    ) {
      return;
    }

    setActionLoadingId(order.id);

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

      // 3. إرسال طلب تحديث الحالة
      const res = await fetch(
        `${API_URL}/api/certificate-requests/${order.id}/status`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": xsrfToken,
          },
          credentials: "include",
          body: JSON.stringify({
            order_status: newStatus,
            admin_notes: "",
          }),
        }
      );

      // قراءة الرد بطريقة آمنة (قد يكون JSON أو نص فارغ)
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
            `فشل في ${actionText} الطلب`
        );
      }

      alert(data.message || `تم ${actionText} الطلب بنجاح`);

      // تحديث قائمة الطلبات
      fetchOrders();
    } catch (error) {
      console.error(`خطأ في ${actionText} الطلب:`, error);
      alert(
        error.message || `حدث خطأ أثناء ${actionText} الطلب`
      );
    } finally {
      setActionLoadingId(null);
    }
  }

  // جلب الطلبات من API
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

      // قراءة الرد بطريقة آمنة (قد يكون JSON أو نص فارغ)
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

      setOrders(items);
    } catch (error) {
      console.error("خطأ في جلب الطلبات:", error);
      setOrdersError(
        error.message || "حدث خطأ أثناء جلب الطلبات"
      );
    } finally {
      setOrdersLoading(false);
    }
  }

  // جلب الشهادات من API
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

      // 3. جلب الشهادات
      const res = await fetch(`${API_URL}/api/admin/certificate-types`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-XSRF-TOKEN": xsrfToken,
        },
        credentials: "include",
      });

      // قراءة الرد بطريقة آمنة (قد يكون JSON أو نص فارغ)
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

      // البيانات قد تكون مصفوفة مباشرة أو داخل certificate_types أو data
      const items = Array.isArray(data)
        ? data
        : data.certificate_types ||
          data.data ||
          data.certificates ||
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

  useEffect(() => {
    fetchCertificates();
    fetchOrders();
  }, []);

  // تصفية الشهادات حسب الحالة
  const filteredCertificates = certificates.filter((cert) => {
    if (filter === "active")
      return cert.is_active === true || cert.is_active === 1;
    if (filter === "inactive")
      return cert.is_active === false || cert.is_active === 0;
    return true;
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // فتح فورم التعديل مع تعبئة بيانات الشهادة
  function handleEditClick(cert) {
    setEditingCert(cert);
    setEditFormData({
      name: cert.name || "",
      price: cert.price !== undefined ? String(cert.price) : "",
      description: cert.description || "",
      is_active: cert.is_active === true || cert.is_active === 1,
    });
    setEditResult(null);
  }

  // إغلاق فورم التعديل
  function handleEditCancel() {
    setEditingCert(null);
    setEditResult(null);
  }

  // تغيير بيانات فورم التعديل
  function handleEditChange(e) {
    const { name, value, type, checked } = e.target;

    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // حفظ التعديلات عبر PUT /api/certificate-types/{id}
  async function handleEditSubmit(e) {
    e.preventDefault();

    if (!editingCert) return;

    if (!editFormData.name.trim()) {
      setEditResult({
        success: false,
        message: "يرجى إدخال اسم نوع الشهادة",
      });
      return;
    }

    if (editFormData.price === "") {
      setEditResult({
        success: false,
        message: "يرجى إدخال سعر الشهادة",
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

      // 3. إرسال طلب التعديل
      const res = await fetch(
        `${API_URL}/api/certificate-types/${editingCert.id}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": xsrfToken,
          },
          credentials: "include",
          body: JSON.stringify({
            name: editFormData.name.trim(),
            price: Number(editFormData.price),
            description: editFormData.description.trim(),
            is_active: editFormData.is_active,
          }),
        }
      );

      // قراءة الرد بطريقة آمنة (قد يكون JSON أو نص فارغ)
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
            "فشل في تعديل نوع الشهادة"
        );
      }

      setEditResult({
        success: true,
        message:
          data.message || "تم تعديل نوع الشهادة بنجاح",
      });

      // إغلاق فورم التعديل بعد النجاح
      setEditingCert(null);

      // تحديث قائمة الشهادات
      fetchCertificates();
    } catch (error) {
      console.error(
        "خطأ في تعديل نوع الشهادة:",
        error
      );

      setEditResult({
        success: false,
        message:
          error.message ||
          "حدث خطأ أثناء تعديل نوع الشهادة",
      });
    } finally {
      setEditLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.name.trim()) {
      setResult({
        success: false,
        message: "يرجى إدخال اسم نوع الشهادة",
      });
      return;
    }

    if (formData.price === "") {
      setResult({
        success: false,
        message: "يرجى إدخال سعر الشهادة",
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

      // 3. إرسال الطلب مع CSRF Token
      const res = await fetch(`${API_URL}/api/certificate-types`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": xsrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name.trim(),
          price: Number(formData.price),
          description: formData.description.trim(),
          is_active: formData.is_active,
        }),
      });

      // قراءة الرد بطريقة آمنة (قد يكون JSON أو نص فارغ)
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
            "فشل في إضافة نوع الشهادة"
        );
      }

      setResult({
        success: true,
        message:
          data.message || "تمت إضافة نوع الشهادة بنجاح",
      });

      setFormData({
        name: "",
        price: "",
        description: "",
        is_active: true,
      });
    } catch (error) {
      console.error(
        "خطأ في إضافة نوع الشهادة:",
        error
      );

      setResult({
        success: false,
        message:
          error.message ||
          "حدث خطأ أثناء إضافة نوع الشهادة",
      });
    } finally {
      setLoading(false);
    }

    // تحديث قائمة الشهادات بعد الإضافة
    fetchCertificates();
  }

  const inputClass =
    "w-full px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-[15px] text-[#334155] placeholder-[#94a3b8] outline-none transition-all duration-300 focus:border-accent focus:bg-white focus:ring-4 focus:ring-[rgba(228,42,58,0.08)]";

  const labelClass =
    "block mb-2 text-[14px] font-bold text-primary";

  return (
    <div
      dir="rtl"
      className="min-h-screen pt-35 lg:pt-37.5 pb-10 px-4 sm:px-6"
    >
      <div className="max-w-300 mx-auto flex flex-col lg:flex-row gap-7.5 items-start">

        {/* القائمة الجانبية */}
        <aside className="block w-full lg:w-62.5 lg:shrink-0 bg-white p-5 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.06)]">
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

            <li>
              <button
                onClick={() => setActiveSection("add")}
                className={`w-full block px-4 py-3 rounded-[10px] font-bold no-underline transition-colors duration-300 cursor-pointer border-none text-right ${
                  activeSection === "add"
                    ? "bg-sidebar-bg text-accent"
                    : "text-[#444] hover:bg-sidebar-bg hover:text-accent"
                }`}
              >
                إضافة نوع شهادة
              </button>
            </li>

            <li>
              <button
                onClick={() => setActiveSection("view")}
                className={`w-full block px-4 py-3 rounded-[10px] font-bold no-underline transition-colors duration-300 cursor-pointer border-none text-right ${
                  activeSection === "view"
                    ? "bg-sidebar-bg text-accent"
                    : "text-[#444] hover:bg-sidebar-bg hover:text-accent"
                }`}
              >
                عرض الشهادات
              </button>
            </li>

            <li>
              <button
                onClick={() => setActiveSection("orders")}
                className={`w-full block px-4 py-3 rounded-[10px] font-bold no-underline transition-colors duration-300 cursor-pointer border-none text-right ${
                  activeSection === "orders"
                    ? "bg-sidebar-bg text-accent"
                    : "text-[#444] hover:bg-sidebar-bg hover:text-accent"
                }`}
              >
                الطلبات
              </button>
            </li>

          </ul>
        </aside>

        {/* المحتوى الرئيسي: الفورم + عرض الشهادات */}
        <div className="flex-1 w-full flex flex-col gap-7.5">

        {/* الفورم */}
        {activeSection === "add" && (
        <form
          onSubmit={handleSubmit}
          className="w-full bg-white p-6 sm:p-8 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.06)]"
        >

          {/* الترويسة */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-[#f1f5f9]">
            <div>
              <h2 className="text-primary text-2xl font-bold">
                إضافة نوع شهادة جديد
              </h2>

              <p className="text-[#94a3b8] text-sm mt-1">
                قم بتعبئة البيانات التالية لإضافة نوع شهادة
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* اسم الشهادة */}
            <div>
              <label className={labelClass}>
                اسم الشهادة{" "}
                <span className="text-accent">*</span>
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="مثال: شهادة السلامة المهنية"
                className={inputClass}
              />
            </div>

            {/* السعر */}
            <div>
              <label className={labelClass}>
                السعر{" "}
                <span className="text-accent">*</span>
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="500"
                min="0"
                step="0.01"
                className={inputClass}
                dir="ltr"
              />
            </div>

            {/* الوصف */}
            <div className="md:col-span-2">
              <label className={labelClass}>
                الوصف
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="اكتب وصفًا لنوع الشهادة..."
                rows="5"
                className={inputClass + " resize-none"}
              />
            </div>

            

          </div>

          {/* النتيجة */}
          {result && (
            <div
              className={`mt-6 p-5 rounded-xl text-sm font-medium leading-relaxed border ${
                result.success
                  ? "bg-[#d1fae5] border-[#34d399] text-[#065f46]"
                  : "bg-[#fee2e2] border-[#f87171] text-[#991b1b]"
              }`}
            >
              {result.message}
            </div>
          )}

          {/* الأزرار */}
          <div className="flex flex-col sm:flex-row gap-3 items-center mt-8 pt-6 border-t-2 border-[#f1f5f9]">

            <button
              type="submit"
              disabled={loading}
              className="bg-accent text-white border-none py-3 px-8 rounded-xl font-bold cursor-pointer text-base transition-all duration-300 hover:bg-[#ce2634] hover:shadow-lg hover:shadow-[rgba(228,42,58,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  جاري الإضافة...
                </>
              ) : (
                <> إضافة نوع الشهادة</>
              )}
            </button>
            

            <Link
              to="/admin"
              className="inline-block py-3 px-6 bg-[#f1f5f9] text-primary no-underline rounded-xl font-bold text-center transition-all duration-300 hover:bg-[#e2e8f0] hover:text-accent"
            >
              العودة للوحة التحكم
            </Link>

          </div>

        </form>
        )}

        {/* ============================================
            عرض الشهادات
        ============================================ */}
        {activeSection === "view" && (
        <div className="w-full bg-white p-6 sm:p-8 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.06)]">

          {/* الترويسة */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 pb-6 border-b-2 border-[#f1f5f9]">
            <div className="flex-1">
              <h2 className="text-primary text-2xl font-bold">
                عرض الشهادات
              </h2>

              <p className="text-[#94a3b8] text-sm mt-1">
                جميع أنواع الشهادات المسجلة في النظام
              </p>
            </div>

            {/* الفلترة */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer border-none ${
                  filter === "all"
                    ? "bg-[#f59e0b] text-white"
                    : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
                }`}
              >
                الكل
              </button>

              <button
                onClick={() => setFilter("active")}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer border-none ${
                  filter === "active"
                    ? "bg-[#10b981] text-white"
                    : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
                }`}
              >
                نشط
              </button>

              <button
                onClick={() => setFilter("inactive")}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer border-none ${
                  filter === "inactive"
                    ? "bg-accent text-white"
                    : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"
                }`}
              >
                غير نشط
              </button>
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
            filteredCertificates.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-primary text-xl font-bold mb-2">
                  لا توجد شهادات
                </h3>
                <p className="text-[#94a3b8] mb-6">
                  {filter === "all"
                    ? "لم يتم إضافة أي شهادة بعد"
                    : filter === "active"
                    ? "لا توجد شهادات نشطة حالياً"
                    : "لا توجد شهادات غير نشطة حالياً"}
                </p>
              </div>
            )}

          {/* جدول الشهادات */}
          {!certificatesLoading &&
            !certificatesError &&
            filteredCertificates.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#f8fafc]">
                      <th className="p-4 text-right text-[13px] font-bold text-[#64748b] border-b border-[#e2e8f0]">
                        #
                      </th>

                      <th className="p-4 text-right text-[13px] font-bold text-[#64748b] border-b border-[#e2e8f0]">
                        اسم الشهادة
                      </th>

                      <th className="p-4 text-right text-[13px] font-bold text-[#64748b] border-b border-[#e2e8f0]">
                        السعر
                      </th>

                      <th className="p-4 text-right text-[13px] font-bold text-[#64748b] border-b border-[#e2e8f0]">
                        الوصف
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
                    {filteredCertificates.map((cert, index) => (
                      <tr
                        key={cert.id || index}
                        className="border-b border-[#f1f5f9] hover:bg-[#fafbfc] transition-colors duration-200"
                      >
                        <td className="p-4 text-[14px] text-[#64748b]">
                          {index + 1}
                        </td>

                        <td className="p-4 text-[14px] font-bold text-primary">
                          {cert.name}
                        </td>

                        <td className="p-4 text-[14px] text-[#334155]">
                          {cert.price} د.ا
                        </td>

                        <td className="p-4 text-[14px] text-[#64748b] max-w-60">
                          <span className="line-clamp-2">
                            {cert.description || "—"}
                          </span>
                        </td>

                        <td className="p-4">
                          {cert.is_active === true ||
                          cert.is_active === 1 ? (
                            <span className="inline-block px-3 py-1.5 rounded-full text-[12px] font-bold bg-[#d1fae5] text-[#065f46]">
                              نشط
                            </span>
                          ) : (
                            <span className="inline-block px-3 py-1.5 rounded-full text-[12px] font-bold bg-[#fef3c7] text-[#92400e]">
                              غير نشط
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
            filteredCertificates.length > 0 && (
              <div className="mt-6 pt-6 border-t-2 border-[#f1f5f9]">
                <p className="text-[13px] text-[#94a3b8] font-medium">
                  إجمالي الشهادات:{" "}
                  <span className="text-primary font-bold">
                    {filteredCertificates.length}
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
                    تعديل بيانات: {editingCert.name}
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
                {/* اسم الشهادة */}
                <div>
                  <label className={labelClass}>
                    اسم الشهادة{" "}
                    <span className="text-accent">*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    placeholder="مثال: شهادة السلامة المهنية"
                    className={inputClass}
                  />
                </div>

                {/* السعر */}
                <div>
                  <label className={labelClass}>
                    السعر{" "}
                    <span className="text-accent">*</span>
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={editFormData.price}
                    onChange={handleEditChange}
                    placeholder="500"
                    min="0"
                    step="0.01"
                    className={inputClass}
                    dir="ltr"
                  />
                </div>

                {/* الوصف */}
                <div className="md:col-span-2">
                  <label className={labelClass}>
                    الوصف
                  </label>

                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditChange}
                    placeholder="اكتب وصفًا لنوع الشهادة..."
                    rows="4"
                    className={inputClass + " resize-none"}
                  />
                </div>

                {/* الحالة */}
                <div className="md:col-span-2">
                  <label className={labelClass}>
                    الحالة
                  </label>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={editFormData.is_active}
                        onChange={handleEditChange}
                        className="w-5 h-5 accent-[#10b981]"
                      />
                      <span className="text-[14px] font-medium text-[#334155]">
                        الشهادة نشطة
                      </span>
                    </label>
                  </div>
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
                  className="bg-[#0369a1] text-white border-none py-3 px-8 rounded-xl font-bold cursor-pointer text-base transition-all duration-300 hover:bg-[#075985] hover:shadow-lg hover:shadow-[rgba(3,105,161,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {editLoading ? (
                    <>
                      <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      جاري الحفظ...
                    </>
                  ) : (
                    <> حفظ التعديلات</>
                  )}
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

        {/* ============================================
            عرض الطلبات
        ============================================ */}
        {activeSection === "orders" && (
        <div className="w-full bg-white p-6 sm:p-8 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.06)]">

          {/* الترويسة */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-[#f1f5f9]">
            <div className="flex-1">
              <h2 className="text-primary text-2xl font-bold">
                الطلبات
              </h2>

              <p className="text-[#94a3b8] text-sm mt-1">
                جميع طلبات الشهادات المقدمة
              </p>
            </div>
          </div>

          {/* حالة التحميل */}
          {ordersLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <span className="inline-block w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></span>
              <p className="text-[#94a3b8] font-medium">
                جاري تحميل الطلبات...
              </p>
            </div>
          )}

          {/* الخطأ */}
          {!ordersLoading && ordersError && (
            <div className="p-5 rounded-xl text-sm font-medium leading-relaxed border bg-[#fee2e2] border-[#f87171] text-[#991b1b]">
              {ordersError}
            </div>
          )}

          {/* لا توجد بيانات */}
          {!ordersLoading && !ordersError && orders.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-primary text-xl font-bold mb-2">
                لا توجد طلبات
              </h3>
              <p className="text-[#94a3b8]">
                لم يتم تقديم أي طلبات بعد
              </p>
            </div>
          )}

          {/* جدول الطلبات */}
          {!ordersLoading && !ordersError && orders.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#f8fafc]">
                    <th className="p-4 text-right text-[13px] font-bold text-[#64748b] border-b border-[#e2e8f0]">
                      #
                    </th>

                    <th className="p-4 text-right text-[13px] font-bold text-[#64748b] border-b border-[#e2e8f0]">
                      الاسم
                    </th>

                    <th className="p-4 text-right text-[13px] font-bold text-[#64748b] border-b border-[#e2e8f0]">
                      الشهادة
                    </th>

                    <th className="p-4 text-right text-[13px] font-bold text-[#64748b] border-b border-[#e2e8f0]">
                      المبلغ
                    </th>

                    <th className="p-4 text-right text-[13px] font-bold text-[#64748b] border-b border-[#e2e8f0]">
                      الجوال
                    </th>

                    <th className="p-4 text-right text-[13px] font-bold text-[#64748b] border-b border-[#e2e8f0]">
                      البريد الإلكتروني
                    </th>

                    <th className="p-4 text-right text-[13px] font-bold text-[#64748b] border-b border-[#e2e8f0]">
                      حالة الطلب
                    </th>

                    <th className="p-4 text-right text-[13px] font-bold text-[#64748b] border-b border-[#e2e8f0]">
                      حالة الدفع
                    </th>

                    <th className="p-4 text-right text-[13px] font-bold text-[#64748b] border-b border-[#e2e8f0]">
                      إجراءات
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order, index) => (
                    <tr
                      key={order.id || index}
                      className="border-b border-[#f1f5f9] hover:bg-[#fafbfc] transition-colors duration-200"
                    >
                      <td className="p-4 text-[14px] text-[#64748b]">
                        {index + 1}
                      </td>

                      <td className="p-4 text-[14px] font-bold text-primary">
                        {order.first_name} {order.last_name}
                      </td>

                      <td className="p-4 text-[14px] text-[#334155]">
                        {order.certificate_name ||
                          (order.certificate_type &&
                            order.certificate_type.name) ||
                          "—"}
                      </td>

                      <td className="p-4 text-[14px] text-[#334155]">
                        {order.amount} د.ا
                      </td>

                      <td className="p-4 text-[14px] text-[#64748b]" dir="ltr">
                        {order.phone}
                      </td>

                      <td className="p-4 text-[14px] text-[#64748b]" dir="ltr">
                        {order.email}
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-block px-3 py-1.5 rounded-full text-[12px] font-bold ${
                            order.order_status === "approved"
                              ? "bg-[#d1fae5] text-[#065f46]"
                              : order.order_status === "rejected"
                              ? "bg-[#fee2e2] text-[#991b1b]"
                              : "bg-[#fef3c7] text-[#92400e]"
                          }`}
                        >
                          {order.order_status === "approved"
                            ? "مقبول"
                            : order.order_status === "rejected"
                            ? "مرفوض"
                            : "قيد الانتظار"}
                        </span>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-block px-3 py-1.5 rounded-full text-[12px] font-bold ${
                            order.payment_status === "paid"
                              ? "bg-[#d1fae5] text-[#065f46]"
                              : "bg-[#fef3c7] text-[#92400e]"
                          }`}
                        >
                          {order.payment_status === "paid"
                            ? "مدفوع"
                            : "غير مدفوع"}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-col gap-2">
                          {/* قبول الطلب */}
                          {order.order_status === "pending" && (
                            <button
                              onClick={() =>
                                handleUpdateStatus(order, "approved")
                              }
                              disabled={actionLoadingId === order.id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold bg-[#d1fae5] text-[#065f46] border-none cursor-pointer transition-all duration-300 hover:bg-[#a7f3d0] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionLoadingId === order.id
                                ? "جاري..."
                                : "✓ قبول"}
                            </button>
                          )}

                          {/* رفض الطلب */}
                          {order.order_status === "pending" && (
                            <button
                              onClick={() =>
                                handleUpdateStatus(order, "rejected")
                              }
                              disabled={actionLoadingId === order.id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold bg-[#fee2e2] text-[#991b1b] border-none cursor-pointer transition-all duration-300 hover:bg-[#fecaca] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionLoadingId === order.id
                                ? "جاري..."
                                : "✕ رفض"}
                            </button>
                          )}

                          {/* تأكيد الدفع */}
                          {order.payment_status !== "paid" &&
                            order.order_status === "approved" && (
                              <button
                                onClick={() => handleConfirmPayment(order)}
                                disabled={actionLoadingId === order.id}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold bg-[#dbeafe] text-[#1d4ed8] border-none cursor-pointer transition-all duration-300 hover:bg-[#bfdbfe] disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {actionLoadingId === order.id
                                  ? "جاري..."
                                  : "💳 تأكيد الدفع"}
                              </button>
                            )}

                          {/* الطلب مقبول ومدفوع */}
                          {order.payment_status === "paid" && (
                            <span className="inline-block px-3 py-1.5 rounded-lg text-[12px] font-bold bg-[#d1fae5] text-[#065f46]">
                              ✓ مكتمل
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* عدد النتائج */}
          {!ordersLoading && !ordersError && orders.length > 0 && (
            <div className="mt-6 pt-6 border-t-2 border-[#f1f5f9]">
              <p className="text-[13px] text-[#94a3b8] font-medium">
                إجمالي الطلبات:{" "}
                <span className="text-primary font-bold">
                  {orders.length}
                </span>
              </p>
            </div>
          )}

        </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default AddCertificateType;