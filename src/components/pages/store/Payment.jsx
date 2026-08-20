import { useEffect, useState } from "react";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";
import Scroll from "../../common/Scroll.jsx";

const API_URL = "";

export default function Payment() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    phone: "",
    email: "",
    country: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [savedTotal, setSavedTotal] = useState("0");
  const [certificateName, setCertificateName] = useState("");

  // مسح بيانات النموذج و localStorage بعد إتمام الطلب
  const resetOrderData = () => {
    // مسح React state
    setFormData({
      firstName: "",
      lastName: "",
      companyName: "",
      phone: "",
      email: "",
      country: "",
      notes: "",
    });

    setSavedTotal("0");
    setCertificateName("");

    // مسح localStorage
    localStorage.removeItem("certificateType");
    localStorage.removeItem("orderTotal");
    localStorage.removeItem("orderCompleted");

    // مسح الحقول مباشرة من DOM (مضمون 100%)
    const form = document.getElementById("checkout-form");

    if (form) {
      form.reset();

      form
        .querySelectorAll("input, select, textarea")
        .forEach((el) => {
          el.value = "";
        });
    }
  };

  useEffect(() => {
    // إذا كان هناك طلب مكتمل سابقاً - امسح البيانات واخرج من الصفحة
    const orderFlag = localStorage.getItem("orderCompleted");

    if (orderFlag === "1") {
      localStorage.removeItem("orderCompleted");

      // مسح البيانات أولاً ثم الخروج من الصفحة بعد التأكد
      resetOrderData();

      // تأخير صغير لضمان اكتمال مسح البيانات قبل التنقل
      setTimeout(() => {
        window.location.href = "/";
      }, 100);

      return;
    }

    const total = localStorage.getItem("orderTotal") || "0";
    const certType = localStorage.getItem("certificateType");

    setSavedTotal(total);

    if (certType === "1") {
      setCertificateName("شهادة مدرب معتمد");
    } else if (certType === "2") {
      setCertificateName("شهادة مركز معتمد");
    }

    // عند العودة من Stripe (عبر BFCache أو رجوع) - امسح البيانات واخرج من الصفحة
    const handlePageShow = () => {
      if (localStorage.getItem("orderCompleted") === "1") {
        localStorage.removeItem("orderCompleted");

        // مسح البيانات أولاً ثم الخروج من الصفحة بعد التأكد
        resetOrderData();

        // تأخير صغير لضمان اكتمال مسح البيانات قبل التنقل
        setTimeout(() => {
          window.location.href = "/";
        }, 100);
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  // تغيير بيانات الحقول
  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // قراءة CSRF Token من Cookie
  const getCsrfToken = () => {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="));

    if (!cookie) return null;

    return decodeURIComponent(cookie.split("=")[1]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      firstName,
      lastName,
      companyName,
      phone,
      email,
      country,
      notes,
    } = formData;

    // التحقق من البيانات
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !phone.trim() ||
      !email.trim()
    ) {
      alert("يرجى ملء جميع الحقول الإلزامية التي تحمل علامة (*)");
      return;
    }

    if (!country) {
      alert("يرجى اختيار الدولة");
      return;
    }

    if (!email.includes("@")) {
      alert("البريد الإلكتروني غير صحيح");
      return;
    }

    setLoading(true);

    try {
      const certificateType =
        localStorage.getItem("certificateType") || "";

      const total =
        localStorage.getItem("orderTotal") || "0";

      /*
      |--------------------------------------------------------------------------
      | CSRF Token
      |--------------------------------------------------------------------------
      */

      // 1. الحصول على CSRF Cookie من Laravel
      const csrfResponse = await fetch(
        `${API_URL}/sanctum/csrf-cookie`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!csrfResponse.ok) {
        throw new Error(
          "فشل الحصول على CSRF Cookie"
        );
      }

      // 2. قراءة CSRF Token من الكوكيز
      const csrfToken = getCsrfToken();

      if (!csrfToken) {
        throw new Error(
          "لم يتم العثور على XSRF-TOKEN"
        );
      }

      /*
      |--------------------------------------------------------------------------
      | إنشاء الطلب
      |--------------------------------------------------------------------------
      */

      const fd = new FormData();

      fd.append("certificate_type_id", certificateType);
      fd.append("first_name", firstName);
      fd.append("last_name", lastName);
      fd.append("company_name", companyName || "");
      fd.append("country", country);
      fd.append("phone", phone);
      fd.append("email", email);
      fd.append("notes", notes || "");

      const headers = {
        Accept: "application/json",
      };

      if (csrfToken) {
        headers["X-XSRF-TOKEN"] = csrfToken;
      }

      const res1 = await fetch(
        `${API_URL}/api/certificate-requests`,
        {
          method: "POST",
          headers,
          body: fd,
          credentials: "include",
        }
      );

      /*
      |--------------------------------------------------------------------------
      | قراءة الرد بطريقة آمنة
      |--------------------------------------------------------------------------
      */

      const contentType = res1.headers.get("content-type") || "";

      let data1;

      if (contentType.includes("application/json")) {
        data1 = await res1.json();
      } else {
        const text = await res1.text();

        console.error(
          "Laravel returned non-JSON:",
          text
        );

        if (res1.status === 419) {
          throw new Error(
            "419 - CSRF Token mismatch. تحقق من إعداد CSRF في Laravel."
          );
        }

        if (res1.status === 422) {
          throw new Error(
            "422 - البيانات المرسلة غير صحيحة."
          );
        }

        if (res1.status === 500) {
          throw new Error(
            "500 - يوجد خطأ داخل Laravel."
          );
        }

        throw new Error(
          `خطأ من Laravel: ${res1.status}`
        );
      }

      /*
      |--------------------------------------------------------------------------
      | التحقق من إنشاء الطلب
      |--------------------------------------------------------------------------
      */

      if (!res1.ok) {
        const errorMessage =
          data1.message ||
          (data1.errors
            ? Object.values(data1.errors).flat().join("، ")
            : "فشل إنشاء الطلب");

        alert(errorMessage);

        setLoading(false);
        return;
      }

      const certificateRequest =
        data1.certificate_request || data1;

      console.log(
        "تم إنشاء طلب الشهادة:",
        certificateRequest.id
      );

      // مسح جميع البيانات بعد نجاح الطلب
      resetOrderData();

      // إظهار رسالة نجاح
      alert(
        "تم استلام طلبك بنجاح! سيتم التواصل معك قريباً."
      );

      // توجيه المستخدم للرئيسية
      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    } catch (error) {
      console.error(
        "خطأ:",
        error
      );

      alert(
        error.message ||
          "حدث خطأ أثناء الدفع"
      );

      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div
        className="flex mt-21.25 flex-row-reverse gap-12.5 p-[50px_10%] bg-[whitesmoke]"
        style={{
          paddingTop: "120px",
          minHeight: "100vh",
        }}
      >
        {/* بيانات العميل */}
        <div className="flex-2">
          <h3 className="text-[#d32f2f] text-[1.2rem] mb-2.5 font-bold">
            تفاصيل الفاتورة
          </h3>

          <form
            id="checkout-form"
            onSubmit={handleSubmit}
          >
            <div className="flex gap-7.5">
              {/* اسم العائلة */}
              <div className="mb-5 flex-1">
                <label className="block mb-2 text-[0.9rem] text-[#333]">
                  اسم العائلة *
                </label>

                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-2 border border-[#e0e0e0] rounded-[25px] bg-white outline-none"
                />
              </div>

              {/* الاسم الأول */}
              <div className="mb-5 flex-1">
                <label className="block mb-2 text-[0.9rem] text-[#333]">
                  الاسم الأول *
                </label>

                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-2 border border-[#e0e0e0] rounded-[25px] bg-white outline-none"
                />
              </div>
            </div>

            {/* الشركة */}
            <div className="mb-5">
              <label className="block mb-2 text-[0.9rem] text-[#333]">
                اسم الشركة (اختياري)
              </label>

              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full p-2 border border-[#e0e0e0] rounded-[25px] bg-white outline-none"
              />
            </div>

            {/* الدولة */}
            <div className="mb-5">
              <label className="block mb-2 text-[0.9rem] text-[#333]">
                الدولة *
              </label>

              <select
                id="country"
                name="country"
                required
                value={formData.country}
                onChange={handleChange}
                className="w-full p-2 border border-[#e0e0e0] rounded-[25px] bg-white outline-none"
              >
                <option value="">
                  اختر الدولة
                </option>

                <option value="Saudi Arabia">
                  المملكة العربية السعودية
                </option>

                <option value="UAE">
                  الإمارات العربية المتحدة
                </option>
              </select>
            </div>

            {/* الجوال */}
            <div className="mb-5">
              <label className="block mb-2 text-[0.9rem] text-[#333]">
                الجوال *
              </label>

              <input
                type="tel"
                id="phone"
                name="phone"
                required
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border border-[#e0e0e0] rounded-[25px] bg-white outline-none"
              />
            </div>

            {/* البريد */}
            <div className="mb-5">
              <label className="block mb-2 text-[0.9rem] text-[#333]">
                البريد الإلكتروني *
              </label>

              <input
                type="email"
                id="email"
                name="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-[#e0e0e0] rounded-[25px] bg-white outline-none"
              />
            </div>

            {/* الملاحظات */}
            <h3 className="text-[#d32f2f] text-[1.2rem] mb-2.5 font-bold">
              معلومات إضافية
            </h3>

            <div className="mb-5">
              <textarea
                id="notes"
                name="notes"
                placeholder="ملاحظات حول الطلب، مثال: ملحوظة خاصة بتسليم الطلب."
                value={formData.notes}
                onChange={handleChange}
                className="w-full p-2 border border-[#e0e0e0] rounded-[15px] bg-white outline-none h-30"
              />
            </div>
          </form>
        </div>

        {/* ملخص الطلب */}
        <div className="flex-1">
          <div className="border border-[#f0f0f0] p-7.5 bg-[#fdfdfd] shadow-[0_4px_15px_rgba(0,0,0,0.05)] rounded-[25px]">
            <h3 className="text-center text-[#d32f2f] mb-5">
              طلبك
            </h3>

            <table className="w-full border-collapse mb-5">
              <thead>
                <tr>
                  <th className="p-[15px_0] border-b border-[#eee] text-right text-[0.9rem]">
                    المجموع
                  </th>

                  <th className="p-[15px_0] border-b border-[#eee] text-right text-[0.9rem]">
                    المنتج
                  </th>
                </tr>
              </thead>

              <tbody>
                {certificateName && (
                  <tr>
                    <td className="p-[15px_0] border-b border-[#eee] text-right text-[0.9rem] font-bold text-accent">
                      {savedTotal} د.ا
                    </td>

                    <td className="p-[15px_0] border-b border-[#eee] text-right text-[0.9rem] font-bold">
                      {certificateName}
                    </td>
                  </tr>
                )}

                <tr>
                  <td className="p-[15px_0] border-b border-[#eee] text-right text-[0.9rem] font-bold text-accent">
                    {savedTotal} د.ا
                  </td>

                  <td className="p-[15px_0] border-b border-[#eee] text-right text-[0.9rem] font-bold">
                    الإجمالي النهائي
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="text-[0.75rem] text-[#777] leading-[1.6]">
              سيتم استخدام بياناتك الشخصية لدعم تجربتك عبر هذا الموقع،
              ولإدارة الوصول إلى حسابك، ولأغراض أخرى موضحة في{" "}
              <a href="/privacy">
                سياسة الخصوصية
              </a>
              .
            </p>

            <button
              className="w-full bg-[#d32f2f] text-white p-5 border-none rounded-[5px] text-[1.1rem] font-bold cursor-pointer mt-5 hover:bg-accent-dark"
              id="pay-btn"
              type="submit"
              form="checkout-form"
              disabled={loading}
            >
              {loading
                ? "جاري المعالجة..."
                : "تأكيد وإتمام الطلب"}
            </button>
          </div>
        </div>
      </div>

      <Scroll />
      <Footer />
    </>
  );
}