import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";

export default function Medal() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <>
      <Header />
      <div className="relative w-full h-[400px] flex justify-center items-center overflow-hidden mt-[85px]">
        <img src="assets/imge/0006.jpg" alt="medal-pic" loading="lazy" className="absolute inset-0 w-full h-full object-cover -z-10" />
        <div className="logo-text">
          <p className="text-accent text-[5rem] [text-shadow:2px_3px_9px_rgba(0,0,0,0.6)]">وسام السلامة العربي</p>
        </div>
      </div>
      <main className="page-content">

        <div className="flex text-[25px] justify-center px-5 py-5 gap-[5px] font-bold border-t-[5px] border-accent bg-white mt-5">
          <p>وسام السلامة العربي</p>
        </div>

        <div className="text-center p-[80px_20px] text-[1.5rem] text-accent font-bold">
          <p>سيتم تحديث الصفحة قريباً</p>
        </div>
      </main>
      <Footer />
    </>
  );
}