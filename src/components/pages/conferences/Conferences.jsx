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
      <div className="relative w-full h-100 flex justify-center items-center overflow-hidden mt-21.25">
        <img src="assets/imge/0006.jpg" alt="hero-logo" loading="lazy" className="absolute inset-0 w-full h-full object-cover -z-10" />
        <div className="logo-text">
          <p className="text-accent text-[5rem] [text-shadow:2px_3px_9px_rgba(0,0,0,0.6)]">
            {currentConference ? currentConference.title : "مؤتمرات السلامة العربية"}
          </p>
        </div>
      </div>
      <main className="page-content">

        <div className="flex text-[25px] justify-center px-5 py-5 gap-1.25 font-bold border-t-[5px] border-accent bg-white mt-5">
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
        <div className="max-w-fit mx-auto my-[30px_auto_20px] flex justify-center items-center gap-2.5 bg-white px-5 py-2.5 rounded-[50px] shadow-[0_8px_25px_rgba(0,0,0,0.06)] border border-[#eee] flex-wrap">
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

        <div className="grid grid-cols-[repeat(auto-fit,270px)] gap-7 p-[40px_5%] justify-center justify-items-center max-w-350 mx-auto" style={{ minHeight: "300px" }}>
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