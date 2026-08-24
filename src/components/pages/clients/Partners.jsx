import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";
import Scroll from "../../common/Scroll.jsx";

const partners = [
  { name: "مؤسسة التميز للإدارة والسلامة", countryAr: "الجزائر", img: "Picture1.png", desc: "مؤسسة خاصة معتمدة تضم 15 تخصصاً إدارياً." },
  { name: "نقابة المهندسين - غزة", countryAr: "فلسطين", img: "Picture2.png", desc: "تنظيم العمل الهندسي الفلسطيني منذ 1976." },
  { name: "الجمعية السعودية للسلامة والإطفاء", countryAr: "السعودية", img: "Picture3.jpg", desc: "تحت إشراف جامعة الملك فهد للبترول والمعادن." },
  { name: "شركة الكفاءات للتعليم والتدريب", countryAr: "ليبيا", img: "Picture4.png", desc: "تعاون مع كلية التقنية الهندسية - بنغازي." },
  { name: "نقابة المهندسين الأردنيين", countryAr: "الأردن", img: "Picture5.png", desc: "قيادة العمل الهندسي وتطوير مهارات المهندسين." },
  { name: "جمعية الملاحين البحريين", countryAr: "فلسطين", img: "Picture6.png", desc: "تطوير الكادر البحري وحماية البيئة." },
  { name: "مركز إدارة الأزمات والكوارث", countryAr: "فلسطين", img: "Picture7.jpg", desc: "الجامعة الإسلامية - غزة." },
  { name: "نقابة أطباء الأسنان", countryAr: "فلسطين", img: "Picture8.jpg", desc: "من أقدم النقابات المهنية في فلسطين." },
  { name: "مركز الديمقراطية وحقوق العاملين", countryAr: "فلسطين", img: "Picture9.jpg", desc: "ضمان حقوق العمال والعدالة الاجتماعية." },
  { name: "نقابة المهندسين المصرية", countryAr: "مصر", img: "Picture10.png", desc: "بيت المهندس المصري والاستشاري الأول للدولة." },
  { name: "جامعة بوليتكنيك فلسطين", countryAr: "فلسطين", img: "Picture11.png", desc: "خدمة العملية التعليمية التقنية في الخليل." },
  { name: "منظمة OAPEC", countryAr: "الكويت", img: "Picture12.png", desc: "منظمة الأقطار العربية المصدرة للبترول." },
  { name: "أجيبسك لخدمات الحفر", countryAr: "مصر", img: "Picture13.jpg", desc: "حلول السلامة في قطاع الحفر والنفط." },
  { name: "نقابة العاملين في الزراعة", countryAr: "فلسطين", img: "Picture14.jpg", desc: "تطوير القطاع الزراعي الفلسطيني." },
  { name: "أكاديمية نبض الأردن", countryAr: "الأردن", img: "Picture15.jpg", desc: "رفع الكفاءات المهنية في السلامة والصحة." },
  { name: "شركة مستقبل البصرة", countryAr: "العراق", img: "Picture16.jpg", desc: "تدريب وتطوير كوادر النفط في البصرة." },
  { name: "شركة EMBS", countryAr: "سوريا", img: "Picture17.jpg", desc: "خدمات هندسية وحلول إدارية استشارية." },
  { name: "الاتحاد العالمي للسلامة", countryAr: "فلسطين", img: "Picture18.jpg", desc: "تطبيق المعايير العالمية في بيئة العمل." },
  { name: "مركز مستر سيفتي", countryAr: "السودان", img: "Picture19.jpg", desc: "حلول تدريبية في الوقاية والسلامة بالسودان." },
  { name: "مركز سجما للدراسات", countryAr: "اليمن", img: "Picture20.jpg", desc: "دعم المؤسسات اليمنية بالدراسات والاستشارات." },
  { name: "كلية علوم الطوارئ", countryAr: "اليمن", img: "Picture21.jpg", desc: "تخريج كوادر طبية وتقنية في الإسعاف." },
  { name: "جلوبال أوبتيموس برايم", countryAr: "اليمن", img: "Picture22.jpg", desc: "دراسات مهنية واستشارات بيئية." },
  { name: "المركز المغربي للسلامة", countryAr: "المغرب", img: "Picture23.jpg", desc: "الوقاية من حوادث الشغل والأمراض المهنية." },
  { name: "الجمعية الأردنية للإسعاف", countryAr: "الأردن", img: "Picture24.jpg", desc: "التدريب على الإسعافات والاستجابة للطوارئ." },
  { name: "الاتحاد الدولي لرجال الأعمال", countryAr: "العراق", img: "Picture25.jpg", desc: "تعزيز الاستثمار في أربيل." },
  { name: "شركة جرينوفيا", countryAr: "الأردن", img: "Picture26.jpg", desc: "التفتيش والتدقيق الصناعي." },
  { name: "أكاديمية كريستال", countryAr: "الأردن", img: "Picture27.jpg", desc: "تطوير الأداء المؤسسي والموارد البشرية." },
  { name: "مركز جارتير", countryAr: "عُمان", img: "Picture28.jpg", desc: "تنمية المهارات القيادية والمهنية." },
  { name: "مجتمع مواهب HSE", countryAr: "السعودية", img: "Picture29.jpg", desc: "تبادل الخبرات في قطاع السلامة والبيئة." },
  { name: "الجمعية التونسية لمفتقدي الشغل", countryAr: "تونس", img: "Picture30.jpg", desc: "الدفاع عن حقوق العاطلين وإعادة التأهيل." },
  { name: "البورد الأوروبي", countryAr: "فلسطين", img: "Picture31.jpg", desc: "إعداد القادة ونقل الخبرات الدولية." },
  { name: "الجمعية العربية لخبراء الإدارة", countryAr: "فلسطين", img: "Picture32.jpg", desc: "تطوير الأنظمة الإدارية ونشر الفكر الحديث." },
];

