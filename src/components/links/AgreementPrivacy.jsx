import Header from "../common/Header.jsx";
import Footer from "../common/Footer.jsx";

function AgreementPrivacy() {
    return (
        <>
            <Header />
            <div className="relative w-full h-100 flex justify-center items-center overflow-hidden mt-21.25 max-[600px]:mt-12.5 max-[600px]:h-50">
                <img src="assets/imge/banar.jpg" alt="hero-logo8" loading="lazy" className="absolute top-0 left-0 w-full h-full object-cover z-[-1]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent font-bold text-[70px] text-center w-[95%] max-[600px]:text-[28px]">
                    <p className="text-accent text-[5rem] drop-shadow-[2px_3px_9px_rgba(0,0,0,0.6)] max-[600px]:text-[2.5rem] max-[600px]:m-0">سياسة الخصوصية</p>
                </div>
            </div>
            <main className="page-content">
                <div className="w-[min(1100px,92%)] m-[80px_auto_40px] bg-white rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)] max-[600px]:mt-35 max-[600px]:p-4">
                    <div className="text-accent font-black text-[28px] mb-2.5 max-[600px]:text-[22px]">سياسة الخصوصية</div>
                    <p><strong>تاريخ آخر تحديث:</strong> 15 سبتمبر 2023</p>
                    <p className="text-[#333] leading-[1.9] text-[15px]">نحن في المعهد العربي لعلوم السلامة ملتزمون بحماية خصوصية المعلومات التي نجمعها من مستخدمي موقعنا. نود من خلال هذه الصفحة أن نوضح لكم كيفية جمع واستخدام هذه المعلومات وحقوقكم المتعلقة بها. يرجى قراءة سياسة الخصوصية بعناية لفهم كيفية تعاملنا مع معلوماتكم الشخصية.</p>

                    <h3 className="mt-4.5 mb-2 text-[#111]">1) المعلومات التي نجمعها:</h3>
                    <p className="text-[#333] leading-[1.9] text-[15px]">نقوم بجمع معلومات محددة تشمل ولكن لا تقتصر على الأمور التالية:</p>
                    <ul className="pr-5 mt-2">
                        <li className="text-[#333] leading-[1.9] text-[15px]">المعلومات الشخصية: مثل الاسم والبريد الإلكتروني ورقم الهاتف الذي تقدمه لنا عند التسجيل أو الاشتراك في خدماتنا.</li>
                        <li className="text-[#333] leading-[1.9] text-[15px]">معلومات التفاعل: معلومات حول كيفية تفاعلكم مع موقعنا، بما في ذلك الصفحات التي تزورونها والإعلانات التي تنقرون عليها.</li>
                        <li className="text-[#333] leading-[1.9] text-[15px]">معلومات تقنية: نقوم بجمع معلومات تقنية تشمل عناوين IP ومتصفح الويب الذي تستخدمونه ونظام التشغيل ومزود خدمة الإنترنت.</li>
                    </ul>

                    <h3 className="mt-4.5 mb-2 text-[#111]">2) استخدام المعلومات:</h3>
                    <p className="text-[#333] leading-[1.9] text-[15px]">نستخدم المعلومات التي نجمعها لأغراض متعددة، بما في ذلك:</p>
                    <ul className="pr-5 mt-2">
                        <li className="text-[#333] leading-[1.9] text-[15px]">تقديم الخدمات والمحتوى المطلوبين من قبلكم.</li>
                        <li className="text-[#333] leading-[1.9] text-[15px]">تحسين وتخصيص تجربتكم على الموقع.</li>
                        <li className="text-[#333] leading-[1.9] text-[15px]">إرسال تحديثات ومعلومات هامة عبر البريد الإلكتروني.</li>
                        <li className="text-[#333] leading-[1.9] text-[15px]">تحليل استخدام الموقع وتحسينه.</li>
                        <li className="text-[#333] leading-[1.9] text-[15px]">الامتثال للقوانين واللوائح ذات الصلة.</li>
                    </ul>

                    <h3 className="mt-4.5 mb-2 text-[#111]">3) مشاركة المعلومات:</h3>
                    <p className="text-[#333] leading-[1.9] text-[15px]">نحن لا نبيع أو نشارك معلوماتكم الشخصية مع أطراف ثالثة دون موافقتكم، إلا إذا كان ذلك مطلوبًا بموجب القانون أو لأغراض قانونية أخرى.</p>

                    <h3 className="mt-4.5 mb-2 text-[#111]">4) الأمان:</h3>
                    <p className="text-[#333] leading-[1.9] text-[15px]">نحن نتخذ إجراءات أمان معقولة لحماية معلوماتكم الشخصية من الوصول غير المصرح به والاستخدام غير القانوني أو التغيير غير المصرح به. ومع ذلك، يجب على المستخدمين أيضًا اتخاذ تدابير أمانية على مستوى الحساب الخاص بهم.</p>

                    <h3 className="mt-4.5 mb-2 text-[#111]">5) حقوق الخصوصية الفردية:</h3>
                    <p className="text-[#333] leading-[1.9] text-[15px]">لديكم الحق في الوصول إلى المعلومات الشخصية التي نحتفظ بها عنكم وطلب تصحيحها أو حذفها أو قيد معالجتها. يمكنكم أيضًا سحب موافقتكم على معالجة المعلومات في أي وقت.</p>

                    <h3 className="mt-4.5 mb-2 text-[#111]">6) التغييرات في سياسة الخصوصية:</h3>
                    <p className="text-[#333] leading-[1.9] text-[15px]">نحتفظ بالحق في تحديث سياسة الخصوصية هذه من وقت لآخر. سنقوم بنشر أي تغييرات هنا على هذه الصفحة مع تاريخ التحديث الأخير. يُنصح بمراجعة سياسة الخصوصية بشكل دوري للبقاء على دراية بأي تغييرات.</p>

                    <h3 className="mt-4.5 mb-2 text-[#111]">7) الاتصال بنا:</h3>
                    <p className="text-[#333] leading-[1.9] text-[15px]">إذا كان لديكم أي استفسارات أو تساؤلات حول سياسة الخصوصية أو كيفية معالجة معلوماتكم الشخصية، يمكنكم الاتصال بنا عبر البريد الإلكتروني على: info@aiss.co</p>
                    <p className="text-[#333] leading-[1.9] text-[15px]">نشكركم على ثقتكم بنا واستخدامكم لموقع المعهد العربي لعلوم السلامة.</p>
                </div>
            </main>
            <section className="w-[min(1100px,92%)] m-[0_auto_60px]">
                <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden [direction:ltr] font-[Tajawal,sans-serif] text-[#161616]">
                    <div className="bg-[#00214f] px-8 py-4 flex items-center justify-between flex-wrap gap-3">
                        <h3 className="text-white m-0 text-xl font-bold tracking-wide">Data Privacy &amp; Security</h3>
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 text-white text-[11px] px-3 py-1 tracking-wide">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
                            Secured
                        </span>
                    </div>

                    <div className="p-8 max-[600px]:p-5">
                        <ul className="space-y-4 m-0 p-0 list-none">
                            <li className="flex items-start gap-3.5">
                                <span className="mt-1 shrink-0 w-6 h-6 rounded-full bg-[#eaf0fa] text-[#00214f] flex items-center justify-center text-[13px] font-bold">01</span>
                                <p className="m-0 leading-[1.9] text-[15px] text-[#333]">"All credit/debit cards details and personally identifiable information will NOT be stored, sold, shared, rented or leased to any third parties"</p>
                            </li>
                            <li className="flex items-start gap-3.5">
                                <span className="mt-1 shrink-0 w-6 h-6 rounded-full bg-[#eaf0fa] text-[#00214f] flex items-center justify-center text-[13px] font-bold">02</span>
                                <p className="m-0 leading-[1.9] text-[15px] text-[#333]"><a href="https://aiss.co" className="text-[#00214f] hover:text-[#00214f]/60 hover:underline font-medium">https://aiss.co</a> will not pass any debit/credit card details to third parties</p>
                            </li>
                            <li className="flex items-start gap-3.5">
                                <span className="mt-1 shrink-0 w-6 h-6 rounded-full bg-[#eaf0fa] text-[#00214f] flex items-center justify-center text-[13px] font-bold">03</span>
                                <p className="m-0 leading-[1.9] text-[15px] text-[#333]"><a href="https://aiss.co" className="text-[#00214f] hover:text-[#00214f]/60 hover:underline font-medium">https://aiss.co</a> takes appropriate steps to ensure data privacy and security including through various hardware and software methodologies. However, (https://aiss.co/) cannot guarantee the security of any information that is disclosed online</p>
                            </li>
                            <li className="flex items-start gap-3.5">
                                <span className="mt-1 shrink-0 w-6 h-6 rounded-full bg-[#eaf0fa] text-[#00214f] flex items-center justify-center text-[13px] font-bold">04</span>
                                <p className="m-0 leading-[1.9] text-[15px] text-[#333]">The <a href="https://aiss.co" className="text-[#00214f] hover:text-[#00214f]/60 hover:underline font-medium">https://aiss.co</a> is not responsible for the privacy policies of websites to which it links. If you provide any information to such third parties different rules regarding the collection and use of your personal information may apply. You should contact these entities directly if you have any questions about their use of the information that they collect.</p>
                            </li>
                            <li className="flex items-start gap-3.5">
                                <span className="mt-1 shrink-0 w-6 h-6 rounded-full bg-[#eaf0fa] text-[#00214f] flex items-center justify-center text-[13px] font-bold">05</span>
                                <p className="m-0 leading-[1.9] text-[15px] text-[#333]">The Website Policies and Terms &amp; Conditions may be changed or updated occasionally to meet the requirements and standards. Therefore, the Customers are encouraged to frequently visit these sections to be updated about the changes on the website. Modifications will be effective on the day they are posted.</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}

export default AgreementPrivacy;