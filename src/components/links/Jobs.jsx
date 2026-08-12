import Header from "../common/Header.jsx";
import Footer from "../common/Footer.jsx";

function Jobs() {
    return (
        <>
            <Header />
            <div className="relative w-full h-100 flex justify-center items-center overflow-hidden mt-21.25 max-[600px]:mt-12.5 max-[600px]:h-50">
                <img src="assets/imge/0008.jpg" alt="hero-logo8" loading="lazy" className="absolute top-0 left-0 w-full h-full object-cover z-[-1]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent font-bold text-[70px] text-center w-[95%] max-[600px]:text-[28px]">
                    <p className="text-accent text-[5rem] drop-shadow-[2px_3px_9px_rgba(0,0,0,0.6)] max-[600px]:text-[2.5rem] max-[600px]:m-0">الوظائف</p>
                </div>
            </div>

            <div className="flex justify-center items-stretch p-[150px_5%_40px] max-w-225 mx-auto rtl max-[600px]:flex-col max-[600px]:p-[120px_20px_30px] max-[600px]:gap-2.5">
                <input
                    className="flex-1 p-[15px_25px] border-2 border-[#eee] rounded-r-[50px] border-l-0 text-[15px] outline-none transition-all duration-300 focus:border-accent max-[600px]:rounded-xl max-[600px]:border max-[600px]:p-[12px_20px] max-[600px]:h-12.5"
                    type="text"
                    placeholder="بحث"
                />
                <button className="p-[0_35px] bg-accent text-white border-none rounded-l-[50px] font-extrabold text-[16px] cursor-pointer transition-all duration-300 hover:bg-accent-dark max-[600px]:rounded-xl max-[600px]:border max-[600px]:p-[12px_20px] max-[600px]:h-12.5">
                    ابدأ البحث
                </button>
            </div>

            <div className="w-[90%] m-[120px_auto_40px] bg-white shadow-[0_15px_35px_rgba(0,0,0,0.1)] p-7.5 rounded-2xl">
                <h1 className="text-accent text-center p-5 text-[2.5rem]">الوظائف</h1>
                <p className="text-right leading-[1.8] mt-5 min-h-50 wrap-break-word overflow-x-hidden">لا يوجد حاليًا أي فرص عمل متاحة. سيتم تحديث هذه الصفحة عند توفر وظائف جديدة.</p>
            </div>
            <Footer />
        </>
    )
}

export default Jobs;