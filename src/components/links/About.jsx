import Header from "../common/Header.jsx";
import Footer from "../common/Footer.jsx";

function About() {
    return (
        <>
            <Header />

            {/* قسم صفحة العرض */}
            <div className="relative w-full h-100 flex justify-center items-center overflow-hidden mt-21.25 max-[600px]:mt-12.5 max-[600px]:h-50">
                <img src="assets/imge/banar.jpg" alt="hero-logo4" loading="lazy" className="absolute top-0 left-0 w-full h-full object-cover z-[-1]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent font-bold text-[70px] text-center w-[95%] max-[600px]:text-[28px]">
                    <p className="text-accent text-[5rem] drop-shadow-[2px_3px_9px_rgba(0,0,0,0.6)] max-[600px]:text-[2.5rem] max-[600px]:m-0">المعهد العربي لعلوم السلامة</p>
                </div>
            </div>

            <div className="flex items-center gap-12.5 p-[80px_5%] flex-wrap justify-center max-[992px]:p-[40px_20px] max-[992px]:text-center max-[992px]:flex-col max-[992px]:gap-7.5">
                <img src="assets/imge/aboutUs.png" alt="aboutUs-image" className="flex-1 min-w-75 max-w-112.5 rounded-[25px] max-[992px]:min-w-0 max-[992px]:w-full max-[992px]:max-w-75 max-[992px]:m-0 auto" />
                <div className="flex-1 min-w-75 max-[992px]:min-w-0">
                    <span className="text-[#7a7a7a] text-[15px] block mb-3.75">مرحبا بك في</span>
                    <h1 className="text-[2rem] text-accent mb-6.25 font-black leading-[1.2] max-[992px]:text-[1.6rem] max-[992px]:mb-3.75">المعهد العربي لعلوم السلامة</h1>
                    <p className="leading-loose text-[#555] text-[1rem] text-justify max-[992px]:text-right max-[992px]:text-[0.95rem]">
                        المعهد العربي لعلوم السلامة هو أول منصة علمية عربية غير ربحية متخصصة
                        في نشر الوعي وتعزيز الثقافة في علوم السلامة على مستوى العالم العربي.
                        منذ تأسيسه، تميز المعهد بدوره الريادي في تعريب أكواد ومعايير السلامة
                        العالمية، ليصبح مرجعًا رئيسيًا للمؤسسات والأفراد الساعين لتحقيق بيئات
                        عمل آمنة ومتوافقة مع المعايير الدولية. يقدم المعهد مجموعة متنوعة من
                        البرامج التدريبية والدورات العلمية التي تستهدف تأهيل كوادر عربية
                        متخصصة في مجالات السلامة المختلفة، ويمنح شهادات اعتماد للمحترفين
                        والجهات التدريبية المتميزة. يُصدر المعهد مجلة "السلامة العربية"
                        شهريًا، وهي أول مجلة عربية متخصصة في علوم السلامة، كما ينظم فعاليات
                        بارزة مثل "مسابقة السلامة العربية" التي تشجع على الابتكار في هذا
                        المجال، بالإضافة إلى مؤتمرات السلامة العربية التي تُعد منصة لتبادل
                        الخبرات والتجارب بين الخبراء والمتخصصين. يضم المعهد شبكة واسعة من
                        الخبراء الذين يقدمون الدعم العلمي والاستشاري عبر منصات التواصل
                        الاجتماعي، إضافة إلى فريق من الممثلين في عدة دول عربية يعملون على
                        توحيد الجهود وتوسيع نطاق التعاون في مجالات السلامة. يسعى المعهد العربي
                        لعلوم السلامة إلى أن يكون المرجع الأول في العالم العربي في مجال
                        السلامة، من خلال تقديم حلول مبتكرة، نشر المعرفة، وبناء مجتمعات أكثر
                        وعيًا وأمانًا.
                    </p>
                </div>
            </div>

            <section className="services">
                <div className="flex gap-7.5 p-[40px_0] text-[whitesmoke] m-2.5 flex-wrap">
                    <div className="bg-white p-5 rounded-lg border-t-4 border-t-[#d32f2f] text-center w-full">
                        <h3 className="text-[#e4293aed] mb-2.5 text-[1.4rem]">الريادة في تعريب أكواد السلامة</h3>
                        <p className="text-[#1c4f83] mb-2.5">
                            يتميَّز المعهد العربي لعلوم السلامة بكونه أوَّل جهة متخصِّصة في
                            العالم العربي في تعريب أكواد ومعايير السلامة العالمية، ما يجعله
                            مرجعًا مهمًّا لكل الجهات المهتمة بتطوير بيئة عمل آمنة تتماشى مع
                            المعايير الدولية باللغة العربية.
                        </p>
                    </div>
                    <div className="bg-white p-5 rounded-lg border-t-4 border-t-[#d32f2f] text-center w-full">
                        <h3 className="text-[#e4293aed] mb-2.5 text-[1.4rem]">مجلة السلامة العربية</h3>
                        <p className="text-[#1c4f83] mb-2.5">
                            في إطار جهوده التوعوية، يقوم المعهد بإصدار مجلة "السلامة العربية"
                            بشكل شهري، وهي أول مجلة عربية متخصصة في مجال السلامة، تهدف إلى تسليط
                            الضوء على أحدث الأبحاث، الابتكارات، وأفضل الممارسات في مجال السلامة،
                            ما يجعلها مصدرًا علميًا موثوقًا للمهتمين بهذا المجال.
                        </p>
                    </div>
                    <div className="bg-white p-5 rounded-lg border-t-4 border-t-[#d32f2f] text-center w-full">
                        <h3 className="text-[#e4293aed] mb-2.5 text-[1.4rem]">اعتماد وتأهيل المدربين والاستشاريين</h3>
                        <p className="text-[#1c4f83] mb-2.5">
                            يقدِّم المعهد العربي لعلوم السلامة برامج متكاملة لتأهيل واعتماد
                            المدربين والاستشاريين المتخصصين في علوم السلامة، حيث يعمل على إعداد
                            كوادر عربية مؤهلة قادرة على نقل المعرفة بأسلوب علمي متطور.
                        </p>
                    </div>
                    <div className="bg-white p-5 rounded-lg border-t-4 border-t-[#d32f2f] text-center w-full">
                        <h3 className="text-[#e4293aed] mb-2.5 text-[1.4rem]">مسابقة السلامة العربية</h3>
                        <p className="text-[#1c4f83] mb-2.5">
                            ينظم المعهد سنويًّا "مسابقة السلامة العربية"، وهي أوَّل مسابقة علمية
                            عربية تُعنى بتشجيع المبتكرين والمخترعين في مجال علوم السلامة. تهدف
                            هذه المسابقة إلى تحفيز الأفكار الإبداعية وتقديم حلول مبتكرة تُسهم في
                            تعزيز بيئات العمل الآمنة.
                        </p>
                    </div>
                    <div className="bg-white p-5 rounded-lg border-t-4 border-t-[#d32f2f] text-center w-full">
                        <h3 className="text-[#e4293aed] mb-2.5 text-[1.4rem]">البرامج والدورات العلمية</h3>
                        <p className="text-[#1c4f83] mb-2.5">
                            يعتمد المعهد العربي لعلوم السلامة مجموعة واسعة من البرامج والدورات
                            العلمية المتخصصة التي تستهدف مختلف القطاعات، بهدف تزويد المتدربين
                            بالمهارات والمعرفة اللازمة لتحقيق بيئات عمل آمنة وفقًا لأحدث
                            المعايير والتقنيات الحديثة.
                        </p>
                    </div>
                    <div className="bg-white p-5 rounded-lg border-t-4 border-t-[#d32f2f] text-center w-full">
                        <h3 className="text-[#e4293aed] mb-2.5 text-[1.4rem]">المؤتمرات العربية لعلوم السلامة</h3>
                        <p className="text-[#1c4f83] mb-2.5">
                            نظَّم المعهد العربي لعلوم السلامة بنجاحٍ سلسلةً من المؤتمرات العلمية
                            المتميزة تحت عنوان "مؤتمر السلامة العربية" (الأول، الثاني، الثالث،
                            والرابع)، والتي شهدت مشاركة واسعة من خبراء ومتخصصين في مجال السلامة
                            من مختلف الدول العربية، حيث تُعد هذه المؤتمرات منصة فعَّالة لتبادل
                            المعرفة وتوحيد الجهود في سبيل تعزيز ثقافة السلامة.
                        </p>
                    </div>
                    <div className="bg-white p-5 rounded-lg border-t-4 border-t-[#d32f2f] text-center w-full">
                        <h3 className="text-[#e4293aed] mb-2.5 text-[1.4rem]">شهادات الاعتماد للمحترفين والجهات التدريبية</h3>
                        <p className="text-[#1c4f83] mb-2.5">
                            يدرك المعهد أهمية رفع كفاءة العاملين في مجالات السلامة، لذا يمنح
                            شهادات اعتماد معترف بها للمُدرِّبين المحترفين، كما يقدِّم شهادات
                            اعتماد للجهات التدريبية المتميزة التي تلتزم بأعلى معايير الجودة.
                        </p>
                    </div>
                    <div className="bg-white p-5 rounded-lg border-t-4 border-t-[#d32f2f] text-cente w-full">
                        <h3 className="text-[#e4293aed] mb-2.5 text-[1.4rem]">التمثيل العربي</h3>
                        <p className="text-[#1c4f83] mb-2.5">
                            يعمل المعهد العربي لعلوم السلامة على توحيد الجهود العربية في مجال
                            السلامة، عبر فريقٍ من المُمثِّلين في عدَّة دول عربية. يهدف هؤلاء
                            الممثلون إلى تعزيز التواصل بين الجهات العربية المختلفة وتبادل
                            الخبرات والمعارف لتعزيز مستويات الأمان والسلامة في الوطن العربي.
                        </p>
                    </div>
                    <div className="bg-white p-5 rounded-lg border-t-4 border-t-[#d32f2f] text-center w-full">
                        <h3 className="text-[#e4293aed] mb-2.5 text-[1.4rem]">شبكة الخبراء والمتخصصين</h3>
                        <p className="text-[#1c4f83] mb-2.5">
                            يمتلك المعهد شبكةً من الخبراء والمتخصصين في مجال السلامة، الذين
                            يُقدمون الدعم والاستشارات والإجابة على استفسارات الجمهور عبر مختلف
                            المنصات الاجتماعية، مما يُسهم في نشر المعرفة وتعزيز مفهوم السلامة
                            لدى جميع الفئات.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    )
}

export default About;