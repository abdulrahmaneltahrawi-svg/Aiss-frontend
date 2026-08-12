import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";
import Scroll from "../../common/Scroll.jsx";

const actorsData = [
  { img: "assets/Actors/Picture1.jpg", country: "الأردن", name: "د. م سامي عمارنة (كبير ممثلي المعهد)", desc: "خبير ومستشار معتمد لأنظمة إدارة الجودة والسلامة والبيئة / خبير في سلامة العمليات", extra: "مدرب دولي TapRoot معتمد", email: "sami.amarneh@aiss.co" },
  { img: "assets/Actors/Picture2.jpg", country: "الأردن", name: "م. تمارا الخضور", desc: "عضو الادارة التنفيذية و مسؤولة البحث والتطوير بالمعهد العربي لعلوم السلامة ومديرة السلامة والصحة والبيئة في شركة العقبة لادارة وتشغيل الموانئ", email: "tamara.alkhdour@aiss.co" },
  { img: "assets/Actors/Picture3.jpg", country: "الأردن", name: "د. مها الشيخ", desc: "استاذ مساعد في إدارة سلسلة الإمداد - جامعة الشرق مستشارة معتمدة في إدارة سلسلة الإمداد في الولايات المتحدة", email: "maha.sheikh@aiss.co" },
  { img: "assets/Actors/Picture4.jpg", country: "تونس", name: "م. الحسين البكوش (كبير ممثلي المعهد)", desc: "خبير دولي في السلامة والصحة المهنية مكون للمكونين مع منظمة العمل الدولية", email: "houcine.bacouch@aiss.co" },
  { img: "assets/Actors/Picture5.jpg", country: "تونس", name: "د. عبير العيّادي", desc: "دكتورة في الطب، مختصّة في طب الشغل والأمراض المهنية مساعدة استشفائية جامعية بكلية الطب بتونس", email: "Abeer.Al.Ayadi@aiss.co" },
  { img: "assets/Actors/Picture6.jpg", country: "فلسطين", name: "أ. مالك سلهب (كبير ممثلي المعهد)", desc: "استاذ السلامة والصحة المهنية في جامعة بوليتكنك فلسطين حاصل على ماجستير في السلامة والصحة المهنية وإدارة البيئة – بريطانيا", email: "m.salhab@aiss.co" },
  { img: "assets/Actors/Picture7.jpg", country: "فلسطين", name: "م. سامر المصرى", desc: "ماجستير إدارة هندسية ... استشاري ومدرب معتمد في السلامة العامة والصحة المهنية والبيئة", email: "samer.almasri@aiss.co" },
  { img: "assets/Actors/Picture8.jpg", country: "فلسطين", name: "أ. هبة ماهر عجلوني", desc: "أ. علوم البيئة والسلامة والصحة المهنية", email: "heba.maher.abu.alfilat@aiss.co" },
  { img: "assets/Actors/Picture9.jpg", country: "مصر", name: "م. محمد شتلة (كبير ممثلي المعهد)", desc: "خبير و استشاري السلامة و الصحة المهنية ومدير التدريب بمشروع منتجع رأس الحكمة للمبيعات . بشركة أوراسكوم للإنشاءات", email: "mohamed.shetla@aiss.co" },
  { img: "assets/Actors/Picture10.jpg", country: "مصر", name: "د. سماح عبد الرحمن", desc: "مدير إدارة السلامة والصحة المهنية لمستشفيات الأمانة العامة للصحة النفسية", email: "tamara.alkhdour@aiss.co" },
  { img: "assets/Actors/Picture11.jpg", country: "مصر", name: "م. خلود خالد", desc: "مهندسة سلامة وصحة مهنية وحماية البيئة", email: "kholoud.khaled@aiss.co" },
  { img: "assets/Actors/Picture12.jpg", country: "مصر", name: "م. كريم أسامة", desc: "مهندس سلامة وصحة مهنية", email: "karim.osama@aiss.co" },
  { img: "assets/Actors/Picture13.jpg", country: "لبنان", name: "د. حوراء حاموش (كبير ممثلي المعهد)", desc: "أخصائية جلد وتجميل، حاصلة البورد الأوروبي في التغذية العلاجية وسلامة الغذاء، ماجستير في إدارة الأعمال الدولية ومدربة دولية", email: "hawraa.hamouche@aiss.co" },
  { img: "assets/Actors/Picture14.jpg", country: "لبنان", name: "د. هبة دهيني", desc: "أخصائية تغذية علاجية ومدرّسة جامعية حائزة على الدراسات العليا بخبرة تفوق ال ٨ سنوات", email: "Heba.Yassin.Duhaini@aiss.co" },
  { img: "assets/Actors/Picture15.jpg", country: "لبنان", name: "د. نور الهدي دهيني", desc: "اختصاصية تغذية علاجية، حائزة على شهادة ماجستير في ادارة الاعمال وخبرة اكثر من ١٠ سنوات في مجال التغذية السريرية والتسويق", email: "noor.duhaini@aiss.co" },
  { img: "assets/Actors/Picture16.jpg", country: "اليمن", name: "مستشار شهاب الصهباني", desc: "باحث و مدرب و استشاري البناء المؤسسي، الصحة و السلامة المهنية، الإدارة الصحية و مكافحة العدوى", email: "shehab.sahbani@aiss.co" },
  { img: "assets/Actors/Picture17.jpg", country: "سوريا", name: "م. إسراء حمدان", desc: "مدقق رئيس معتمد لأنظمة الجودة والصحة والسلامة المهنية والبيئة و عضو لجنة استشارية بمنظمة (الأونروا) و مؤسس شركة EMBS", email: "esraa.hamdan@aiss.co" },
  { img: "assets/Actors/Picture18.jpg", country: "سوريا", name: "د. محمد إياد الزعيم", desc: "استشاري بناء قدرات وحوكمة المنظمات", email: "Iyad.AlZaeem@aiss.co" },
  { img: "assets/Actors/Picture19.jpg", country: "المغرب", name: "الاستشاري رشيد كروح", desc: "مدرب و استشاري في مجال السلامة والصحة المهنية استشاري في مجال ريادة الأعمال", email: "Rashid.Karouh@aiss.co" },
  { img: "assets/Actors/Picture20.jpg", country: "السعودية", name: "م. هاني إبراهيم العليوي", desc: "الرئيس التنفيذي للجمعية السعودية للسلامة والاطفاء. خبير في السلامة والأمن والحريق.", email: "hani@aiss.co" },
  { img: "assets/Actors/Picture21.jpg", country: "البحرين", name: "م. آدم البربري", desc: "خبير السلامة والصحة المهنية - مملكة البحرين", email: "adam.barbari@aiss.co" },
  { img: "assets/Actors/Picture22.jpg", country: "عمان", name: "م. يوسف السيابي", desc: "رئيس قسم السلامة والصحة المهنية والبيئة بجامعة الشرقية- سلطنة عمان", email: "yusef.siabi@aiss.co" }
];

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

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
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
      <div className="relative w-full h-100 flex justify-center items-center overflow-hidden mt-21.25">
        <img src="assets/imge/0005.jpg" alt="store-pic" loading="lazy" className="absolute inset-0 w-full h-full object-cover -z-10" />
        <div className="logo-text">
          <p className="text-accent text-[5rem] [text-shadow:2px_3px_9px_rgba(0,0,0,0.6)]">الممثلين</p>
        </div>
      </div>
      <main className="page-content">

        <div className="relative max-w-375 my-5 mx-auto border border-[#ddd] overflow-hidden">
          <img
            src="src/assets/assets/Actors/newMap.png"
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
            <div className="actors-modal-content w-full max-w-85 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <h2 className="mb-3">الممثلين في {selectedCountry}</h2>
              <div id="actorsList">
                {countryActors.map((actor) => (
                  <div
                    key={actor.name}
                    className="actor-link"
                    onClick={() => handleActorClick(actor.name)}
                  >
                    {actor.name}
                  </div>
                ))}
              </div>
              <div className="close-modal" onClick={() => setSelectedCountry(null)}>إغلاق</div>
            </div>
          </div>
        )}

        <div className="actors-container max-w-300 mx-auto grid grid-cols-[repeat(auto-fill,minmax(550px,1fr))] gap-6.25 justify-items-center mt-10 mb-7.5" style={{ maxWidth: "1200px" }}>
          {visibleActors.map((actor, idx) => (
            <div key={idx} className="card w-full max-w-95 bg-white rounded-xl border border-[#e0e0e0] overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-1.25 hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)] flex flex-col" data-country={actor.country}>
              <div className="actor-image-container h-75 bg-white flex items-center justify-center p-3.75 border-b border-[#eee]">
                <img src={actor.img} alt={actor.name} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div className="content p-5 grow text-right">
                <span className="country-tag bg-[#e1f5fe] text-primary px-2.5 py-1 rounded-[20px] text-[12px] font-bold inline-block text-center mb-2.5">{actor.country}</span>
                <h3 className="m-0 mb-2.5 text-[18px] text-[#2c3e50] leading-[1.4] text-right">{actor.name}</h3>
                <p className="m-0 text-[14px] leading-[1.6] text-[#666] text-right">{actor.desc}</p>
                {actor.extra && (
                  <p className="extra-desc mt-2.5 mb-0 text-[14px] leading-[1.6] text-[#666] text-right">{actor.extra}</p>
                )}
                <div className="contact-info mt-2.5 text-right">
                  <span className="label text-[12px] font-bold text-[#888] block text-right">البريد الإلكتروني:</span>
                  <a href={`mailto:${actor.email}`} className="email-link block text-[#2980b9] text-[13px] no-underline text-right break-all">
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