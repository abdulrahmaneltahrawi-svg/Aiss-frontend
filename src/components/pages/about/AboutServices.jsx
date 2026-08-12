import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";

export default function AboutServices() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <>
      <Header />
      <div className="page-hero">
        <img src="assets/imge/banar.jpg" alt="store-pic" loading="lazy" className="page-hero-bg" />
        <div className="logo-text">
          <p className="page-hero-title">خدمات المعهد العربي</p>
        </div>
      </div>
      <main className="page-content">

        <div className="section-title-bar">
          <p>الخدمات</p>
        </div>

        <div className="flex flex-col items-center gap-7.5 p-5 bg-[#f4f4f4]">
          <div className="w-full max-w-225 shadow-[0_4px_15px_rgba(0,0,0,0.1)] rounded-[10px] overflow-hidden" data-aos="fade-up">
            <img src="assets/Brief/بروفايل-١٢.jpg" alt="الخدمات" className="w-full h-auto block" />
          </div>

          <div className="w-full max-w-225 shadow-[0_4px_15px_rgba(0,0,0,0.1)] rounded-[10px] overflow-hidden" data-aos="fade-up">
            <img src="assets/Brief/بروفايل-١٤.jpg" alt="المؤتمارات" className="w-full h-auto block" />
          </div>

          <div className="w-full max-w-225 shadow-[0_4px_15px_rgba(0,0,0,0.1)] rounded-[10px] overflow-hidden" data-aos="fade-right">
            <img src="assets/Brief/بروفايل-١٥.jpg" alt="الدرجات العملية" className="w-full h-auto block" />
          </div>

          <div className="w-full max-w-225 shadow-[0_4px_15px_rgba(0,0,0,0.1)] rounded-[10px] overflow-hidden" data-aos="fade-left">
            <img src="assets/Brief/بروفايل-١٦.jpg" alt="خدمه" className="w-full h-auto block" />
          </div>

          <div className="w-full max-w-225 shadow-[0_4px_15px_rgba(0,0,0,0.1)] rounded-[10px] overflow-hidden" data-aos="zoom-in">
            <img src="assets/Brief/بروفايل-١٧.jpg" alt="دليل السلامة" className="w-full h-auto block" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}