export default function Clients() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // Group partners by country
  const grouped = partners.reduce((acc, p) => {
    if (!acc[p.countryAr]) acc[p.countryAr] = [];
    acc[p.countryAr].push(p);
    return acc;
  }, {});

  return (
    <>
      <Header />
      <div className="page-hero">
        <img src="assets/imge/0006.jpg" alt="hero-logo" loading="lazy" className="page-hero-bg" />
        <div className="logo-text">
          <p className="page-hero-title">الشركاء</p>
        </div>
      </div>
      <main className="page-content">

        <div id="grid">
          {Object.entries(grouped).map(([country, countryPartners]) => (
            <div key={country}>
              <h2 className="max-w-350 mt-12 mx-auto pt-7 px-5 pb-7 text-[#2980b9] text-[1.5rem] border-r-4  bg-white border-b border-[#black] rounded-t-[30px]">{country}</h2>
              <div className="max-w-350 mx-auto mb-5 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-7.25 p-5 bg-white rounded-b-[30px] shadow-[0_10px_20px_rgba(0,0,0,0.1)]">
                {countryPartners.map((p, idx) => (
                  <div key={idx} className="bg-white rounded-md border border-[#ddd] overflow-hidden transition-[0.4s] flex flex-col shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:-translate-y-1.25 hover:shadow-[0_8px_15px_rgba(0,0,0,0.1)]">
                    <div className="h-40 flex items-center justify-center bg-white p-3.75 border-b border-[#eee]">
                      <img
                        src={`assets/logos/${p.img}`}
                        alt={p.name}
                        loading="lazy"
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "assets/icons/logo.webp";
                        }}
                      />
                    </div>
                    <div className="p-3.75 grow">
                      <span className="bg-[#e1f5fe] text-[#0288d1] px-2 py-3  rounded-[10px] text-[11px] font-bold">{p.countryAr}</span>
                      <h3 className="text-[16px] my-[10px_0_5px] text-[#2c3e50] mt-3">{p.name}</h3>
                      <p className="text-[13px] text-[#666] m-0 leading-[1.4]">{p.desc}</p>
                    </div>
                  </div>
                ))}
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