import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";
import Scroll from "../../common/Scroll.jsx";

const FALLBACK_IMG = "/assets/imge/logo-iss-site.jpg.jpeg";

export default function View() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("معرّف المنتج غير موجود");
      setLoading(false);
      return;
    }

    fetch(`/api/certificate-types/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("فشل في جلب بيانات المنتج");
        }
        return res.json();
      })
      .then((data) => {
        const item = data.certificate_type || data;
        setProduct({
          id: item.id,
          title: item.name,
          price: item.price,
          description: item.description || "",
          is_active: item.is_active,
          image:
            item.id === 1
              ? "/assets/store&memberships/0011.webp"
              : "/assets/store&memberships/0012.webp",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setError(err.message || "حدث خطأ أثناء جلب البيانات");
        setLoading(false);
      });
  }, [id]);

  const requestCertificate = () => {
    if (!product) return;
    localStorage.setItem("certificateType", String(product.id));
    localStorage.setItem("orderTotal", String(product.price));
    navigate("/store/payment");
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="page-content" style={{ paddingTop: "120px", minHeight: "100vh" }}>
          <div className="flex justify-center items-center p-[100px_20px]">
            <p className="text-[18px] font-bold text-primary">جاري تحميل بيانات المنتج...</p>
          </div>
        </main>
        <Scroll />
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <main className="page-content" style={{ paddingTop: "120px", minHeight: "100vh" }}>
          <div className="flex justify-center items-center p-[100px_20px] bg-white text-center">
            <div className="max-w-150">
              <h2 className="text-[2rem] text-[#333] font-bold mb-5">تعذر العثور على المنتج</h2>
              <p className="text-[1rem] text-[#777] leading-[1.8] mb-10">{error || "المنتج غير موجود"}</p>
              <Link to="/store" className="inline-block bg-accent text-white p-[12px_30px] no-underline rounded-[5px] font-bold transition-[0.3s] hover:bg-accent-dark hover:shadow-[0_4px_10px_rgba(0,0,0,0.1)]">العودة للمتجر</Link>
            </div>
          </div>
        </main>
        <Scroll />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="page-content" style={{ paddingTop: "220px", minHeight: "150vh" }}>
        <div className="w-[min(900px,95%)] mx-auto bg-white border border-[rgba(0,0,0,0.06)] rounded-2xl p-6 sm:p-8 shadow-[0_10px_25px_rgba(0,0,0,0.06)]">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* صورة المنتج */}
            <div className="w-full md:w-80 shrink-0">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-80 object-cover rounded-xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = FALLBACK_IMG;
                }}
              />
            </div>

            {/* تفاصيل المنتج */}
            <div className="flex-1 min-w-0">
              <h1 className="text-[1.8rem] font-extrabold text-[#111] mb-4">{product.title}</h1>

              <p className="text-[1.4rem] text-accent font-extrabold mb-6">{product.price} د.ا</p>

              {product.description && (
                <div className="mb-6">
                  <h3 className="text-[1.1rem] font-bold text-primary mb-2">الوصف</h3>
                  <p className="text-[1rem] text-[#555] leading-[1.9] whitespace-pre-wrap">{product.description}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 items-center mt-8 pt-6 border-t border-[rgba(0,0,0,0.06)]">
                <button
                  type="button"
                  onClick={requestCertificate}
                  className="bg-accent text-white p-[12px_30px] rounded-xl font-bold border-none cursor-pointer transition-[0.3s] hover:bg-accent-dark hover:shadow-[0_4px_10px_rgba(0,0,0,0.1)]"
                >
                  طلب شهادة
                </button>

                <Link
                  to="/store"
                  className="inline-block bg-[#f1f5f9] text-primary p-[12px_30px] no-underline rounded-xl font-bold text-center transition-[0.3s] hover:bg-[#e2e8f0] hover:text-accent"
                >
                  العودة للمتجر
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Scroll />
      <Footer />
    </>
  );
}