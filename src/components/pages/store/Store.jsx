import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";
import Scroll from "../../common/Scroll.jsx";
import Card from "../../common/Card.jsx";

const STORE_PRODUCTS = [
  { id: 1, image: "/assets/store&memberships/0011.webp", title: "شهادة مدرب معتمد", price: 735 },
  { id: 2, image: "/assets/store&memberships/0012.webp", title: "شهادة مركز معتمد", price: 1469 },
];

const FALLBACK_IMG = "/assets/imge/logo-iss-site.jpg.jpeg";

// دالة لإدارة السلة في localStorage
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("aiss_cart")) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("aiss_cart", JSON.stringify(cart));
}

export default function Store() {
  const [products] = useState(STORE_PRODUCTS);
  const [cartPopup, setCartPopup] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const addToCart = (product) => {
    const cart = getCart();
    // التحقق إذا المنتج موجود مسبقاً
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    saveCart(cart);
    // إظهار النافذة المنبثقة في كل مرة
    setCartPopup({ ...product, quantity: existing ? existing.quantity : 1 });
  };

  const closePopup = () => {
    setCartPopup(null);
  };

  return (
    <>
      <Header />
      <div className="page-hero">
        <img src="/assets/imge/0005.jpg" alt="store-pic" loading="lazy" className="page-hero-bg" />
        <div className="logo-text">
          <p className="page-hero-title">المتجر</p>
        </div>
      </div>
      <main className="page-content">

        {/* نافذة منبثقة عند الإضافة للسلة */}
        {cartPopup && (
          <div className="fixed top-30 left-5 w-75 bg-white shadow-[0_5px_15px_rgba(0,0,0,0.2)] rounded-lg z-10001 p-3.75 transition-[0.3s_ease] block">
            <span className="cursor-pointer float-right text-[20px]" onClick={closePopup}>&times;</span>
            <div className="flex items-center gap-2.5">
              <img
                src={cartPopup.image}
                alt={cartPopup.title}
                className="w-15 h-15 p-1.25 object-cover rounded-[5px]"
                onError={(e) => { e.target.src = FALLBACK_IMG; }}
              />
              <div>
                <p className="font-bold m-[0_0_5px]">{cartPopup.title}</p>
                <p className="text-accent font-bold m-0">
                  {cartPopup.price} د.ا
                </p>
              </div>
            </div>
            <p className="text-center text-[#2e7d32] font-bold my-[10px_0]">
              ✅ تم الإضافة إلى السلة بنجاح
            </p>
            <div className="flex gap-2.5">
              <Link
                to="/store/view"
                className="flex-1 text-center p-3.75 bg-primary text-white rounded-lg no-underline text-[14px] font-bold"
              >
                🛒 عرض السلة
              </Link>
              <button
                className="btn-checkout flex-1 p-3.75 bg-accent text-white border-none rounded-lg cursor-pointer text-[14px] font-bold"
                onClick={closePopup}
              >
                متابعة التسوق
              </button>
            </div>
          </div>
        )}

        <div className="section-title-bar">
          <p>منتجات المتجر</p>
        </div>

        <div className="cards-grid gap-10.5">
          {products.map((item) => (
            <Card
              key={item.id}
              id={item.id}
              title={item.title}
              image={item.image}
              fallbackImage={FALLBACK_IMG}
              btnText="إضافة للسلة"
              price={`${item.price} د.ا`}
              onButtonClick={() => addToCart(item)}
            />
          ))}
        </div>
      </main>
      <Scroll />
      <Footer />
    </>
  );
}