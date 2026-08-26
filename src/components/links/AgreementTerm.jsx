import Header from "../common/Header.jsx";
import Footer from "../common/Footer.jsx";

function AgreementTerm() {
    return (
        <>
            <Header />
            <div className="relative w-full h-100 flex justify-center items-center overflow-hidden mt-21.25 max-[600px]:mt-12.5 max-[600px]:h-50">
                    <img src="assets/imge/banar.jpg" alt="hero-logo8" loading="lazy" className="absolute top-0 left-0 w-full h-full object-cover z-[-1]" />                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent font-bold text-[70px] text-center w-[95%] max-[600px]:text-[28px]">
                    <p className="text-accent text-[5rem] drop-shadow-[2px_3px_9px_rgba(0,0,0,0.6)] max-[600px]:text-[2.5rem] max-[600px]:m-0">الشروط والأحكام</p>
                </div>
            </div>

            <main className="page-content">
                <div className="w-[min(1100px,92%)] m-[80px_auto_40px] bg-white rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)] max-[600px]:mt-35 max-[600px]:p-4">
                    <div className="text-accent font-black text-[28px] mb-2.5 max-[600px]:text-[22px]">الشروط والأحكام</div>
                    <p className="text-[#333] leading-[1.9] text-[15px]">
                        باستخدامك لموقع المعهد العربي لعلوم السلامة (AISS) فإنك توافق على
                        الالتزام بهذه الشروط والأحكام.
                    </p>

                    <h3 className="mt-4.5 mb-2 text-[#111]">1) استخدام الموقع</h3>
                    <ul className="pr-5 mt-2">
                        <li className="text-[#333] leading-[1.9] text-[15px]">يُسمح باستخدام الموقع للأغراض الشخصية والتعليمية فقط.</li>
                        <li className="text-[#333] leading-[1.9] text-[15px]">يُمنع الاستخدام التجاري أو إعادة نشر المحتوى دون موافقة خطية مسبقة.</li>
                        <li className="text-[#333] leading-[1.9] text-[15px]">يُمنع استخدام الموقع لأي غرض غير قانوني أو يخلّ بالأنظمة.</li>
                    </ul>

                    <h3 className="mt-4.5 mb-2 text-[#111]">2) حقوق الملكية العلمية</h3>
                    <ul className="pr-5 mt-2">
                        <li className="text-[#333] leading-[1.9] text-[15px]">جميع حقوق المحتوى محفوظة للمعهد ما لم يُذكر خلاف ذلك.</li>
                        <li className="text-[#333] leading-[1.9] text-[15px]">يُمنع النسخ أو النقل أو النشر أو التوزيع دون تصريح.</li>
                    </ul>

                    <h3 className="mt-4.5 mb-2 text-[#111]">3) إخلاء المسؤولية</h3>
                    <ul className="pr-5 mt-2">
                        <li className="text-[#333] leading-[1.9] text-[15px]">يُقدَّم المحتوى "كما هو" دون أي ضمانات.</li>
                        <li className="text-[#333] leading-[1.9] text-[15px]">لا يتحمل المعهد مسؤولية أي خسائر أو أضرار ناتجة عن استخدام الموقع.</li>
                    </ul>

                    <h3 className="mt-4.5 mb-2 text-[#111]">4) الروابط الخارجية</h3>
                    <ul className="pr-5 mt-2">
                        <li className="text-[#333] leading-[1.9] text-[15px]">قد يحتوي الموقع على روابط لمواقع خارجية.</li>
                        <li className="text-[#333] leading-[1.9] text-[15px]">المعهد غير مسؤول عن محتوى أو سياسات المواقع الخارجية.</li>
                    </ul>

                    <h3 className="mt-4.5 mb-2 text-[#111]">5) التعديلات</h3>
                    <p className="text-[#333] leading-[1.9] text-[15px]">يحتفظ المعهد بالحق في تعديل هذه الشروط في أي وقت، ويُنصح بمراجعتها دوريًا.</p>

                    <h3 className="mt-4.5 mb-2 text-[#111]">6) الاختصاص والقانون</h3>
                    <p className="text-[#333] leading-[1.9] text-[15px]">تخضع هذه الشروط لقوانين دولة الإمارات العربية المتحدة، ويكون الاختصاص للمحاكم المختصة داخل الدولة.</p>

                    <h3 className="mt-4.5 mb-2 text-[#111]">7) التواصل</h3>
                    <p className="text-[#333] leading-[1.9] text-[15px]">للاستفسارات: <a href="mailto:aiss@aiss.co">aiss@aiss.co</a></p>
                </div>
            </main>
            <section className="w-[min(1100px,92%)] m-[0_auto_60px]">
                <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] overflow-hidden [direction:ltr] font-[Tajawal,sans-serif] text-[#161616]">
                    <div className="bg-[#00214f] px-8 py-4 flex items-center justify-between flex-wrap gap-3">
                        <h3 className="text-white m-0 text-xl font-bold tracking-wide">Legal Notices &amp; Policies</h3>
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 text-white text-[11px] px-3 py-1 tracking-wide">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
                            Effective 2023
                        </span>
                    </div>

                    <div className="p-8 max-[600px]:p-5">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-4">
                            <div className="space-y-4">
                                <p className="leading-[1.9] text-[15px] text-[#333]">
                                    <strong className="text-[#00214f]">"ARAB INSTITUTE FOR SAFETY SCIENCES FZCO"</strong> maintains
                                    the <a href="https://aiss.co" className="text-[#00214f] hover:text-[#00214f]/60 hover:underline font-medium">https://aiss.co</a> Website ("Site").
                                </p>
                                <p className="leading-[1.9] text-[15px] text-[#333]">
                                    "The United Arab Emirates is our country of domicile" stipulates that
                                    the governing law is the local law. All disputes arising in connection
                                    in addition to that shall be heard only by a court of competent
                                    jurisdiction in the U.A.E.
                                </p>
                                <p className="leading-[1.9] text-[15px] text-[#333]">
                                    "Visa or MasterCard debit and credit cards in <strong className="text-[#00214f]">AED</strong> will be accepted for payment"
                                </p>
                                <p className="leading-[1.9] text-[15px] text-[#333]">
                                    "We will not trade with or provide any services to OFAC (Office of
                                    Foreign Assets Control) and sanctioned countries in accordance with
                                    the law of UAE"
                                </p>
                                <p className="leading-[1.9] text-[15px] text-[#333]">
                                    "Customers using the website who are Minor /under <strong className="text-[#00214f]">the age of 18</strong> shall not register as a User of the
                                    website and shall not transact on or use the website"
                                </p>
                                <p className="leading-[1.9] text-[15px] text-[#333]">
                                    "Cardholder must retain a copy of transaction records and Merchant policies and rules"
                                </p>
                                <p className="leading-[1.9] text-[15px] text-[#333]">
                                    "User is responsible for maintaining the confidentiality of his account"
                                </p>
                            </div>
                            <div className="space-y-5">
                                <div className="rounded-2xl border border-[#00214f]/15 bg-[#f5f8fc] p-5 transition-shadow hover:shadow-[0_6px_18px_rgba(0,33,79,0.08)]">
                                    <h4 className="m-0 mb-2 text-[#00214f] text-[17px] font-bold">
                                        
                                        PAYMENT CONFIRMATION
                                    </h4>
                                    <p className="m-0 leading-[1.8] text-[14px] text-[#444]">
                                        Once the payment is made, the confirmation notice will be sent to the
                                        client via email within 24 hours of receipt of payment.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-[#00214f]/15 bg-[#f5f8fc] p-5 transition-shadow hover:shadow-[0_6px_18px_rgba(0,33,79,0.08)]">
                                    <h4 className="m-0 mb-2 text-[#00214f] text-[17px] font-bold">
                                        CANCELLATION POLICY
                                    </h4>
                                    <p className="m-0 leading-[1.8] text-[14px] text-[#444]">
                                        Customers can cancel their order/requested service within 24 hours;
                                        refunds will be made back to the payment solution used initially by
                                        the customer.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-[#00214f]/15 bg-[#f5f8fc] p-5 transition-shadow hover:shadow-[0_6px_18px_rgba(0,33,79,0.08)]">
                                    <h4 className="m-0 mb-2 text-[#00214f] text-[17px] font-bold">
                                        REFUND POLICY
                                    </h4>
                                    <p className="m-0 leading-[1.8] text-[14px] text-[#444]">
                                        "Refunds will be done only through the Original Mode of Payment.
                                        Please allow for up to 45 days for the refund transfer to be completed.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}

export default AgreementTerm;