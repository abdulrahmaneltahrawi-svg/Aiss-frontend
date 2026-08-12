import { useEffect, useState } from "react";

function Scroll() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {show && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-17 right-6 w-12 h-12 bg-accent border-amber-50 text-white rounded-full shadow-lg hover:bg-[#941c1c] transition duration-300 z-50"
        >
          &#8679;
        </button>
      )}
    </>
  );
}

export default Scroll;