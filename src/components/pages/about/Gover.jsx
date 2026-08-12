import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";

export default function Gover() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <>
      <Header />
      <div className="page-hero">
        <img src="assets/imge/banar.jpg" alt="store-pic" loading="lazy" className="page-hero-bg" />
        <div className="logo-text">
          <p className="page-hero-title">الحوكمة المؤسسية</p>
        </div>
      </div>
      <main className="page-content">

        <div className="flex flex-col items-center gap-7.5rem p-5 bg-white">
          <div className="section-title-bar w-full">
            <p>اللجنة التأسيسية</p>
          </div>

          <div className="w-full max-w-125 shadow-[0_4px_15px_rgba(0,0,0,0.1)] rounded-[10px] overflow-hidden" data-aos="fade-right">
            <img src="assets/gover/هيكل-1.jpg" alt="التأسيس" className="w-full h-auto block" />
          </div>

          <div className="section-title-bar w-full">
            <p>الإدارة التنفيذية و العلمية</p>
          </div>

          <div className="flex items-center justify-between gap-12.5">
            <div className="w-full max-w-125 shadow-[0_4px_15px_rgba(0,0,0,0.1)] rounded-[10px] overflow-hidden" data-aos="fade-left">
              <img src="assets/gover/هيكل-23.jpg" alt="الادارة" className="w-full h-auto block" />
            </div>

            <div className="w-full max-w-125 shadow-[0_4px_15px_rgba(0,0,0,0.1)] rounded-[10px] overflow-hidden" data-aos="zoom-in">
              <img src="assets/gover/هيكل 4.jpeg" alt="العملية" className="w-full h-auto block" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}