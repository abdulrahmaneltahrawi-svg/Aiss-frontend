import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#ececec]">
      <div className="flex justify-around items-start p-[40px_20px] bg-[#ececec] text-[#444] m-0 auto max-[600px]:flex-col max-[600px]:items-center max-[600px]:w-full max-[600px]:text-[15px]">
        <div className="flex-1 min-w-62.5 text-center mb-5">
          <h3 className="mb-5 text-[1.5rem] border-b-2 border-b-[#23528754] inline-block pb-1.25 text-[#222] max-[600px]:w-full">
            بيانات التواصل
          </h3>
          <ul className="list-none">
            <li className="mb-mt-2.5">
              <a href="mailto:aiss@aiss.co" className="text-[#444] hover:text-primary hover:cursor-pointer flex items-center justify-center gap-2">
                Email: aiss@aiss.co
              </a>
            </li>
            <li className="mb-mt-2.5">
              <a href="https://wa.me/+971568305900" className="text-[#444] hover:text-primary hover:cursor-pointer flex items-center justify-center gap-2">
                Number: +971 56 830 5900
              </a>
            </li>
            <li className="mb-mt-2.5 mt-mt-2.5">
              <a
                href="https://maps.app.goo.gl/AS11VhiknLbc2a1r5"
                className="text-[#444] hover:text-primary hover:cursor-pointer flex items-center justify-center gap-2 no-underline leading-[1.8] max-[768px]:justify-center"
              >
                <img
                  src="/assets/icons/location.webp"
                  alt="location-img"
                  loading="lazy"
                  className="w-5 align-middle ml-1.25 max-[768px]:w-6"
                />
                <span className="max-[768px]:hidden">Address: United Arab Emirates</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="flex-1 min-w-62.5 text-center mb-5">
          <h3 className="mb-5 text-[1.5rem] border-b-2 border-b-[#23528754] inline-block pb-5 text-[#222] max-[600px]:w-full">
            روابط سريعة
          </h3>

          <ul className="list-none">
            <li className="mb-2.5">
              <Link to="/news" className="text-[#444] hover:text-primary hover:cursor-pointer flex items-center justify-center gap-2">
                النشرات الإخبارية
              </Link>
            </li>
            <li className="mb-2.5">
              <Link to="/inquiries" className="text-[#444] hover:text-primary hover:cursor-pointer flex items-center justify-center gap-2">
                الاستفسارات
              </Link>
            </li>
            <li className="mb-2.5">
              <Link to="/jobs" className="text-[#444] hover:text-primary hover:cursor-pointer flex items-center justify-center gap-2">
                الوظائف
              </Link>
            </li>
            <li className="mb-2.5">
              <Link to="/about" className="text-[#444] hover:text-primary hover:cursor-pointer flex items-center justify-center gap-2">
                عن المعهد
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex-1 min-w-62.5 text-center mb-4">
          <h3 className="mb-5 text-[1.5rem] border-b-2 border-b-[#23528754] inline-block pb-1.25 text-[#222] max-[600px]:w-full">
            تابعنا
          </h3>
          <ul className="list-none">
            <li className="mb-2.5">
              <a href="https://www.facebook.com/aissorg" className="text-[#444] hover:text-primary hover:cursor-pointer flex items-center justify-center gap-2">
                <img
                  src="/assets/icons/facebook.webp"
                  alt="facebook-logo"
                  className="w-7.5 h-auto hover:scale-[1.2] max-[600px]:w-10"
                  loading="lazy"
                />
              </a>
            </li>
            <li className="mb-2.5">
              <a href="mailto:aiss@aiss.co" className="text-[#444] hover:text-primary hover:cursor-pointer flex items-center justify-center gap-2">
                <img
                  src="/assets/icons/email.webp"
                  alt="email-logo"
                  className="w-7.5 h-auto hover:scale-[1.2] max-[600px]:w-10"
                  loading="lazy"
                />
              </a>
            </li>
            <li className="mb-2.5">
              <a href="https://t.me/+32qZLTmtsddlZjA0" className="text-[#444] hover:text-primary hover:cursor-pointer flex items-center justify-center gap-2">
                <img
                  src="/assets/icons/telegram.webp"
                  alt="telegram-logo"
                  className="w-7.5 h-auto hover:scale-[1.2] max-[600px]:w-10"
                  loading="lazy"
                />
              </a>
            </li>
            <li className="mb-2.5">
              <a
                href="https://www.linkedin.com/company/%d8%a7%d9%84%d9%85%d8%b9%d9%87%d8%af-%d8%a7%d9%84%d8%b9%d8%b1%d8%a8%d9%8a-%d9%84%d8%b9%d9%84%d9%88%d9%85-%d8%a7%d9%84%d8%b3%d9%84%d8%a7%d9%85%d8%a9-aiss"
                className="text-[#444] hover:text-primary hover:cursor-pointer flex items-center justify-center gap-2"
              >
                <img
                  src="/assets/icons/linkedin.webp"
                  alt="linkedin-logo"
                  className="w-7.5 h-auto hover:scale-[1.2] max-[600px]:w-10"
                  loading="lazy"
                />
              </a>
            </li>
            <li className="mb-2.5">
              <a href="https://youtube.com/channel/UCaYDjluZ2hSspCFPefhMudw" className="text-[#444] hover:text-primary hover:cursor-pointer flex items-center justify-center gap-2">
                <img
                  src="/assets/icons/youtube.webp"
                  alt="youtube-logo"
                  className="w-7.5 h-auto hover:scale-[1.2] max-[600px]:w-10"
                  loading="lazy"
                />
              </a>
            </li>
            <li className="mb-2.5">
              <a
                href="https://api.whatsapp.com/message/RQRUTKQ2VUW5N1?autoload=1&app_absent=0"
                className="text-[#444] hover:text-primary hover:cursor-pointer flex items-center justify-center gap-2"
              >
                <img
                  src="/assets/icons/whatsapp.webp"
                  alt="whatsapp-logo"
                  className="w-7.5 h-auto hover:scale-[1.2] max-[600px]:w-10"
                  loading="lazy"
                />
              </a>
            </li>
            <li className="mb-2.5">
              <a href="https://twitter.com/aissorg" className="text-[#444] hover:text-primary hover:cursor-pointer flex items-center justify-center gap-2">
                <img
                  src="/assets/icons/twitter.webp"
                  alt="twitter-logo"
                  className="w-7.5 h-auto hover:scale-[1.2] max-[600px]:w-10"
                  loading="lazy"
                />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white flex justify-between items-center text-right p-[10px_20px] flex-wrap gap-2.5 max-[600px]:flex-col max-[600px]:text-center">
        <p className="text-black m-0 text-[14px] p-1.75 flex items-center gap-2">
          المعهد العربي لعلوم السلامة 2026 © جميع الحقوق محفوظة
        </p>
        <p className="text-black m-0 text-[14px] p-1.75 flex items-center gap-2">
          <Link to="/terms" className="px-2.5 hover:text-[#7a7a7a]">
            الشروط و الأحكام
          </Link>{" "}
          |
          <Link to="/privacy" className="px-2.5 hover:text-[#7a7a7a]">
            سياسة الخصوصية{" "}
          </Link>
          <img
            src="/assets/icons/visa.webp"
            alt="visa-logo"
            className="w-7.5 h-auto align-middle max-[600px]:w-9"
            loading="lazy"
          />
        </p>
      </div>
    </footer>
  );
}

export default Footer;