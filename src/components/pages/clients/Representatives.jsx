import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";
import Scroll from "../../common/Scroll.jsx";


const countries = [
  { name: "مصر", top: "41%", left: "61%" },
  { name: "الأردن", top: "26%", left: "72%" },
  { name: "فلسطين", top: "22%", left: "68%" },
  { name: "المغرب", top: "22%", left: "13%" },
  { name: "تونس", top: "11%", left: "34%" },
  { name: "لبنان", top: "13%", left: "70%" },
  { name: "سوريا", top: "8%", left: "74%" },
  { name: "اليمن", top: "84%", left: "86%" },
  { name: "عمان", top: "70%", left: "97%" },
  { name: "البحرين", top: "45%", left: "90%" },
];

export default function Actors() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedActor, setSelectedActor] = useState(null);
  const [actorsData, setActorsData] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    // جلب الممثلين من الـ API
    fetch("/api/actors")
      .then((res) => {
        if (!res.ok) {
          throw new Error("فشل جلب الممثلين");
        }
        return res.json();
      })
      .then((data) => {
        const items = Array.isArray(data)
          ? data
          : data.actors || data.data || [];
        setActorsData(items);
      })
      .catch((err) => {
        console.error(err);
        setActorsData([]);
      });
  }, []);

  // الممثلون الظاهرون حالياً
  const visibleActors = selectedActor
    ? actorsData.filter((a) => a.name === selectedActor)
    : selectedCountry
      ? actorsData.filter((a) => a.country === selectedCountry)
      : actorsData;

  const countryActors = selectedCountry
    ? actorsData.filter((a) => a.country === selectedCountry)
    : [];

  function handleCountryClick(country) {
    setSelectedCountry(country);
    setSelectedActor(null);
  }

  function handleActorClick(actorName) {
    setSelectedActor(actorName);
    setSelectedCountry(null);
  }

  function showAll() {
    setSelectedCountry(null);
    setSelectedActor(null);
  }

  return (
    <>
      <Header />
      <div className="page-hero">
        <img src="assets/imge/0005.jpg" alt="store-pic" loading="lazy" className="page-hero-bg" />
        <div className="logo-text">
          <p className="page-hero-title">الممثلين</p>
        </div>
      </div>
      <main className="page-content">

        <div className="relative max-w-300 my-5 mx-auto border border-[#ddd] overflow-hidden">
          <img
            src="assets/Actors/map.png"
            alt="map"
            loading="lazy"
            className="w-full h-auto block shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
          />
          {countries.map((c) => (
            <span
              key={c.name}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-15 h-auto transition-transform duration-200 hover:scale-[1.2] cursor-pointer z-10"
              style={{ top: c.top, left: c.left }}
              onClick={() => handleCountryClick(c.name)}
            >
              <img src="assets/icons/placeholder.png" alt={c.name} className="w-full h-auto block" />
            </span>
          ))}
        </div>

        <div className="text-center">
          <button className="block my-5 mx-auto px-6.25 py-2.5 bg-primary text-white border-none rounded-[5px] cursor-pointer font-[Tajawal,sans-serif] text-[16px]" onClick={showAll}>
            إظهار كافة الممثلين
          </button>
        </div>

        {/* نافذة منبثقة عند اختيار دولة من الخريطة */}
        {selectedCountry && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-1000 p-4" onClick={() => setSelectedCountry(null)}>
            <div
              className="bg-white w-full max-w-85 max-h-[80vh] overflow-y-auto p-3.75 rounded-[15px] border border-[#ddd] text-center shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="mb-3 font-bold">الممثلين في {selectedCountry}</h2>
              {countryActors.map((actor) => (
                <div
                  key={actor.name}
                  className="block p-3 m-2 bg-[rgba(41,128,185,0.1)] rounded-[10px] text-[#2c3e50] font-medium cursor-pointer hover:bg-[#2980b9] hover:text-white hover:scale-[1.05] transition-all duration-300"
                  onClick={() => handleActorClick(actor.name)}
                >
                  {actor.name}
                </div>
              ))}
              <div className="mt-3.75 cursor-pointer text-[#e74c3c] font-bold text-[13px] underline" onClick={() => setSelectedCountry(null)}>
                إغلاق
              </div>
            </div>
          </div>
        )}

        {/* شبكة الكروت - 3 في كل صف */}
        <div className="max-w-300 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center mt-10 mb-7.5 px-5">
          {visibleActors.map((actor, idx) => (
            <div
              key={idx}
              className="card w-full max-w-95 bg-white rounded-xl border border-[#e0e0e0] overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-1.25 hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] flex flex-col"
              data-country={actor.country}
            >
              <div className="h-75 bg-white flex items-center justify-center p-3.75 border-b border-[#eee]">
                <img src={actor.image_url || actor.image} alt={actor.name} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div className="p-5 grow text-right">
                <span className="bg-[#e1f5fe] text-primary px-2.5 py-1 rounded-[20px] text-[12px] font-bold inline-block text-center mb-2.5">{actor.country}</span>
                <h3 className="m-0 mb-2.5 text-[18px] text-[#2c3e50] leading-[1.4] text-right">{actor.name}</h3>
                <p className="m-0 text-[14px] leading-[1.6] text-[#666] text-right">{actor.description}</p>
                <div className="mt-2.5 text-right">
                  <span className="text-[12px] font-bold text-[#888] block text-right">البريد الإلكتروني:</span>
                  <a href={`mailto:${actor.email}`} className="block text-[#2980b9] text-[13px] no-underline text-right break-all">
                    {actor.email}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div> 
      </main>
      <Scroll />
      <Footer />
    </>
  );
}
