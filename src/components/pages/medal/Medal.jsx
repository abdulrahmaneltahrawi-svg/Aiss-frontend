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
      <div className="page-hero">
        <img src="assets/imge/0006.jpg" alt="medal-pic" loading="lazy" className="page-hero-bg" />
        <div className="logo-text">
          <p className="page-hero-title">وسام السلامة العربي</p>
        </div>
      </div>
      <main className="page-content">

        <div className="section-title-bar">
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