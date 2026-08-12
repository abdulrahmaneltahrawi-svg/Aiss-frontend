import { useEffect, useState, useCallback } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";
import Scroll from "../../common/Scroll.jsx";
import Card from "../../common/Card.jsx";

const ITEMS_PER_PAGE = 8;

export const codesData = [
  {
    "title": "أبنية مول مغطاة ومفتوحة",
    "image": "assets/codes/covered-and-open-mall-buildings2.webp",
    "content": "<p><strong>أبنية مول مُغطَّاة ومفتوحة:</strong></p><p><strong>طبقا لكود البناء الدولي 2012 (IBC 2012)</strong></p><p>لا يجوز تقييد مساحة المبنى لأي مركز تجاري مغطى أو مبنى تجاري مفتوح بشرط ألَّا يتجاوز المركز التجاري المغطى أو مبنى المركز التجاري المفتوح ثلاثة مستويات طوابق في أي وقت، وتكون المباني من النوع الأول، أو الثاني، أو الثالث، أو الرابع.</p><p><strong>Mall. مول:</strong> منطقة مشتركة مسقوفة أو مغطاة للمشاة داخل مبنى مركز تجاري مغطى تعمل كمدخل لمستأجرين أو أكثر ولا تتجاوز ثلاثة طوابق مفتوحة لبعضها البعض. يشمل مصطلح \"المول\" مراكز التسوق المفتوحة.</p><p><strong>مركز التسوق Open mall:</strong> طريق مشترك للمشاة غير مسقوف يخدم عدد من المستأجرين .</p><p>لا يتجاوز ثلاثة مستويات يسمح بتوزيع المستويات فوق الدرجة (ارتفاع الارض المجاور) بتضمين شرفات خارجية مفتوحة تؤدي إلى مخارج الانصراف عند الدرجة (ارتفاع الارض المجاور).</p><p><strong>Open mall building. ابنية:</strong> العديد من المباني التي تضم عددا من المستأجرين، مثل محلات البيع بالتجزئة ومؤسسات الشرب والطعام ومرافق الترفيه والتسلية والمكاتب وغيرها من الاستخدامات المماثلة، حيث يكون لمستأجرين أو أكثر مدخل رئيسي إلى مركز تجاري مفتوح أو أكثر. لا تعتبر المباني الثابتة جزءا من مبنى المركز التجاري المفتوح.</p>"
  },
  {
    "title": "رشاش لأعلى",
    "image": "assets/codes/sprinkle-upwards2.webp" ,
    "content": "<p><strong>طبقًا لكود (NFPA-13 CH3/SEC3.6.3.6):</strong></p><p><strong>رشاش لأعلى (العامودي):</strong> رشاش مُصمَّم بحيث يتم تثبيته بطريقة يتم من خلالها توجيه رذاذ الماء نحو الأعلى بعكس الاتجاه.</p><p><strong>رذاذ الماء:</strong> أنظمة رذاذ الماء هي أنظمة إخماد الحرائق التي تستخدم قطرات ماء صغيرة جدا لإطفاء الحرائق أو السيطرة عليها.</p>"
  },
  {
    "title": "شروط استخدام الرشاشات في خزانات الملابس الخاصة بغرف نوم المرضى",
    "image": "assets/codes/conditions-for-using-sprayers-in-patient-bedroom-wardrobes.webp",
    "content": "<p><strong>طبقًا لكود (NFPA 101): (SECTION 18.3.5.10):</strong></p><p>لا يُشتَرط استخدام الرشاشات في خزانات الملابس الخاصة بغرف نوم المرضى في المستشفيات <strong>التي</strong> لا تتجاوز مساحة الخزانة (0,55 m<sup>2</sup>) 6 اقدام، بشرط ألَّا تتجاوز المسافة بين الرشاش في غرفة نوم المريض والجدار الخلفي للخزانة الحد الأقصى للمسافة التي يسمح بها كود (NFPA 13).</p><p><strong>طبقا لكود (NFPA 101): (SECTION 3.3.150):</strong></p><p><strong>المستشفيات:</strong> هي مبانى أو اجزاء منها تستخدم على مدار 24 ساعة للرعاية الطبية أو النفسية أو للولادة أو للعمليات الجراحية لأربعة مرضى داخليين أو أكثر.</p>"
  },
  {
    "title": "الخط المحيط بمبنى المول المفتوح",
    "image": "assets/codes/the-line-surrounding-the-open-mall-building0.webp",
    "content": "<p><strong>طبقا لكود البناء الدولي 2012 (IBC 2012)</strong></p><p><strong>الخط المحيط بمبنى المول المفتوح:</strong> يجب إنشاء خط أو سور محيط، ويجب أن يحيط الخط المحيط بجميع المباني والهياكل التي تتكون من مبنى المركز التجاري المفتوح، كما يجب أن يشمل أي ممرات داخلية في الهواء الطلق، أو ساحات في الهواء الطلق، أو مساحات مفتوحة مُمَاثلة، كما يجب أن يحدد الخط المحيط مساحة مبنى المركز التجاري المفتوح، كما يجب أن تكون المباني المثبتة ومواقف السيارات خارج الخط المحيط، ولا تعتبر جزءًا من مبنى المركز التجاري المفتوح.</p>"
  },
  {
    "title": "صنبور مياه حريق",
    "image": "assets/codes/fire-water-hydrant0.webp",
    "content": "<p><strong>طبقًا لكود (NFPA-13 CH3/SEC3.8.2.1):</strong></p><p><strong>صنبور مياه الحريق:</strong> هو وصلة صمام خارجية متصلة بنظام الإمداد بالمياه الذي يوفر المياه لوصلات الخراطيم.</p>"
  },
  {
    "title": "الرشاشات المستخدمة داخل غرف المرضى",
    "image": "assets/codes/sprayers-used-inside-patient-rooms0.webp",
    "content": "<p><strong>طبقًا لـ (NFPA 101  ):</strong></p><p>(SECTION 18.3.5.6): يجب استخدام الرشاشات سريعة الاستجابة أو الرشاشات السكنية المعتمدة والمدرجة في جميع انحاء غرف الدخان التي تحتوي على غرف نوم المرضى.</p>"
  },
  {
    "title": "المساحة المفتوحة لمباني المركز التجاري المغطى والمفتوح",
    "image": "assets/codes/open-space-of-covered-and-open-mall-buildings0.webp",
    "content": "<p>يجب أن يُحَاط مبنى المول المغطى، والمباني المُرْفقة به، ومواقف السيارات من جميع جوانبها بمساحة مفتوحة دائمة، أو لا تقل عن (18م).</p>"
  },
  {
    "title": "جهاز تنظيم الضغط",
    "image": "assets/codes/pressure-regulating-device0.webp",
    "content": "<p><strong>طبقًا لكود (NFPA-13 CH3/SEC3.8.1.10  ):</strong></p><p>جهاز تنظيم الضغط : جهاز مُصمَّد الغرض منه تخفيض، أو تنظيم، أو مراقبة، أو تقييد ضغط المياه.</p>"
  },
  {
    "title": "وصلة الدفاع المدني",
    "image": "assets/codes/civil-defense-link-2-1.webp",
    "content": "<p><strong>طبقًا (NFPA 14  ):</strong></p><p>وفقًا للمعيار NFPA 14، القسم 4.8.3، يجب أن تكون وصلات الدفاع المدني (Fire Department Connections) مجهزة بأغطية أو سدادات لحمايتها من الأوساخ والتلوث والأضرار المحتملة.</p>"
  },
  {
    "title": "المدادات",
    "image": "public/assets/codes/Screenshot 2026-07-21 130705.png",
    "content": "<p><strong>طبقًا لكود (NFPA-13 CH3/SEC3.5.10  ):</strong></p><p><strong>المدادات</strong>: هي أنابيب الإمداد العمودية في نظام الرش.</p>"
  },
  {
    "title": "مباني المركز التجاري المغطى والمركز التجاري المفتوح",
    "image": "assets/codes/covered-mall-and-open-mall-buildings0.webp",
    "content": "<p><strong>مباني المركز التجاري المغطى والمركز التجاري المفتوح:</strong></p><p><strong>قابلية التطبيق:</strong> تسري أحكام هذا القسم على المباني أو الهياكل المحددة هنا على أنها مباني مول مُغطَّاة أو مفتوحة لا تزيد عن ثلاثة طوابق في أي نقطة</p>"
  },
  {
    "title": "وصلة الدفاع المدني (2)",
    "image": "public/assets/codes/Screenshot 2026-07-21 130705.png",
    "content": "<p><strong>طبقًا لـ (NFPA 14  ):</strong></p><p>( SECTION 4.8 .1 ): يجب أن يتم ادراج توصيلات قسم الإطفاء لضغط العمل يساوي او يزيد عن متطلبات الضغط التي يتطلبها النظام.</p>"
  },
  {
    "title": "المباني العامة أو المتنوعة",
    "image": "assets/codes/public-or-miscellaneous-buildings0.webp",
    "content": "<p><strong>المباني العامة أو المتنوعة (group u ):</strong></p><p><strong>طبقا ل</strong><strong>كود البناء الدولي 2012 (</strong><strong>IBC 2012</strong><strong>)</strong></p>"
  },
  {
    "title": "معلومة 1",
    "image": "assets/codes/information-10.webp",
    "content": "<p><strong>طبقا لكود International Building Code 2021 (IBC 2021)</strong></p><p>يجب أن يكون نظام الرش الآلي كاملًا وفعالا في جميع أنحاء المساحة المشغولة في مبنى المركز التجاري قبل اشغال أيٍّ من المساحات المُسْتأجرة</p>"
  },
  {
    "title": "جهاز إنذار تدفق المياه",
    "image": "assets/codes/water-flow-alarm-device0.webp",
    "content": "<p><strong>طبقًا لكود (NFPA-13 CH3/SEC3.5.14  ):</strong></p><p><strong>جهاز إنذار تدفق المياه</strong><strong>:</strong> جهاز ملحق بنظام الرش يكتشف تدفق المياه المحدد مسبقًا</p>"
  },
  {
    "title": "مباني الرعاية الصحية",
    "image": "assets/codes/health-care-buildings0.webp",
    "content": "<p><strong>طبقًا لـ (NFPA 101) الفصل (18)، والخاص بمباني الرعاية الصحية:</strong></p><p>تعتبر المناطق التالية مناطق خطرة، وسيتم حمايتها بجدران مقاومة للحريق لمدة ساعة على الأقل</p>"
  },
  {
    "title": "العاكس الخاص للرشاشات",
    "image": "assets/codes/special-reflector-for-sprinklers0.webp",
    "content": "<p>طبقًا لـ (NFPA 13 – 2019 SEC 9.5.4.2):</p><p>يجب أن يكون العاكس الخاص للرشاشات متوازيًا مع الأسقف ،اوالأسطح او منحدر السلالم.</p>"
  },
  {
    "title": "المرشَّة الجانبية",
    "image": "assets/codes/side-spray0.webp",
    "content": "<p><strong>طبقًا لكود</strong><strong> (NFPA-13 CH3/SEC</strong> <strong>3.6.3.5</strong><strong> ):</strong></p><p>المرشَّة الجانبية مرشَّة لها عاكسات خاصة مُصممة لتصريف معظم المياه بعيدًا عن الجدار المجاور</p>"
  },
  {
    "title": "الضغط المتبقي",
    "image": "assets/codes/residual-pressure0.webp",
    "content": "<p><strong>طبقًا لكود (NFPA-13 CH3/SEC3.8.1.9.1 ):</strong><br />الضغط المتبقي: هو الضغط الموجود في نظام التوزيع، ويُقاس عند صنابير مياه إطفاء الحريق المتبقية</p>"
  },
  {
    "title": "الرشاش سريع الاستجابة",
    "image": "assets/codes/sprayer-fast-response1.webp",
    "content": "<p><strong>طبقًا لكود (NFPA-13 CH3/SEC3.6.4.3 ):</strong><br />نوع المرش: سريع الاستجابة .</p>"
  },
  {
    "title": "الاختبار الهيدروستاتيكي",
    "image": "assets/codes/hydrostatic-test0.webp",
    "content": "<p><strong>طبقًا لكود (NFPA-13 CH3/SEC3.8.1.14.3 ):</strong></p><p>يُعرَّف \"الاختبار الهيدروستاتيكي\" في معيار NFPA 13 بأنه اختبار يُجرى على نظام الأنابيب المغلقة وملحقاته</p>"
  },
  {
    "title": "المرشَّة المفتوحة",
    "image": "assets/codes/sprinkler-open0.webp",
    "content": "<p><strong>طبقًا لكود (NFPA-13 CH3/SEC3.6.4.7 ):</strong></p><p>تعريف المرشَّة المفتوحة (Open Sprinkler) وفقًا لمعيار NFPA 13</p>"
  },
  {
    "title": "الرشاش الرذاذ",
    "image": "assets/codes/sprayer-sprayer0.webp",
    "content": "<p><strong>طبقًا لكود (NFPA-13 CH3/SEC3.6.4.11 ):</strong><br />المرشات الرذاذة نوعٌ من المرشات المُدرَجة للقدرة على التحكم في مدى واسع من مخاطر الحرائق.</p>"
  },
  {
    "title": "إشغالات التجمع الجديدة",
    "image": "assets/codes/new-cluster-occupancies550.webp",
    "content": "<p><strong>طبقًا لـ (NFPA 101 -2018 ):</strong><br />الفصل (12)، الخاص بإشغالات التجمع الجديدة (NEW ASSEMBLY OCCUPANCIES).</p>"
  },
  {
    "title": "الضغط الساكن",
    "image": "assets/codes/static-pressure0.webp",
    "content": "<p><strong>طبقًا للكود (NFPA-13 CH3/SEC3.8.1.9.2 ):</strong><br />الضغط الساكن: هو الضغط الموجود عند نقطة مُعيَّنة تحت ظروف نظام التوزيع العادي</p>"
  }
];

