import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
const API_URL = "http://127.0.0.1:8000";

import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";
import Scroll from "../../common/Scroll.jsx";
import Card from "../../common/Card.jsx";
const HERO_SLIDES = [
  { src: "assets/imge/موقع-ايس-هيرو.jpg", alt: "hero1" },
  { src: "assets/imge/موقع-ايس-هيرو.jpg2.jpg", alt: "hero2" },
  { src: "assets/imge/موقع-ايس-هيرو.jpg3.jpg", alt: "hero3" },
];

const SLIDE_INTERVAL_MS = 3000;
const MAGAZINE_PLACEHOLDER = "assets/magazine/placeholder.webp";
const BLOG_PLACEHOLDER = "assets/magazine/IMG_1325.webp";

function slugify(text = "") {
  return text
    .trim()
    .replace(/[^\u0600-\u06FFa-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildMagazineHref(item) {
  const id = item.id || 0;
  if (!id || id === 0) {
    return `/flipbook?title=${encodeURIComponent(item.title)}&type=magazine`;
  }
  return `/flipbook?id=${id}&type=magazine&title=${encodeURIComponent(item.title)}`;
}

function buildBlogHref(item) {
  return `/views?id=${item.id}&source=article`;
}

function fixArticleImage(imgPath) {
  if (!imgPath) return "assets/magazine/placeholder.webp";

  if (imgPath.startsWith("http")) return imgPath;

  if (imgPath.startsWith("/")) return imgPath;

  // Access images directly through Apache / XAMPP htdocs
  if (imgPath.startsWith("magazines/") || imgPath.startsWith("articles/") || imgPath.startsWith("booklets/")) {
    return `http://localhost/aiss-backend/public/storage/${imgPath}`;
  }

  return `http://127.0.0.1:8000/storage/${imgPath}`;
}

export default function Home({ fallbackBlogs = [], onAuthCheck }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [magazines, setMagazines] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  // Check if user is admin
  useEffect(() => {
    fetch("/api/me", {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    })
      .then((r) => r.json())
      .then((data) => {
        const user = data.user || data;
        if (user && (user.role === "admin" || user.can_add_article == 1)) {
          setIsAdmin(true);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadMagazines() {
      try {
        const response = await fetch("/api/magazines");
        const data = await response.json();
        const items = data.magazines || data.data || (Array.isArray(data) ? data : []);

        if (!cancelled && items.length > 0) {
          // Fix image path for magazines
         const fixed = items.slice(0, 4).map((m) => {
  let imgPath = m.cover_image || "";

  if (imgPath && !imgPath.startsWith("http")) {
    imgPath = `${API_URL}/storage/${imgPath}`;
  }

  return {
    ...m,
    cover_image: imgPath,
  };
});
          setMagazines(fixed);
          onAuthCheck?.();
        }
      } catch (error) {
        console.error("خطأ في جلب مجلات الصفحة الرئيسية:", error);
      }
    }

    loadMagazines();
    return () => {
      cancelled = true;
    };
  }, [onAuthCheck]);

  useEffect(() => {
    let cancelled = false;

    async function loadBlogs() {
      try {
        const response = await fetch("/api/articles");
        const data = await response.json();
        const articlesFromDB = data.articles || data.data || (Array.isArray(data) ? data : []);

        if (cancelled) return;

        if (articlesFromDB.length > 0) {
          // Fix image path - same as articles page
          const fixed = articlesFromDB.slice(0, 8).map((a) => {
            const imgPath = fixArticleImage(a.cover_image || a.image || "");
            return { ...a, cover_image: imgPath, img: imgPath };
          });
          setBlogs(fixed);
          onAuthCheck?.();
        } else {
          setBlogs(fallbackBlogs.slice(0, 8));
        }
      } catch (error) {
        console.error("خطأ في جلب المدونات من قاعدة البيانات:", error);
        if (!cancelled) setBlogs(fallbackBlogs.slice(0, 8));
      }
    }

    loadBlogs();
    return () => {
      cancelled = true;
    };
  }, [fallbackBlogs, onAuthCheck]);

  function getXsrfToken() {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="));

    return cookie ? decodeURIComponent(cookie.split("=")[1]) : "";
  }

  async function deleteMagazine(id) {
    if (!confirm("هل أنت متأكد من حذف هذه المجلة؟")) return;
    try {
      // Get CSRF token
      await fetch("/sanctum/csrf-cookie", {
        method: "GET",
        credentials: "include",
      });

      const xsrfToken = getXsrfToken();

      const response = await fetch(
        `/api/magazines/${id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "X-XSRF-TOKEN": xsrfToken,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("تم الحذف بنجاح");
        setMagazines((prev) => prev.filter((m) => m.id != id));
      } else {
        alert("فشل الحذف: " + (data.message || "خطأ غير معروف"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("حدث خطأ في الاتصال بالسيرفر");
    }
  }

  async function deleteArticle(id) {
    if (!confirm("هل أنت متأكد من حذف هذا المقال؟")) return;
    try {
      // Get CSRF token
      await fetch("/sanctum/csrf-cookie", {
        method: "GET",
        credentials: "include",
      });

      const xsrfToken = getXsrfToken();

      const response = await fetch(
        `/api/articles/${id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "X-XSRF-TOKEN": xsrfToken,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("تم الحذف بنجاح");
        setBlogs((prev) => prev.filter((b) => b.id != id));
      } else {
        alert("فشل الحذف: " + (data.message || "خطأ غير معروف"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("حدث خطأ في الاتصال بالسيرفر");
    }
  }

  const magazineCards = useMemo(
    () =>
      magazines.map((item, idx) => (
        <Card
          key={item.id ?? idx}
          id={item.id ?? idx}
          title={item.title}
          image={item.cover_image}
          fallbackImage={MAGAZINE_PLACEHOLDER}
          href={buildMagazineHref(item)}
          btnText="عرض المجلة"
          editLink={isAdmin ? `/admin/edit-magazine/${item.id}` : null}
          onDelete={isAdmin ? () => deleteMagazine(item.id) : null}
        />
      )),
    [magazines, isAdmin]
  );

  const blogCards = useMemo(
    () =>
      blogs.map((item, idx) => (
        <Card
          key={item.id ?? idx}
          id={item.id ?? idx}
          title={item.titlesubject || item.title}
          image={item.cover_image || item.image || item.img}
          fallbackImage={BLOG_PLACEHOLDER}
          href={buildBlogHref(item)}
          btnText="عرض المدونة"
          editLink={isAdmin ? `/admin/edit-article/${item.id}` : null}
          onDelete={isAdmin ? () => deleteArticle(item.id) : null}
        />
      )),
    [blogs, isAdmin]
  );

  return (
    <>
      <Header />

      <main className="page-content">
        {/* السلايدر الرئيسي */}
        <section className="relative w-full h-[30vh] md:h-[130vh] overflow-hidden">
          <div className="w-full h-full">
            {HERO_SLIDES.map((slide, index) => (
              <img
                key={slide.src}
                src={slide.src}
                alt={slide.alt}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? "opacity-100 z-2" : "opacity-0 z-1"
                }`}
                fetchPriority={index === 0 ? "high" : undefined}
                loading={index === 0 ? undefined : "lazy"}
                width={1920}
                height={800}
              />
            ))}
          </div>
        </section>

        {/* من نحن */}
        <div className="flex items-center gap-12.5 p-[80px_5%] flex-wrap justify-center">
          <img
            src="assets/imge/aboutUs.png"
            alt="aboutUs-image"
            data-aos="fade-right"
            data-aos-duration="1000"
            loading="lazy"
            width={600}
            height={400}
            className="flex-1 min-w-75 max-w-112.5 rounded-[25px]"
          />
          <div
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="1000"
            className="text-content flex-1 min-w-75"
          >
            <span className="text-[#7a7a7a] text-[15px] block mb-3.75">مرحبا بك في</span>
            <h1 className="text-[2rem] text-accent mb-5 font-black leading-[1.2]">المعهد العربي لعلوم السلامة</h1>
            <p className="leading-loose text-[#555] text-[1rem] text-justify">
              المعهد العربي لعلوم السلامة هو أول منصة علمية عربية غير ربحية
              متخصصة في نشر الوعي وتعزيز الثقافة في علوم السلامة على مستوى
              العالم العربي. منذ تأسيسه، تميز المعهد بدوره الريادي في تعريب
              أكواد ومعايير السلامة العالمية، ليصبح مرجعًا رئيسيًا للمؤسسات
              والأفراد الساعين لتحقيق بيئات عمل آمنة ومتوافقة مع المعايير
              الدولية. يقدم المعهد مجموعة متنوعة من البرامج التدريبية والدورات
              العلمية التي تستهدف تأهيل كوادر عربية متخصصة في مجالات السلامة
              المختلفة، ويمنح شهادات اعتماد للمحترفين والجهات التدريبية
              المتميزة. يُصدر المعهد مجلة "السلامة العربية" شهريًا، وهي أول
              مجلة عربية متخصصة في علوم السلامة، كما ينظم فعاليات بارزة مثل
              "مسابقة السلامة العربية" التي تشجع على الابتكار في هذا المجال،
              بالإضافة إلى مؤتمرات السلامة العربية التي تُعد منصة لتبادل
              الخبرات والتجارب بين الخبراء والمتخصصين. يضم المعهد شبكة واسعة
              من الخبراء الذين يقدمون الدعم العلمي والاستشاري عبر منصات
              التواصل الاجتماعي، إضافة إلى فريق من الممثلين في عدة دول عربية
              يعملون على توحيد الجهود وتوسيع نطاق التعاون في مجالات السلامة.
              يسعى المعهد العربي لعلوم السلامة إلى أن يكون المرجع الأول في
              العالم العربي في مجال السلامة، من خلال تقديم حلول مبتكرة، نشر
              المعرفة، وبناء مجتمعات أكثر وعيًا وأمانًا.
            </p>
          </div>
        </div>

        {/* أحدث الإصدارات */}
        <div className="section-title-bar">
          <p>
            <span className="text-accent">احدث </span>اصدارات المجلة  
          </p>
        </div>

        <div
          id="home-magazines-grid"
          className="cards-grid"
        >
          {magazineCards}
        </div>

        <div className="flex justify-center -mt-12.5 p-6.25">
          <Link to="/magazine">
            <button type="button" className="inline-block p-[15px_20px] bg-[whitesmoke] no-underline my-[30px_auto] text-black text-[16px] font-bold rounded-[25px] border border-black cursor-pointer hover:text-gray-500 hover:bg-[#f5f5f5] hover:scale-[1.05]">عرض المزيد</button>
          </Link>
        </div>

        {/* أحدث الإصدارات */}
        <div className="section-title-bar">
          <p>
            <span className="text-accent">احدث </span>اصدارات المدونات  
          </p>
        </div>

        <div
          id="blogs-grid"
          className="cards-grid"
        >
          {blogCards}
        </div>

        <div className="flex justify-center -mt-12.5 p-6.25">
          <Link to="/blogs">
            <button type="button" className="inline-block p-[15px_20px] bg-[whitesmoke] no-underline my-[30px_auto] text-black text-[16px] font-bold rounded-[25px] border border-black cursor-pointer hover:text-gray-500 hover:bg-[#f5f5f5] hover:scale-[1.05]">عرض المزيد</button>
          </Link>
        </div>
      </main>

      <Scroll />
      <Footer />
    </>
  );
}