import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../common/Header.jsx";
import Footer from "../../common/Footer.jsx";
import Scroll from "../../common/Scroll.jsx";
import Card from "../../common/Card.jsx";

const FALLBACK_IMG = "/assets/imge/logo-iss-site.jpg.jpeg";

export default function Store() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    fetch("/api/certificate-types")
      .then((res) => {
        if (!res.ok) {
          throw new Error("فشل في جلب أنواع الشهادات");
        }

        return res.json();
      })
      .then((data) => {
        console.log("Certificate Types:", data);

        setProducts(
          data.certificate_types.map((item) => ({
            id: item.id,
            title: item.name,
            price: item.price,
            image:
              item.id === 1
                ? "/assets/store&memberships/0011.webp"
                : "/assets/store&memberships/0012.webp",
          }))
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const viewProduct = (product) => {
    navigate(`/store/view/${product.id}`);
  };

  const requestCertificate = (product) => {
    localStorage.setItem("certificateType", String(product.id));
    localStorage.setItem("orderTotal", String(product.price));

    navigate("/store/payment");
  };

  return (
    <>
      <Header />

      <div className="page-hero">
        <img
          src="/assets/imge/0005.jpg"
          alt="store-pic"
          loading="lazy"
          className="page-hero-bg"
        />

        <div className="logo-text">
          <p className="page-hero-title">المتجر</p>
        </div>
      </div>

      <main className="page-content">
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
              btnText="طلب شهادة"
              price={`${item.price} د.ا`}
              onButtonClick={() => requestCertificate(item)}
              onCardClick={() => viewProduct(item)}
            />
          ))}
        </div>
      </main>

      <Scroll />
      <Footer />
    </>
  );
}