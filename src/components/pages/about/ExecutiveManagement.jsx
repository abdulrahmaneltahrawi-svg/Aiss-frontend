import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";

export default function ExecutiveManagement() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <>
      <Header />
      <div className="relative w-full h-100 flex justify-center items-center overflow-hidden mt-21.25">
        <img src="assets/imge/banar.jpg" alt="store-pic" loading="lazy" className="absolute inset-0 w-full h-full object-cover -z-10" />
        <div className="logo-text">
          <p className="text-accent text-[5rem] [text-shadow:2px_3px_9px_rgba(0,0,0,0.6)]">الإدارة التنفيذية</p>
        </div>
      </div>
      <main className="page-content">

        <div className="flex text-[25px] justify-center px-5 py-5 gap-1.25 font-bold border-t-[5px] border-accent bg-white mt-5">
          <p>الإدارة التنفيذية</p>
        </div>

        <div className="text-center p-[80px_20px] text-[1.5rem] text-accent font-bold">
          <p>سيتم تحديث الصفحة قريباً</p>
        </div>
      </main>
      <Footer />
    </>
  );
}