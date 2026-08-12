import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";
import Scroll from "../../common/Scroll.jsx";

export default function Payment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    country: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [savedTotal, setSavedTotal] = useState("0");

  useEffect(() => {
    const total = localStorage.getItem("orderTotal") || 0;
    setSavedTotal(total);
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id.replace("-", "")]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { firstName, lastName, phone, email, country } = formData;

    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !email.trim()) {
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
      const certificateType = localStorage.getItem("certificateType");
      const total = localStorage.getItem("orderTotal");

      const fd = new FormData();
      fd.append("first_name", firstName);
      fd.append("last_name", lastName);
      fd.append("phone", phone);
      fd.append("email", email);
      fd.append("certificate_type", certificateType);
      fd.append("amount", total);
      fd.append("country", country);

      // 1️⃣ إنشاء الطلب
      const res1 = await fetch("/api/create_certificate_order.php", {
        method: "POST",
        body: fd
      });

      const data1 = await res1.json();

      if (!data1.success) {
        alert(data1.message || "فشل إنشاء الطلب");
        setLoading(false);
        return;
      }

      const orderId = data1.order_id;

      // 2️⃣ إنشاء Stripe Checkout
      const fd2 = new FormData();
      fd2.append("order_id", orderId);

      const res2 = await fetch("/api/create_stripe_checkout.php", {
        method: "POST",
        body: fd2
      });

      const data2 = await res2.json();

      if (data2.success && data2.checkout_url) {
        window.location.href = data2.checkout_url;
      } else {
        alert("فشل في إنشاء صفحة الدفع");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء الدفع");
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="flex mt-21.25 flex-row-reverse gap-12.5 p-[50px_10%] bg-[whitesmoke]" style={{ paddingTop: "120px", minHeight: "100vh" }}>
        <div className="flex-2">
          <h3 className="text-[#d32f2f] text-[1.2rem] mb-2.5 font-bold">تفاصيل الفاتورة</h3>
          <form id="checkout-form" onSubmit={handleSubmit}>
            <div className="flex gap-7.5">
              <div className="mb-5 flex-1">
                <label className="block mb-2 text-[0.9rem] text-[#333]">اسم العائلة *</label>
                <input
                  type="text"
                  id="last-name"
                  name="last-name"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-2 border border-[#e0e0e0] rounded-[25px] bg-white outline-none"
                />
              </div>
              <div className="mb-5 flex-1">
                <label className="block mb-2 text-[0.9rem] text-[#333]">الاسم الأول *</label>
                <input
                  type="text"
                  id="first-name"
                  name="first-name"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-2 border border-[#e0e0e0] rounded-[25px] bg-white outline-none"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block mb-2 text-[0.9rem] text-[#333]">اسم الشركة (اختياري)</label>
              <input type="text" className="w-full p-2 border border-[#e0e0e0] rounded-[25px] bg-white outline-none" />
            </div>

            <select
              id="country"
              value={formData.country}
              onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value }))}
              className="w-full p-2 border border-[#e0e0e0] rounded-[25px] bg-white outline-none mb-5"
            >
              <option value="">اختر الدولة</option>
              <option value="Saudi Arabia">المملكة العربية السعودية</option>
              <option value="UAE">الإمارات العربية المتحدة</option>
            </select>

            <div className="mb-5">
              <label className="block mb-2 text-[0.9rem] text-[#333]">الجوال *</label>
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

            <div className="mb-5">
              <label className="block mb-2 text-[0.9rem] text-[#333]">البريد الإلكتروني *</label>
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

            <h3 className="text-[#d32f2f] text-[1.2rem] mb-2.5 font-bold">معلومات إضافية</h3>
            <div className="mb-5">
              <textarea
                placeholder="ملاحظات حول الطلب، مثال: ملحوظة خاصة بتسليم الطلب."
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                className="w-full p-2 border border-[#e0e0e0] rounded-[15px] bg-white outline-none h-30"
              ></textarea>
            </div>
          </form>
        </div>

        <div className="flex-1">
          <div className="border border-[#f0f0f0] p-7.5 bg-[#fdfdfd] shadow-[0_4px_15px_rgba(0,0,0,0.05)] rounded-[25px]">
            <h3 className="text-center text-[#d32f2f] mb-5">طلبك</h3>
            <table className="w-full border-collapse mb-5">
              <thead>
                <tr>
                  <th className="p-[15px_0] border-b border-[#eee] text-right text-[0.9rem]">المجموع</th>
                  <th className="p-[15px_0] border-b border-[#eee] text-right text-[0.9rem]">المنتج</th>
                </tr>
              </thead>
              <tbody id="order-items">
                <tr>
                  <td className="p-[15px_0] border-b border-[#eee] text-right text-[0.9rem] font-bold text-accent">{savedTotal} د.ا</td>
                  <td className="p-[15px_0] border-b border-[#eee] text-right text-[0.9rem] font-bold">الإجمالي النهائي</td>
                </tr>
              </tbody>
            </table>

            <p className="text-[0.75rem] text-[#777] leading-[1.6]">
              سيتم استخدام بياناتك الشخصية لدعم تجربتك عبر هذا الموقع، ولإدارة
              الوصول إلى حسابك، ولأغراض أخرى موضحة في
              <a href="/privacy">سياسة الخصوصية</a>.
            </p>

            <button
              className="w-full bg-[#d32f2f] text-white p-5 border-none rounded-[5px] text-[1.1rem] font-bold cursor-pointer mt-5 hover:bg-accent-dark"
              id="pay-btn"
              type="submit"
              form="checkout-form"
              disabled={loading}
            >
              {loading ? "جاري المعالجة..." : "تأكيد وإتمام الطلب"}
            </button>
          </div>
        </div>
      </div>
      <Scroll />
      <Footer />
    </>
  );
}