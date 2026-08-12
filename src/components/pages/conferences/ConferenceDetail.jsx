import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";
import { Link, useParams } from "react-router-dom";

const CONFERENCES = {
  "1": {
    id: 1,
    title: "مؤتمر السلامة الأول (2020)",
    image: "assets/imge/0006.jpg",
    description: "انطلاق أول مؤتمر للسلامة العربية - النسخة الأولى من مؤتمر السلامة العربية الذي جمع الخبراء والمتخصصين في مجال السلامة."
  },
  "2": {
    id: 2,
    title: "مؤتمر السلامة الثاني (2021)",
    image: "assets/imge/0006.jpg",
    description: "النسخة الثانية من مؤتمر السلامة العربية - استمرار المسيرة في نشر الوعي وتعزيز ثقافة السلامة."
  },
  "3": {
    id: 3,
    title: "مؤتمر السلامة الثالث (2022)",
    image: "assets/imge/0006.jpg",
    description: "النسخة الثالثة من مؤتمر السلامة العربية - منصة لتبادل الخبرات والتجارب بين المتخصصين."
  },
  "4": {
    id: 4,
    title: "مؤتمر السلامة الرابع (2023)",
    image: "assets/imge/0006.jpg",
    description: "النسخة الرابعة من مؤتمر السلامة العربية - تعزيز التعاون في مجالات السلامة."
  },
  "5": {
    id: 5,
    title: "مؤتمر السلامة الخامس (2024)",
    image: "assets/imge/0006.jpg",
    description: "النسخة الخامسة من مؤتمر السلامة العربية - استمرار التميز في نشر علوم السلامة."
  }
};

const FALLBACK_IMG = "assets/icons/logo.webp";

export default function ConferenceDetail() {
  const [conference, setConference] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    const conf = CONFERENCES[id];
    if (conf) {
      setConference(conf);
    }
    setLoading(false);
  }, [id]);

  if (loading) return null;

  if (!conference) {
    return (
      <>
        <Header />
        <main className="page-content flex flex-col items-center justify-center" style={{ minHeight: "400px" }}>
          <h2>المؤتمر غير موجود</h2>
          <Link to="/conferences" className="btn1 inline-block mt-5">
            العودة لقائمة المؤتمرات
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="page-hero">
        <img src={conference.image} alt="hero-logo" loading="lazy" className="page-hero-bg" />
        <div className="logo-text">
          <p className="page-hero-title">{conference.title}</p>
        </div>
      </div>
      <main className="page-content">

        <div className="section-title-bar">
          <p>{conference.title}</p>
        </div>

        <div className="cards-grid gap-7" style={{ minHeight: "300px" }}>
          <div className="card1 max-w-100 mx-auto" data-aos="fade-up">
            <img
              src={conference.image}
              alt={conference.title}
              loading="lazy"
              className="w-full h-[50 object-cover rounded-t-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = FALLBACK_IMG;
              }}
            />
            <div className="p-4">
              <h3 className="text-primary text-lg font-bold">{conference.title}</h3>
              <p className="text-[14px] text-[#555] my-[10px_0] leading-[1.6]">
                {conference.description}
              </p>
              <div className="flex gap-2.5 mt-5">
                <Link to="/conferences" className="btn1 no-underline">
                  العودة للقائمة
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}