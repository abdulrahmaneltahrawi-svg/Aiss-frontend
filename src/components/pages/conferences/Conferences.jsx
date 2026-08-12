import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";
import Card from "../../common/Card.jsx";
import events from "../events/eventsData.js";

const FALLBACK_IMG = "assets/icons/logo.webp";

// دالة لاستخراج رقم المؤتمر من العنوان
function getConferenceNumber(title = "") {
  const match = title.match(/(الأول|الثاني|الثالث|الرابع|الخامس|السادس|السابع|الثامن|التاسع|العاشر)/);
  const arabicNumbers = {
    "الأول": 1,
    "الثاني": 2,
    "الثالث": 3,
    "الرابع": 4,
    "الخامس": 5,
    "السادس": 6,
    "السابع": 7,
    "الثامن": 8,
    "التاسع": 9,
    "العاشر": 10,
  };
  return match ? arabicNumbers[match[1]] : null;
}

export default function Conferences() {
  const [conferences, setConferences] = useState([]);
  const [searchParams] = useSearchParams();
  const confParam = searchParams.get("conf");

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    const confs = events.filter((ev) => ev.category === "مؤتمرات");
    // ترتيب تصاعدي (الأول أولاً)
    confs.sort((a, b) => a.id - b.id);
    setConferences(confs);
  }, []);

  // تطبيق الفلتر حسب رقم المؤتمر المحدد في الرابط
  const filteredConferences = confParam
    ? conferences.filter((item) => String(getConferenceNumber(item.title)) === String(confParam))
    : conferences;

  const currentConference = confParam
    ? conferences.find((item) => String(getConferenceNumber(item.title)) === String(confParam))
    : null;

  return (
    <>
      <Header />
      <div className="page-hero">
        <img src="assets/imge/0006.jpg" alt="hero-logo" loading="lazy" className="page-hero-bg" />
        <div className="logo-text">
          <p className="page-hero-title">
            {currentConference ? currentConference.title : "مؤتمرات السلامة العربية"}
          </p>
        </div>
      </div>
      <main className="page-content">

        <div className="section-title-bar">
          <p>
            {currentConference ? (
              <span>
                <span className="text-accent">{currentConference.title}</span>
              </span>
            ) : (
              "مؤتمرات السلامة العربية"
            )}
          </p>
        </div>

        {/* شريط تنقل بين المؤتمرات */}
        <div className="filter-bar flex-wrap">
          <Link
            to="/conference"
            className={`px-3 py-1.25 text-[13px] no-underline rounded-[30px] border font-bold transition-all duration-300 ${
              !confParam
                ? "bg-accent text-white border-accent"
                : "bg-white text-accent border-black hover:bg-[#ecebeb]"
            }`}
          >
            جميع المؤتمرات
          </Link>
          {conferences.map((conf) => {
            const num = getConferenceNumber(conf.title);
            if (!num) return null;
            return (
              <Link
                key={conf.id}
                to={`/conference?conf=${num}`}
                className={`px-3 py-1.25 text-[13px] no-underline rounded-[30px] border font-bold transition-all duration-300 ${
                  String(num) === String(confParam)
                    ? "bg-accent text-white border-accent"
                    : "bg-white text-accent border-black hover:bg-[#ecebeb]"
                }`}
              >
                المؤتمر {["الأول", "الثاني", "الثالث", "الرابع", "الخامس"][num - 1] || num}
              </Link>
            );
          })}
        </div>

        <div className="cards-grid gap-7" style={{ minHeight: "300px" }}>
          {filteredConferences.length === 0 ? (
            <p className="text-center w-full p-12">
              جاري تحميل المؤتمرات...
            </p>
          ) : (
            filteredConferences.map((item, idx) => (
              <Card
                key={item.id ?? idx}
                id={item.id ?? idx}
                title={item.title}
                image={item.image}
                fallbackImage={FALLBACK_IMG}
                href={`/views?id=${item.id}&source=events`}
                btnText="عرض التفاصيل"
              />
            ))
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}