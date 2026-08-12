import { useEffect } from "react";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";

export default function Certificate() {
  useEffect(() => {
    // Make verify function globally accessible
    window.verify = async function () {
      const code = document.getElementById("code")?.value?.trim();
      const resultDiv = document.getElementById("result");
      if (!resultDiv) return;

      if (!code) {
        resultDiv.style.display = "block";
        resultDiv.innerHTML =
          '<div class="card error-card"><h3>⚠️ يرجى إدخال كود الشهادة</h3></div>';
        return;
      }

      resultDiv.style.display = "block";
      resultDiv.innerHTML =
        '<p style="text-align:center;color:#6b7280">جاري التحقق...</p>';

      try {
        const base = window.location.pathname
          .replace(/\/[^\/]*$/, "")
          .replace(/\/api$/, "");
        const res = await fetch(
          base + `/api/verify.php?code=${encodeURIComponent(code)}`,
          { credentials: "include" }
        );
        const data = await res.json();

        if (!data.success) {
          resultDiv.innerHTML = `<div class="card error-card"><h3>❌ ${data.message}</h3></div>`;
          return;
        }

        const badgeClass =
          data.status === "active"
            ? "active"
            : data.status === "expired"
            ? "expired"
            : "revoked";
        const icon = data.valid ? "✅" : "❌";

        resultDiv.innerHTML = `
          <div class="card success-card">
            <h3>${icon} ${data.valid ? "شهادة معتمدة" : "الشهادة غير سارية"}</h3>
            <div class="row"><span class="label">نوع الشهادة</span><span class="value">${data.type}</span></div>
            <div class="row"><span class="label">الاسم</span><span class="value">${data.holder_name}</span></div>
            <div class="row"><span class="label">كود الشهادة</span><span class="value">${data.code}</span></div>
            <div class="row"><span class="label">تاريخ الإصدار</span><span class="value">${data.issue_date}</span></div>
            <div class="row"><span class="label">تاريخ الانتهاء</span><span class="value">${data.expiry_date ?? "غير محدد"}</span></div>
            <div class="row"><span class="label">الحالة</span><span class="value"><span class="badge ${badgeClass}">${data.status_label}</span></span></div>
            <a class="pdf-btn" href="${data.file_url}" target="_blank">📄 عرض الشهادة PDF</a>
          </div>`;
      } catch (err) {
        resultDiv.innerHTML = `<div class="card error-card"><h3>خطأ: ${err.message}</h3></div>`;
      }
    };

    // Enter key support
    document.getElementById("code")?.addEventListener("keypress", function (e) {
      if (e.key === "Enter") window.verify();
    });
  }, []);

  return (
    <>
      <Header />
      <main className="page-content">
        <div className="bg-white p-[100px_20px] rounded-[30px] shadow-[0_4px_15px_rgba(0,0,0,0.05)] w-full max-w-125 my-37.5 mx-auto block">
          <h2 className="text-primary text-center mb-7.5 font-extrabold">التحقق من شهادة</h2>
          <label htmlFor="code" className="font-bold text-[14px] text-[#555] block mb-2.5">كود الشهادة</label>
          <input type="text" id="code" placeholder="AISSFC25070050" className="w-full p-[12px_15px] my-[8px_0_16px] box-border border border-[#ddd] rounded-md text-[15px] outline-none transition-[border-color_0.3s] focus:border-primary" />
          <button className="bg-accent text-white p-1.5 border-none rounded-md cursor-pointer w-full text-[16px] font-bold transition-[background_0.3s] hover:bg-[#ce2634]" onClick={() => window.verify()}>
            تحقق
          </button>
          <div id="result" className="mt-6 hidden"></div>
        </div>
      </main>
      <Footer />
    </>
  );
}