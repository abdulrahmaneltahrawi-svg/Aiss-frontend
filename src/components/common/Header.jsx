import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AuthModals from "./button.jsx";
import Search from "./Search.jsx";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const headerRef = useRef(null);

  // Close menu on desktop < 1024px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const closeOutside = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", closeOutside);
    return () => document.removeEventListener("click", closeOutside);
  }, []);

  const navLinkClass =
    "block no-underline text-[#333] p-[5px] transition-all duration-300 text-[25px] mt-[15px] hover:text-accent hover:-translate-x-[10px] max-[767px]:text-[18px] max-[767px]:mt-[10px] max-[767px]:p-[12px] max-[767px]:hover:translate-x-0";

  // كلاس العناصر الأب (التي لها قائمة فرعية): النص يمين والسهم في أقصى يسار الناف بار
  const navParentClass =
    "flex w-full items-center justify-between no-underline text-[#333] p-[5px] transition-all duration-300 text-[25px] mt-[15px] hover:text-accent max-[767px]:text-[18px] max-[767px]:mt-[10px] max-[767px]:p-[12px]";

  // سهم صغير (رأس مثلث فقط) — يتحول للون النص ويدور 180° عند فتح القائمة
  const NavArrow = ({ open }) => (
    <svg
      className={`w-5 h-5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );

  const navSubLinkClass =
    "block no-underline text-[18px] mt-[5px] text-[#555] p-[5px] transition-all duration-300 hover:text-accent";

  const submenuClass = (isOpen) =>
    `${isOpen ? "block animate-fade-in-down" : "hidden"} list-none bg-[#f9f9f9] p-0 pr-[10px] m-0 static shadow-none border-none border-r-2 border-r-accent w-full max-[767px]:pr-[20px]`;

  const toggleSubmenu = (key) => {
    setOpenSubmenu(openSubmenu === key ? null : key);
  };

  return (
    <header
      ref={headerRef}
      className="fixed top-0 right-0 left-0 w-full flex flex-row-reverse justify-around items-center bg-white z-9999 max-[600px]:justify-between max-[600px]:flex-nowrap max-[600px]:gap-2 max-[600px]:px-2 max-[600px]:overflow-hidden"
    >
      <Link to="/">
        <img
          src="/assets/imge/logo-iss-site.jpg.jpeg"
          alt="logo"
          loading="lazy"
          className="w-70 max-[600px]:w-28 max-[400px]:w-24 shrink-0"
        />
      </Link>

      {/* AuthModals يتحكم بالكامل في زر تسجيل الدخول / معلومات المستخدم */}
      <AuthModals />

      <div className="flex items-center gap-7.5 max-[600px]:gap-0">
        <button
          className="bg-transparent border border-black/15 rounded-xl px-3 py-2 text-[28px] leading-none cursor-pointer max-[600px]:order-1 max-[600px]:block max-[600px]:text-[24px] max-[600px]:bg-none max-[600px]:border-none max-[600px]:p-2.5 max-[600px]:text-[#333] max-[600px]:shrink-0"
          id="menu-toggle"
          aria-label="فتح القائمة"
          aria-expanded={menuOpen}
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
            setOpenSubmenu(null);
          }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        {/* بحث الهيدر — مكوّن منفصل Search.jsx */}
        <Search />
      </div>

      <nav
        className={`${
          menuOpen ? "block animate-slide-from-right" : "hidden"
        } fixed top-21.25 right-5 bg-white border border-[#ddd] shadow-[0_4px_12px_rgba(0,0,0,0.15)] rounded-lg p-2.5 min-w-125 z-10000 max-h-[90vh] overflow-y-auto max-[767px]:min-w-0 max-[767px]:w-[90%] max-[767px]:right-[5%] max-[767px]:left-[5%] max-[767px]:top-20 max-[767px]:max-h-[80vh]`}
        id="header-nav"
      >
        <ul className="list-none flex flex-col gap-2.5 p-0 m-0 font-bold mr-6.25">
          <li>
            <Link to="/" className={navLinkClass}>الصفحة الرئيسية</Link>
          </li>

          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSubmenu("about");
              }}
              className={`${navParentClass} ${openSubmenu === "about" ? "text-accent" : ""}`}
            >
              عنّا
              <NavArrow open={openSubmenu === "about"} />
            </a>
            <ul className={submenuClass(openSubmenu === "about")}>
              <li><Link to="/About_brief" className={navSubLinkClass}>نبذة عن المعهد</Link></li>
              <li><Link to="/About_golas" className={navSubLinkClass}>الرؤية والرسالة</Link></li>
              <li><Link to="/About_services" className={navSubLinkClass}>خدماتنا</Link></li>
              <li><Link to="/About_manger" className={navSubLinkClass}>كلمة الرئيس التنفيذي</Link></li>
              <li><Link to="/gover" className={navSubLinkClass}>الحوكمة المؤسسية</Link></li>
              <li><Link to="/creator" className={navSubLinkClass}>المجلس التأسيسي</Link></li>
              <li><Link to="/executive-management" className={navSubLinkClass}>الإدارة التنفيذية</Link></li>
            </ul>
          </li>

          <li>
            <Link to="/magazine" className={navLinkClass}>المجلات</Link>
          </li>

                    <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSubmenu("blogs");
              }}
              className={`${navParentClass} ${openSubmenu === "blogs" ? "text-accent" : ""}`}
            >
              المدونات
              <NavArrow open={openSubmenu === "blogs"} />
            </a>
            <ul className={submenuClass(openSubmenu === "blogs")}>
              <li><Link to="/blogs?cat=محتويات علمية" className={navSubLinkClass}>محتويات علمية</Link></li>
              <li><Link to="/blogs?cat=مقالات الخبراء" className={navSubLinkClass}>مقالات الخبراء</Link></li>
              <li><Link to="/blogs?cat=مقالات المجلة" className={navSubLinkClass}>مقالات المجلة</Link></li>
            </ul>
          </li>

          <li>
            <Link to="/manuals" className={navLinkClass}>الكتيبات</Link>
          </li>

          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSubmenu("events");
              }}
              className={`${navParentClass} ${openSubmenu === "events" ? "text-accent" : ""}`}
            >
              الفعاليات
              <NavArrow open={openSubmenu === "events"} />
            </a>
            <ul className={submenuClass(openSubmenu === "events")}>
              <li><Link to="/event?cat=مسابقة" className={navSubLinkClass}>مسابقات السلامة العربية</Link></li>
              <li><Link to="/event_add" className={navSubLinkClass}>فعاليات شارك فيها المعهد</Link></li>
            </ul>
          </li>

          <li>
            <Link to="/cods" className={navLinkClass}>الأكواد والمعايير</Link>
          </li>

          <li>
            <Link to="/conferences" className={navLinkClass}>مؤتمرات السلامة</Link>
          </li>



          <li>
            <Link to="/medal" className={navLinkClass}>وسام السلامة العربي</Link>
          </li>

          <li>
            <Link to="/companies" className={navLinkClass}>الشركاء</Link>
          </li>
          <li>
            <Link to="/actors" className={navLinkClass}>الممثلين</Link>
          </li>
          <li>
            <Link to="/certificate" className={navLinkClass}>الشهادات و الإعتمادية</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;