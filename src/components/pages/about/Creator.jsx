import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";

export default function Creator() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    // Modal functionality
    const modal = document.getElementById("cvModal");
    const modalBody = document.getElementById("modalBody");
    const closeBtn = document.querySelector(".close-btn");

    if (modal && modalBody && closeBtn) {
      document.querySelectorAll(".cv-btn").forEach((btn) => {
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          const pdfUrl = this.getAttribute("href");
          const card = this.closest(".card");
          const personName = card ? card.querySelector("h3").innerText : "";
          modalBody.innerHTML = `
            <h3 style="margin-bottom:15px; color:#007bff;">${personName}</h3>
            <iframe src="${pdfUrl}" width="100%" height="600px" style="border:none; border-radius:10px;"></iframe>
          `;
          modal.style.display = "block";
        });
      });

      closeBtn.onclick = () => {
        if (modal) {
          modal.style.display = "none";
        }
        modalBody.innerHTML = "";
      };

      window.onclick = (event) => {
        if (event.target == modal) {
          modal.style.display = "none";
          modalBody.innerHTML = "";
        }
      };
    }
  }, []);

  return (
    <>
      <Header />
      <div className="relative w-full h-100 flex justify-center items-center overflow-hidden mt-21.25">
        <img src="assets/imge/banar.jpg" alt="store-pic" loading="lazy" className="absolute inset-0 w-full h-full object-cover -z-10" />
        <div className="logo-text">
          <p className="text-accent text-[5rem] [text-shadow:2px_3px_9px_rgba(0,0,0,0.6)]">المجلس التأسيسي</p>
        </div>
      </div>
      <main className="page-content">

        <div className="flex text-[25px] justify-center px-5 py-5 gap-1.25 font-bold border-t-[5px] border-accent bg-white mt-5">
          <p>اللجنة التأسيسية</p>
        </div>

        <div className="flex flex-col items-center gap-7.5 p-5">
          {/* القائد الرئيسي */}
          <div className="flex justify-center gap-20 w-full">
            <div className="relative text-center bg-white p-6.25 rounded-[20px] shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-all duration-[0.4s] ease-[cubic-bezier(0.165,0.84,0.44,1)] overflow-hidden hover:-translate-y-3.75 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]" data-aos="fade-down">
              <img
                src="assets/creator/WhatsApp Image 2026-04-30 at 5.29.46 PM (2).jpeg"
                alt="رئيس المعهد"
                className="w-45 h-45 rounded-full object-cover mb-5 transition-transform duration-[0.4s] ease-in-out hover:scale-[1.05]"
              />
              <div className="">
                <h3 className="my-3.75text-[1.4rem] font-bold text-[#333]">
                  رئيس المعهد:<br />
                  د/ عمار مغربي
                </h3>
                <a
                  href="assets/creator/Dr Ammar's CV _ -2022.pdf"
                  className="cv-btn"
                >
                  +
                </a>
              </div>
            </div>
          </div>

          {/* الصف الثاني */}
          <div className="flex justify-center gap-20 w-full">
            <div className="relative text-center bg-white p-6.25 rounded-[20px] shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-all duration-[0.4s] ease-[cubic-bezier(0.165,0.84,0.44,1)] overflow-hidden hover:-translate-y-3.75 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]" data-aos="fade-right" data-aos-delay="200">
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
                <a
                  href="assets/creator/M. Kamal CV 1-10-2014.pdf"
                  className="cv-btn"
                >
                  +
                </a>
              </div>
            </div>

            <div className="relative text-center bg-white p-6.25 rounded-[20px] shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-all duration-[0.4s] ease-[cubic-bezier(0.165,0.84,0.44,1)] overflow-hidden hover:-translate-y-3.75 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]" data-aos="fade-left" data-aos-delay="400">
              <img
                src="assets/creator/WhatsApp Image 2026-04-30 at 5.29.45 PM.jpeg"
                alt="نائب الرئيس"
                className="w-45 h-45 rounded-full object-cover mb-5 transition-transform duration-[0.4s] ease-in-out hover:scale-[1.05]"
              />
              <div className="">
                <h3 className="my-3.75 text-[1.4rem] font-bold text-[#333]">
                  نائب الرئيس:<br />
                  د/ مصطفى الخضري
                </h3>
                <a
                  href="assets/creator/1-دبى مصطفى .pdf"
                  className="cv-btn"
                >
                  +
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Modal for CV */}
        <div id="cvModal" className="modal">
          <div className="bg-white my-[10%] mx-auto p-7.5 rounded-[20px] w-1/2 max-w-175 relative shadow-[0_5px_30px_rgba(0,0,0,0.3)] animate-[slideUp_0.4s_ease]">
            <span className="close-btn absolute top-6.25 left-6.25 right-auto text-[30px] font-bold cursor-pointer text-[#888] transition-[0.3s] leading-none z-1001 hover:text-[#ff0000] hover:scale-[1.1]">&times;</span>
            <div id="cvDetails">
              <h2 className="text-center mb-5">السيرة الذاتية</h2>
              <hr className="mb-5" />
              <div id="modalBody"></div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}