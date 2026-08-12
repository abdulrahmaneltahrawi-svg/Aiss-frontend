import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";
import Scroll from "../../common/Scroll.jsx";
import Card from "../../common/Card.jsx";
import events from "./eventsData.js";

const FALLBACK_IMG = "assets/icons/logo.webp";

// فقط 4 مسابقات - كل مسابقة تشير إلى id الفعالية في eventsData
const COMPETITIONS = [
  {
    id: 1,
    title: "مسابقة السلامة العربية - الدورة الأولى",
    image: "assets/events/photo/event (1).webp",
    eventId: 3
  },
  {
    id: 2,
    title: "مسابقة السلامة العربية - الدورة الثانية",
    image: "assets/events/photo/event (2).webp",
    eventId: 4
  },
  {
    id: 3,
    title: "مسابقة السلامة العربية - الدورة الثالثة",
    image: "assets/events/photo/event (3).webp",
    eventId: 7
  },
  {
    id: 4,
    title: "مسابقة السلامة العربية - الدورة الرابعة",
    image: "assets/events/photo/event (4).webp",
    eventId: 9
  }
];

export default function Events() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <>
      <Header />
      <main className="page-content">
        {/* Hero Section */}
        <div className="page-hero">
          <img src="assets/imge/0006.jpg" alt="hero-logo" loading="lazy" className="page-hero-bg" />
          <div className="logo-text">
            <p className="page-hero-title">مسابقات السلامة العربية</p>
          </div>
        </div>

        {/* Section Title */}
        <div className="section-title-bar">
          <p>مسابقات السلامة العربية</p>
        </div>

        {/* Competition Section */}
        <section id="arabic-competition-section" className="competition-section active">
          <div className="text-center bg-white text-accent p-[20px_40px] rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] mb-7.5 border-t-[5px] border-accent max-w-225 mx-auto mt-12.5" data-aos="fade-down">
            <h1 className="comp-main-title text-[2.2rem] mb-5">مسابقة السلامة العربية</h1>
            <p className="text-[1.15rem] leading-[1.8] text-[#636e72] max-w-225 mx-auto">
              تُعد مسابقة السلامة العربية، التي ينظمها المعهد العربي لعلوم
              السلامة، إحدى أبرز المبادرات العلمية العربية المتخصصة في مجال
              علوم السلامة والصحة المهنية، حيث تُقام للعام الخامس على التوالي
              على مستوى الوطن العربي، استمرارًا لرسالة المعهد في دعم البحث
              العلمي وتعزيز ثقافة السلامة والابتكار.
            </p>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-7.5 max-w-300 mx-auto p-5">
            <div className="bg-white p-3.75 rounded-[15px] border transition-all duration-300 ease-in-out border-b-[5px] border-black hover:-translate-y-2.5 hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)]" data-aos="fade-right" data-aos-delay="200">
              <div className="card-icon">
                <img src="assets/icons/goal (2).png" alt="goals" className="text-[40px] mb-3.75 w-10 h-10" />
              </div>
              <h3 className="text-[1.5rem] mb-3.75 text-accent">أهداف المسابقة</h3>
              <p className="text-[1rem] leading-[1.7] text-justify">
                تهدف المسابقة إلى توفير منصة علمية تجمع الباحثين والمبتكرين
                والمهتمين بعلوم السلامة من مختلف الدول العربية، لعرض أبحاثهم
                وأفكارهم ومشروعاتهم المتميزة، بما يسهم في تطوير حلول مبتكرة
                وممارسات فعّالة تعزز مستويات السلامة في بيئات العمل والمجتمع.
              </p>
            </div>

            <div className="bg-white p-3.75 rounded-[15px] border transition-all duration-300 ease-in-out border-b-[5px] border-black hover:-translate-y-2.5 hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)]" data-aos="fade-left" data-aos-delay="400">
              <div className="card-icon">
                <img src="assets/icons/medal (1).png" alt="reword" className="text-[40px] mb-3.75 w-10 h-10" />
              </div>
              <h3 className="text-[1.5rem] mb-3.75 text-primary">جوائز قيمة وتقدير</h3>
              <p className="text-[1rem] leading-[1.7] text-justify">
                وتمنح المسابقة جوائز قيمة، تقديرًا للأبحاث والابتكارات
                المتميزة التي تقدم قيمة علمية وعملية حقيقية في مجالات علوم
                السلامة المختلفة.
              </p>
            </div>
          </div>

          {/* دورات المسابقة - 4 كروت فقط */}
          <div className="section-title-bar mt-10">
            <p>دورات مسابقة السلامة العربية</p>
          </div>
          <div className="cards-grid">
            {COMPETITIONS.map((item) => (
              <Card
                key={item.id}
                id={item.id}
                title={item.title}
                image={item.image}
                fallbackImage={FALLBACK_IMG}
                href={`/views?id=${item.eventId}&source=events`}
                btnText="عرض التفاصيل"
              />
            ))}
          </div>
        </section>
      </main>
      <Scroll />
      <Footer />
    </>
  );
}