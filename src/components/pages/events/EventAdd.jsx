import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";
import Scroll from "../../common/Scroll.jsx";

// تنسيق تاريخ الفعالية (2026-02-22 -> فبراير 2026)
function formatEventDate(dateStr) {
  if (!dateStr) return "";
  const months = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
  ];
  const parts = dateStr.split("-");
  if (parts.length < 2) return dateStr;
  const year = parts[0];
  const month = parseInt(parts[1], 10);
  const monthName = months[month - 1] || parts[1];
  return `${monthName} ${year}`;
}

export default function EventAdd() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    // جلب الفعاليات من الـ API
    fetch("/api/events")
      .then((res) => {
        if (!res.ok) {
          throw new Error("فشل جلب الفعاليات");
        }
        return res.json();
      })
      .then((data) => {
        const items = Array.isArray(data)
          ? data
          : data.events || data.data || [];
        setEvents(items);
      })
      .catch((err) => {
        console.error(err);
        setEvents([]);
      });
  }, []);

  return (
    <>
      <Header />
      <div className="page-hero">
        <img src="assets/imge/0006.jpg" alt="hero-logo" loading="lazy" className="page-hero-bg" />
        <div className="logo-text">
          <p className="page-hero-title">فعاليات شارك فيها المعهد</p>
        </div>
      </div>
      <main className="page-content">

        <div className="flex flex-col items-center gap-10 p-5 mt-30">
          {events.map((event, idx) => (
            <article
              key={idx}
              className={`bg-white rounded-[15px] overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.1)] flex flex-col transition-transform duration-300 ease-in-out w-full max-w-212.5 hover:-translate-y-2.5`}
              data-aos="fade-up"
            >
              <div className="w-full h-150 overflow-hidden relative">
                {event.image_url || event.image ? (
                  <img src={event.image_url || event.image} alt={event.title} loading="lazy" className="w-full h-full object-cover block transition-transform duration-500 ease-in-out hover:scale-[1.1]" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#f0f0f0] text-[#999]">
                    لا توجد صورة
                  </div>
                )}
              </div>
              <div className="p-3.75">
                {event.event_date && (
                  <span className="text-[#e63946] text-[0.85rem] font-bold">
                    {formatEventDate(event.event_date)}
                  </span>
                )}
                <h3 className="my-[10px_0] text-[1.2rem] text-[#1d3557]">{event.title}</h3>
                {event.description && (
                  <div className="leading-[1.6] text-[#555] ql-editor"
                    dangerouslySetInnerHTML={{ __html: event.description }}
                  />
                )}
              </div>
            </article>
          ))}
        </div>
      </main>
      <Scroll />
      <Footer />
    </>
  );
}