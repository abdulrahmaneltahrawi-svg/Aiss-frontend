import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";

export default function AboutManager() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <>
      <Header />
      <div className="page-hero">
        <img src="assets/imge/banar.jpg" alt="store-pic" loading="lazy" className="page-hero-bg" />
        <div className="logo-text">
          <p className="page-hero-title">كلمة الرئيس التنفيذي</p>
        </div>
      </div>
      <main className="page-content">

        <div className="section-title-bar">
          <p>الرئيس التنفيذي</p>
        </div>

        <div className="flex flex-col items-center gap-7.5 p-5 bg-[#f4f4f4]">
          <div className="w-full max-w-225 shadow-[0_4px_15px_rgba(0,0,0,0.1)] rounded-[10px] overflow-hidden" data-aos="fade-right">
            <img src="assets/Brief/بروفايل-0٦.jpg" alt="كلمة الرئيس" className="w-full h-auto block" />
          </div>

          <div className="w-full max-w-225 shadow-[0_4px_15px_rgba(0,0,0,0.1)] rounded-[10px] overflow-hidden" data-aos="fade-left">
            <img src="assets/Brief/بروفايل-0٧.jpg" alt="تكملة" className="w-full h-auto block" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}