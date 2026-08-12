function Flag() {
    return (
        <div className="fixed top-21 right-72.5 md:top-42.75 md:right-25 z-1001">
            <img
                className="relative z-1002 w-[7 8px] md:w-35 animate-[spin_20s_linear_infinite_reverse]"
                src="assets/imge/cropped_circle_image (2) (1).png"
                alt="شعار دوار"
                loading="lazy"
            />
            <img
                className="absolute top-[40%] md:top-[43%] left-[47%] -translate-x-1/2 -translate-y-1/2 w-67 md:w-70 z-1001 pointer-events-none"
                src="assets/imge/Aiss-flags.png"
                alt="شعار ثابت"
            />
        </div>
    )
}
