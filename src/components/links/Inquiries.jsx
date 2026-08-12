import { useState } from "react";
import Header from "../common/Header.jsx";
import Footer from "../common/Footer.jsx";

function Inquiries() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        org: "",
        phone: "",
        msg: "",
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        const key = id.replace("inq-", "");
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const subject = encodeURIComponent("استفسار من موقع AISS");
        const body = encodeURIComponent(
            `الاسم: ${form.name}\nالبريد: ${form.email}\nاسم الجهة: ${form.org}\nالجوال: ${form.phone}\n\nالرسالة:\n${form.msg}`
        );
        window.location.href = `mailto:aiss@aiss.co?subject=${subject}&body=${body}`;
    };

    return (
        <div>
            <Header />
            <div className="relative w-full h-100 flex justify-center items-center overflow-hidden mt-21.25 max-[600px]:mt-12.5 max-[600px]:h-50">
                <img src="assets/imge/0008.jpg" alt="hero-logo8" loading="lazy" className="absolute top-0 left-0 w-full h-full object-cover z-[-1]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent font-bold text-[70px] text-center w-[95%] max-[600px]:text-[28px]">
                    <p className="text-accent text-[5rem] drop-shadow-[2px_3px_9px_rgba(0,0,0,0.6)] max-[600px]:text-[2.5rem] max-[600px]:m-0">الاستفسارات</p>
                </div>
            </div>
            <main className="page-content">
                <div className="w-[min(800px,92%)] m-[150px_auto_60px] bg-white rounded-2xl p-10 shadow-[0_15px_35px_rgba(0,0,0,0.1)] rtl max-[600px]:mt-30 max-[600px]:p-[25px_20px]">
                    <div className="text-center text-accent font-black text-[28px] mb-4.5 max-[600px]:text-[22px]">
                        نحن هنا للرد على جميع استفساراتكم
                    </div>
                    <form id="inq-form" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-5 max-[600px]:grid-cols-1">
                            <input
                                id="inq-name"
                                placeholder="الاسم"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full p-[14px_18px] rounded-xl border-2 border-[#eee] outline-none font-[Tajawal,sans-serif] transition-colors duration-300 focus:border-accent"
                            />
                            <input
                                id="inq-email"
                                type="email"
                                placeholder="البريد الإلكتروني"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full p-[14px_18px] rounded-xl border-2 border-[#eee] outline-none font-[Tajawal,sans-serif] transition-colors duration-300 focus:border-accent"
                            />
                            <input
                                id="inq-org"
                                placeholder="اسم الجهة"
                                value={form.org}
                                onChange={handleChange}
                                className="w-full p-[14px_18px] rounded-xl border-2 border-[#eee] outline-none font-[Tajawal,sans-serif] transition-colors duration-300 focus:border-accent"
                            />
                            <input
                                id="inq-phone"
                                placeholder="رقم التلفون"
                                value={form.phone}
                                onChange={handleChange}
                                className="w-full p-[14px_18px] rounded-xl border-2 border-[#eee] outline-none font-[Tajawal,sans-serif] transition-colors duration-300 focus:border-accent"
                            />
                            <textarea
                                id="inq-msg"
                                placeholder="استفسارك"
                                value={form.msg}
                                onChange={handleChange}
                                required
                                className="w-full p-[14px_18px] rounded-xl border-2 border-[#eee] outline-none font-[Tajawal,sans-serif] transition-colors duration-300 focus:border-accent col-span-2 min-h-40 resize-y max-[600px]:col-span-1"
                            ></textarea>
                        </div>
                        <div className="mt-6.25 flex justify-center">
                            <button
                                type="submit"
                                className="bg-accent text-white border-none p-[14px_40px] rounded-[30px] font-black cursor-pointer transition-all duration-300 text-[16px] hover:bg-accent-dark hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(228,41,58,0.3)] max-[600px]:w-full"
                            >
                                إرسال الاستفسار
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default Inquiries;