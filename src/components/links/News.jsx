import Header from "../common/Header.jsx";
import Footer from "../common/Footer.jsx";

function News() {
    return (
        <>
            <Header />
            <div className="relative w-full h-100 flex justify-center items-center overflow-hidden mt-21.25 max-[600px]:mt-12.5 max-[600px]:h-50">
                <img src="assets/imge/0008.jpg" alt="hero-logo8" loading="lazy" className="absolute top-0 left-0 w-full h-full object-cover z-[-1]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent font-bold text-[70px] text-center w-[95%] max-[600px]:text-[28px]">
                    <p className="text-accent text-[5rem] drop-shadow-[2px_3px_9px_rgba(0,0,0,0.6)] max-[600px]:text-[2.5rem] max-[600px]:m-0">النشرات الاخبارية</p>
                </div>
            </div>
            <main className="page-content">
                <div className="w-[90%] m-[120px_auto_40px] bg-white shadow-[0_15px_35px_rgba(0,0,0,0.1)] p-7.5 rounded-2x1">
                    <h1 className="text-accent text-center p-5 text-[2.5rem]">النشرات الإخبارية</h1>
                    <div className="text-right leading-[1.8] mt-5 min-h-50 wrap-break-word overflow-x-hidden">
                        <p>هذه صفحة النشرات الإخبارية.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
export default News;