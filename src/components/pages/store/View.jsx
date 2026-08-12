import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";
import Scroll from "../../common/Scroll.jsx";

export default function View() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const loadCart = () => {
    try {
      return JSON.parse(localStorage.getItem("aiss_cart")) || [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    setCart(loadCart());
  }, []);

  const formatPrice = (value) => {
    const n = Number(value);
    if (Number.isFinite(n)) return n + " د.ا";
    return value ? value + " د.ا" : "";
  };

  const calcTotal = (items) => {
    return items.reduce((sum, it) => sum + (Number(it.price) || 0) * (it.quantity || 1), 0);
  };

  const removeFromCart = (index) => {
    const updated = cart.filter((_, i) => i !== index);
    setCart(updated);
    localStorage.setItem("aiss_cart", JSON.stringify(updated));
  };

  const goToCheckout = () => {
    const total = calcTotal(cart);
    localStorage.setItem("orderTotal", total);
    navigate("/store/payment");
  };

  const getImageSrc = (item) => {
    const src = item.image || item.img || "";
    if (!src) return "";
    if (src.startsWith("http") || src.startsWith("/")) return src;
    return "/" + src;
  };

  return (
    <>
      <Header />
      <main className="page-content" style={{ paddingTop: "120px", minHeight: "100vh" }}>
        {cart.length === 0 ? (
          <div className="flex justify-center items-center p-[100px_20px] bg-white text-center">
            <div className="max-w-150">
              <div className="mb-7.5 opacity-20">
                <img src="/assets/imge/empty.webp" alt="سلة فارغة" loading="lazy" className="w-30 h-auto" />
              </div>
              <h2 className="text-[2rem] text-[#333] font-bold mb-5">سلة مشترياتك فارغة حالياً.</h2>
              <p className="text-[1rem] text-[#777] leading-[1.8] mb-10">
                قبل متابعة عملية الدفع، يجب عليك إضافة بعض المنتجات إلى سلة التسوق الخاصة بك.<br />
                ستجد الكثير من المنتجات المثيرة للاهتمام على صفحة "المتجر" الخاصة بنا.
              </p>
              <Link to="/store" className="inline-block bg-accent text-white p-[12px_30px] no-underline rounded-[5px] font-bold transition-[0.3s] hover:bg-accent-dark hover:shadow-[0_4px_10px_rgba(0,0,0,0.1)]">العودة للمتجر</Link>
            </div>
          </div>
        ) : (
          <>
            <div id="cart-items" className="grid grid-cols-[repeat(auto-fit,270px)] gap-7 p-[40px_5%] justify-center justify-items-center max-w-350 mx-auto flex-col" style={{ paddingTop: "20px", display: "flex" }}>
              {[...cart].reverse().map((item, reversedIdx) => {
                const originalIdx = cart.length - 1 - reversedIdx;
                const imgSrc = getImageSrc(item);
                return (
                  <div className="w-[min(900px,95%)] bg-white border border-[rgba(0,0,0,0.06)] rounded-2xl p-5 flex items-center justify-between mb-7 mx-auto shadow-[0_10px_25px_rgba(0,0,0,0.06)]" key={originalIdx}>
                    <div className="">
                      <img
                        src={imgSrc}
                        alt={item.title || "منتج"}
                        className="w-30 h-30 object-cover rounded-xl block ml-5"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/assets/imge/logo-iss-site.jpg.jpeg";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[16px] mb-2 text-[#111]">{item.title || ""}</h3>
                      <p className="text-[16px] text-accent font-extrabold">{formatPrice(item.price)}</p>
                      {item.quantity > 1 && <p className="text-[14px] text-[#666] mt-1">الكمية: {item.quantity}</p>}
                    </div>
                    <div className="">
                      <button className="bg-[rgba(228,41,58,0.1)] text-accent border border-[rgba(228,41,58,0.25)] p-[10px_14px] rounded-xl font-bold cursor-pointer transition-[0.2s_ease] hover:bg-[rgba(228,41,58,0.16)]" type="button" onClick={() => removeFromCart(originalIdx)}>حذف</button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="w-[min(900px,95%)] mx-auto my-[20px_auto_40px] flex items-center justify-between gap-2 px-5">
              <h3 className="font-extrabold text-[20px]" id="cart-total">الإجمالي: {calcTotal(cart)} د.ا</h3>
              <button className="bg-accent text-white p-[12px_18px] rounded-xl font-extrabold border-none inline-block hover:brightness-95" id="go-to-checkout" type="button" onClick={goToCheckout}>إتمام الطلب</button>
            </div>
          </>
        )}
      </main>
      <Scroll />
      <Footer />
    </>
  );
}