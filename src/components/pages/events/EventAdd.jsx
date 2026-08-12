import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";
import Scroll from "../../common/Scroll.jsx";

const events = [
  {
    img: "assets/event_add/Picture24.jpg",
    date: "يناير 2026",
    title: "زيارة الجمعية الثقافية والرياضية لرجال الإطفاء - برشلونة",
    desc: "تشرف د. محمد كمال ود. الخضري بزيارة المقر لتعزيز سبل التعاون الدولي.",
    size: "large",
  },
  {
    img: "assets/event_add/Picture25.jpg",
    date: "مارس 2024",
    title: "معرض اليوم العالمي للدفاع المدني - السعودية",
    desc: 'مشاركة المعهد تحت رعاية سمو الأمير سعود بن بندر في "الظهران إكسبو".',
    size: "medium",
  },
  {
    img: "assets/event_add/Picture26.jpg",
    date: "مارس 2024",
    title: "ملتقى السلامة المرورية الأول - الكويت",
    desc: "تمثيل المعهد بواسطة المهندس عبد الله حمود الغريب.",
    size: "medium",
  },
  {
    img: "assets/event_add/Picture27.jpg",
    date: "أكتوبر 2023",
    title: "معرض عُمان للحرائق والسلامة والأمن - مسقط",
    desc: "مشاركة فاعلة للمعهد في مركز عُمان للمؤتمرات والمعارض.",
    size: "medium",
  },
  {
    img: "assets/event_add/Picture34.jpg",
    date: "يوليو 2023",
    title: "تكريم نقيب المهندسين المصريين - القاهرة",
    desc: "تقديم درع السلامة العربي للمهندس طارق النبراوي تقديراً لجهوده في تطوير علوم السلامة.",
    size: "large",
  },
  {
    img: "assets/event_add/Picture35.jpg",
    date: "ديسمبر 2025",
    title:
      'مؤتمر "جودة تصنيع الغذاء والزراعة الذكية وإعادة تأهيل الموارد البشرية"',
    desc: 'انطلقت فعاليات مؤتمر "جودة تصنيع الغذاء والزراعة الذكية وإعادة تأهيل الموارد البشرية" الذي تنظمه شركة EMBS للهندسة الإدارية والجودة، ممثلا في فريق ممثلي المعهد العربي لعلوم السلامة بسوريا، بالتعاون مع كلية الهندسة الزراعية بجامعة دمشق، وذلك على مدرج الجامعة.',
    size: "large",
  },
];

export default function EventAdd() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <>
      <Header />
      <div className="relative w-full h-100 flex justify-center items-center overflow-hidden mt-21.5">
        <img src="assets/imge/0006.jpg" alt="hero-logo" loading="lazy" className="absolute inset-0 w-full h-full object-cover -z-10" />
        <div className="logo-text">
          <p className="text-accent text-[5rem] [text-shadow:2px_3px_9px_rgba(0,0,0,0.6)]">فعاليات شارك فيها المعهد</p>
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
                <img src={event.img} alt={event.title} loading="lazy" className="w-full h-full object-cover block transition-transform duration-500 ease-in-out hover:scale-[1.1]" />
              </div>
              <div className="p-3.75">
                <span className="text-[#e63946] text-[0.85rem] font-bold">{event.date}</span>
                <h3 className="my-[10px_0] text-[1.2rem] text-[#1d3557]">{event.title}</h3>
                <p className="leading-[1.6] text-[#555]">{event.desc}</p>
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