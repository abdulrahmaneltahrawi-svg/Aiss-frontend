import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Add_certificate() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [type, setType] = useState("خبير معتمد");
  const [holderName, setHolderName] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [status, setStatus] = useState("active");
  const [pdfFile, setPdfFile] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch("/api/check_user_auth.php", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (!data.authenticated || !data.user || data.user.can_add_article != 1) {
          window.location.href = "/";
        }
      });
  }, []);

  async function handleSubmit() {
    const formData = new FormData();
    formData.append("code", code);
    formData.append("type", type);
    formData.append("holder_name", holderName);
    formData.append("issue_date", issueDate);
    formData.append("expiry_date", expiryDate);
    formData.append("status", status);
    if (pdfFile) formData.append("pdf", pdfFile);

    setResult(null);

    try {
      const res = await fetch("/api/add_certificate.php", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      setResult(data);
      alert(data.message);
      if (data.success) navigate("/admin");
    } catch (err) {
      const msg = "خطأ في الاتصال: " + err.message;
      setResult({ success: false, message: msg });
      alert(msg);
    }
  }

  return (
    <div className="min-h-screen pt-35 lg:pt-37.5 pb-10 px-4 sm:px-6">
      <div className="max-w-300 mx-auto flex flex-col lg:flex-row gap-7.5 items-start">
        <aside className="hidden lg:block w-62.5 shrink-0 bg-white p-5 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.06)]">
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
              <Link
                to="/admin/add-certificate"
                className="block px-4 py-3 rounded-[10px] font-bold no-underline transition-colors duration-300 bg-sidebar-bg text-accent"
              >
                إضافة شهادة
              </Link>
            </li>
          </ul>
        </aside>

        <form className="flex-1 w-full bg-white p-6 sm:p-7.5 rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.06)]">
          <h2 className="text-primary text-2xl font-bold mb-6.25">إضافة شهادة جديدة</h2>

          <div className="mb-5">
            <label className="block mb-2 font-bold text-primary">كود الشهادة</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="AISSFC2510001"
              className="w-full p-3 border border-gray-300 rounded-lg mb-2.5 focus:border-primary focus:outline-none"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-bold text-primary">نوع الشهادة</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-2.5 focus:border-primary focus:outline-none"
            >
              <option value="خبير معتمد">خبير معتمد</option>
              <option value="مركز معتمد">مركز معتمد</option>
              <option value="برنامج معتمد">برنامج معتمد</option>
            </select>
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-bold text-primary">اسم الحاصل على الشهادة</label>
            <input
              type="text"
              value={holderName}
              onChange={(e) => setHolderName(e.target.value)}
              placeholder="أحمد محمد"
              className="w-full p-3 border border-gray-300 rounded-lg mb-2.5 focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block mb-2 font-bold text-primary">تاريخ الإصدار</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 font-bold text-primary">تاريخ الانتهاء (اختياري)</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-bold text-primary">الحالة</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-2.5 focus:border-primary focus:outline-none"
            >
              <option value="active">سارية</option>
              <option value="expired">منتهية الصلاحية</option>
              <option value="revoked">ملغاة</option>
            </select>
          </div>

          <div className="mb-5">
            <label className="block mb-2 font-bold text-primary">ملف الشهادة (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setPdfFile(e.target.files[0])}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <button
              className="bg-accent text-white border-none py-3 px-7.5 rounded-lg font-bold cursor-pointer text-base transition-colors duration-300 hover:bg-accent-dark"
              onClick={handleSubmit}
            >
              إضافة الشهادة
            </button>
            <Link
              to="/"
              className="inline-block py-2.5 px-5 bg-primary text-white no-underline rounded-lg font-bold text-center transition-colors duration-300 hover:bg-[#1a3d63] hover:text-white"
            >
              الرجوع للموقع
            </Link>
          </div>

          {result && (
            <div
              className={`mt-6 p-5 rounded-xl text-sm font-medium leading-relaxed ${
                result.success
                  ? "bg-[#d1fae5] border border-[#34d399] text-[#065f46]"
                  : "bg-[#fee2e2] border border-[#f87171] text-[#991b1b]"
              }`}
              style={{ display: "block", whiteSpace: "pre-wrap" }}
            >
              {JSON.stringify(result, null, 2)}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Add_certificate;