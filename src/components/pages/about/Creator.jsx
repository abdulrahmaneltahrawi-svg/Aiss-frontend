import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";

export default function Creator() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    // عرض الـ CV في أسفل الصفحة عند الضغط على الزر
    document.querySelectorAll(".cv-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const pdfUrl = this.getAttribute("data-pdf");
        const personName = this.getAttribute("data-name");
        const cvViewer = document.getElementById("cvViewer");
        const cvFrame = document.getElementById("cvFrame");
        const cvName = document.getElementById("cvName");

        if (cvViewer && cvFrame && cvName) {
          cvFrame.src = pdfUrl;
          cvName.textContent = personName;
          cvViewer.style.display = "block";
          // التمرير للأسفل بسلاسة
          cvViewer.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }, []);

  return (
    <>
      <Header />
      <div className="page-hero">
        <img src="assets/imge/banar.jpg" alt="store-pic" loading="lazy" className="page-hero-bg" />
        <div className="logo-text">
          <p className="page-hero-title">المجلس التأسيسي</p>
        </div>
      </div>
      <main className="page-content">

        <div className="section-title-bar">
          <p>اللجنة التأسيسية</p>
        </div>

        <div className="flex flex-col items-center gap-7.5 p-5">
          {/* القائد الرئيسي */}
          <div className="flex justify-center gap-20 w-full">
            <div className="relative text-center bg-white p-6.25 rounded-[20px] shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-all duration-[0.4s] ease-[cubic-bezier(0.165,0.84,0.44,1)] overflow-hidden  hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]" data-aos="fade-down">
              <img
                src="assets/creator/WhatsApp Image 2026-04-30 at 5.29.46 PM (2).jpeg"
                alt="رئيس المعهد"
                className="w-45 h-45 rounded-full object-cover mb-5 transition-transform duration-[0.4s] ease-in-out hover:scale-[1.05]"
              />
              <div className="">
                <h3 className="my-3.75 text-[1.4rem] font-bold text-[#333]">
                  رئيس المعهد:<br />
                  د/ عمار مغربي
                </h3>
                <button
                  data-pdf="assets/creator/Dr Ammar's CV _ -2022.pdf"
                  data-name="د/ عمار مغربي"
                  className="cv-btn inline-flex items-center gap-2 bg-accent text-white px-6 py-2.5 rounded-full font-bold text-sm no-underline transition-all duration-300 hover:bg-[#ce2634] hover:shadow-lg hover:shadow-[rgba(228,42,58,0.3)] hover:-translate-y-0.5 cursor-pointer border-none"
                >
                  📄 عرض السيرة الذاتية
                </button>
              </div>
            </div>
          </div>

          {/* الصف الثاني */}
          <div className="flex justify-center gap-20 w-full">
            <div className="relative text-center bg-white p-6.25 rounded-[20px] shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-all duration-[0.4s] ease-[cubic-bezier(0.165,0.84,0.44,1)] overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]" data-aos="fade-right" data-aos-delay="200">
              <img
                src="assets/creator/WhatsApp Image 2026-04-30 at 5.29.44 PM.jpeg"
                alt="الرئيس التنفيذي"
                className="w-45 h-45 rounded-full object-cover mb-5 transition-transform duration-[0.4s] ease-in-out hover:scale-[1.05]"
              />
              <div className="">
                <h3 className="my-3.75 text-[1.4rem] font-bold text-[#333]">
                  الرئيس التنفيذي:<br />
                  د/ محمد كمال
                </h3>
                <button
                  data-pdf="assets/creator/M. Kamal CV 1-10-2014.pdf"
                  data-name="د/ محمد كمال"
                  className="cv-btn inline-flex items-center gap-2 bg-accent text-white px-6 py-2.5 rounded-full font-bold text-sm no-underline transition-all duration-300 hover:bg-[#ce2634] hover:shadow-lg hover:shadow-[rgba(228,42,58,0.3)] hover:-translate-y-0.5 cursor-pointer border-none"
                >
                  📄 عرض السيرة الذاتية
                </button>
              </div>
            </div>

            <div className="relative text-center bg-white p-6.25 rounded-[20px] shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-all duration-[0.4s] ease-[cubic-bezier(0.165,0.84,0.44,1)] overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]" data-aos="fade-left" data-aos-delay="400">
              <img
                src="src/assets/assets/creator/download (1).png"
                alt="نائب الرئيس"
                className="w-45 h-45 rounded-full object-cover mb-5 transition-transform duration-[0.4s] ease-in-out hover:scale-[1.05]"
              />
              <div className="">
                <h3 className="my-3.75 text-[1.4rem] font-bold text-[#333]">
                  نائب الرئيس:<br />
                  د/ مصطفى الخضري
                </h3>
                <button
                  data-pdf="assets/creator/1-دبى مصطفى .pdf"
                  data-name="د/ مصطفى الخضري"
                  className="cv-btn inline-flex items-center gap-2 bg-accent text-white px-6 py-2.5 rounded-full font-bold text-sm no-underline transition-all duration-300 hover:bg-[#ce2634] hover:shadow-lg hover:shadow-[rgba(228,42,58,0.3)] hover:-translate-y-0.5 cursor-pointer border-none"
                >
                  📄 عرض السيرة الذاتية
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* عرض الـ CV في أسفل الصفحة */}
        <div
          id="cvViewer"
          className="hidden w-full max-w-200 mx-auto my-10 bg-white p-6 rounded-[20px] shadow-[0_10px_25px_rgba(0,0,0,0.1)]"
        >
          <div className="flex items-center justify-between mb-5 pb-4 border-b-2 border-[#f1f5f9]">
            <h2 className="text-primary text-xl font-bold">
              السيرة الذاتية: <span id="cvName" className="text-accent"></span>
            </h2>
            <button
              onClick={() => {
                document.getElementById("cvViewer").style.display = "none";
                document.getElementById("cvFrame").src = "";
              }}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-[#fee2e2] text-[#991b1b] text-lg font-bold border-none cursor-pointer transition-all duration-300 hover:bg-[#fecaca]"
              title="إغلاق"
            >
              ✕
            </button>
          </div>
          <iframe
            id="cvFrame"
            src=""
            width="100%"
            height="700px"
            style={{ border: "none", borderRadius: "10px" }}
            title="CV Viewer"
          ></iframe>
        </div>
      </main>
      <Footer />
    </>
  );
}
