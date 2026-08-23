import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * مكون كرت موحد للمشروع بأكمله
 * جميع الكروت بنفس الحجم والشكل
 */
export default function Card({
  id,
  title,
  image,
  fallbackImage = "assets/magazine/IMG_1325.webp",
  href,
  btnText = "عرض المزيد",
  onDelete,
  onEdit,
  editLink,
  className = "",
  aosDelay = "100",
  price,
  onButtonClick,
  onCardClick,
  imageOnly = false,
}) {
  const [src, setSrc] = useState(image || fallbackImage);

  if (imageOnly) {
    return (
      <div
        id={`card-${id}`}
        className={`w-full max-w-87.5 bg-[#f1f1f1] rounded-[30px] shadow-[0px_2px_4px_rgba(0,0,0,0.2)] relative overflow-hidden z-1 animate-card-fade-in hover:scale-[1.03] hover:shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:transition-all hover:duration-300 hover:z-10 min-h-[380px] max-h-[380px] max-[640px]:min-h-[300px] max-[640px]:max-h-[300px] ${className} ${onCardClick ? "cursor-pointer" : ""}`}
        data-aos="fade-up"
        data-aos-delay={aosDelay}
        onClick={onCardClick}
      >
        {href ? (
          <Link to={href} className="block w-full h-full">
            <img
              src={src}
              alt={title || "صورة"}
              loading="lazy"
              decoding="async"
              onError={() => {
                if (src !== fallbackImage) setSrc(fallbackImage);
              }}
              className="w-full h-full object-cover"
            />
          </Link>
        ) : (
          <div className="block w-full h-full">
            <img
              src={src}
              alt={title || "صورة"}
              loading="lazy"
              decoding="async"
              onError={() => {
                if (src !== fallbackImage) setSrc(fallbackImage);
              }}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    );
  }

  const buttonClass =
    "block w-full p-[8px_15px] bg-linear-to-b from-[#f56874] to-[#e429397e] text-black text-[13px] font-bold text-center rounded-[10px] border border-black transition-all duration-300 ease-in-out mt-1.25 hover:text-[#f7f5f5] m-0 max-[640px]:text-[12px] max-[640px]:p-[6px_10px]";

  return (
    <div
      id={`card-${id}`}
      className={`w-full max-w-87.5 bg-[#f1f1f1] rounded-[30px] shadow-[0px_2px_4px_rgba(0,0,0,0.2)] relative overflow-hidden z-1 flex flex-col animate-card-fade-in hover:scale-[1.03] hover:shadow-[0_10px_20px_rgba(0,0,0,0.15)] hover:transition-all hover:duration-300 hover:z-10 min-h-[380px] max-h-[380px] max-[640px]:min-h-[300px] max-[640px]:max-h-[300px] ${className} ${onCardClick ? "cursor-pointer" : ""}`}
      data-aos="fade-up"
      data-aos-delay={aosDelay}
      onClick={onCardClick}
    >
      {href ? (
        <Link to={href} className="block">
          <img
            src={src}
            alt={title || "صورة"}
            loading="lazy"
            decoding="async"
            onError={() => {
              if (src !== fallbackImage) setSrc(fallbackImage);
            }}
            className="w-full h-67.5 object-cover rounded-t-lg max-[640px]:h-45"
          />
        </Link>
      ) : (
        <div className="block">
          <img
            src={src}
            alt={title || "صورة"}
            loading="lazy"
            decoding="async"
            onError={() => {
              if (src !== fallbackImage) setSrc(fallbackImage);
            }}
            className="w-full h-67.5 object-cover rounded-t-lg max-[640px]:h-45"
          />
        </div>
      )}
      <div className="flex flex-col gap-1.25 flex-1 p-[10px_12px] overflow-hidden justify-center items-center text-center rtl">
        <h3
          className="text-[0.9rem] leading-[1.3] overflow-hidden font-bold min-h-[1.2em] max-h-[1.2em] mt-2 wrap-break-word max-[640px]:text-[0.8rem]"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
          }}
        >
          {title}
        </h3>
        {price && (
          <p className="text-accent font-bold text-[1.1rem] my-[5px_0]">
            {price}
          </p>
        )}
        <div className="mt-auto">
          {onButtonClick ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onButtonClick();
              }}
              className={`${buttonClass} cursor-pointer`}
            >
              {btnText}
            </button>
          ) : href ? (
            <Link to={href} className={buttonClass}>
              {btnText}
            </Link>
          ) : null}
          {(onDelete || onEdit || editLink) && (
            <div
              className="grid gap-1.25 mt-2 mb-2 w-full"
              style={{
                gridTemplateColumns: onDelete && (onEdit || editLink) ? "1fr 1fr" : "1fr",
              }}
            >
              {editLink && (
                <Link
                  to={editLink}
                  className="block w-full p-[8px_5px] bg-primary text-white text-[12px] font-bold text-center rounded-[10px] m-0"
                >
                  تعديل
                </Link>
              )}
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="block w-full p-[8px_5px] bg-primary text-white text-[12px] font-bold text-center rounded-[10px] m-0 border-none cursor-pointer"
                >
                  تعديل
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="block w-full p-[8px_10px] bg-accent text-white text-[12px] font-bold text-center rounded-[10px] m-0 border-none cursor-pointer"
                >
                  الحذف
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}