const FALLBACK_IMG = "assets/imge/0006.jpg";

export default function Code() {
  const [allItems] = useState(codesData);
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const loadMore = useCallback(() => {
    setDisplayedCount((prev) => Math.min(prev + ITEMS_PER_PAGE, allItems.length));
  }, [allItems.length]);

  const displayedItems = allItems.slice(0, displayedCount);

  return (
    <>
      <Header />
      <div className="page-hero">
        <img src={FALLBACK_IMG} alt="hero-logo" loading="lazy" className="page-hero-bg" />
        <div className="logo-text">
          <p className="page-hero-title">الأكواد والمعايير</p>
        </div>
      </div>
      <main className="page-content">

        <div className="section-title-bar">
          <p>الأكواد والمعايير</p>
        </div>

        <div className="cards-grid" style={{ minHeight: "600px" }}>
          {displayedItems.length === 0 ? (
            <p className="text-center w-full p-12.5">
              لا توجد أكواد لعرضها.
            </p>
          ) : (
            displayedItems.map((item, idx) => {
              const title = (item.titlesubject || item.title || "").trim();
              const slug = title.replace(/[^\u0600-\u06FFa-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "");

              return (
                <Card
                  key={item.id ?? idx}
                  id={item.id ?? idx}
                  title={title}
                  image={item.image || FALLBACK_IMG}
                  fallbackImage={FALLBACK_IMG}
                  href={`/views?id=${slug}&source=codes`}
                  btnText="عرض التفاصيل"
                />
              );
            })
          )}
        </div>

        {displayedCount < allItems.length && (
          <div className="text-center my-[20px_0_40px] w-full flex justify-center">
            <button className="btn1 inline-block" onClick={loadMore}>
              عرض المزيد
            </button>
          </div>
        )}
      </main>
      <Scroll />
      <Footer />
    </>
  );
}