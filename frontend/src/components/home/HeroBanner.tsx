import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  Navigation,
  Pagination,
  EffectFade,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

type SlidePosition = "left" | "right";

interface Slide {
  id: number;
  image: string;
  mobileImage: string;
  label: string;
  title: string;
  button: string;
  link: string;
  position: SlidePosition;
}

const slides: Slide[] = [
  {
    id: 1,
    image: "/images/hero/BanerHero2.png",
    mobileImage:
      "/images/migrated/12_s31_900x_8f09b4d4-6d08-410a-b6c2-5f291c6eb648.webp",
    label: "NEW SKINCARE ARRIVAL",
    title: "SKIN'S NATURAL\nRADIANCE.",
    button: "SHOP SKIN CARE",
    link: "/shop/category/skincare",
    position: "right", // content left side
  },
  {
    id: 2,
    image: "/images/hero/BHero12.png",
    mobileImage:
      "/images/migrated/14_s32_900x_8acd0d58-b6ff-42e4-9796-69f7e92d8ef7.jpg",
    label: "NEW SKINCARE ARRIVAL",
    title: "Your Glow\nStarts Here.",
    button: "SHOP CREAM",
    link: "/shop/category/serum-cream",
    position: "left", // content right side
  },
];

export default function HeroBanner() {
  return (
    // h-[100dvh] fixes mobile browsers where h-screen (100vh) gets cut off
    // by the address bar / bottom nav. min-h-screen is a safe fallback.
    <section className="relative w-full h-[100dvh] min-h-screen overflow-hidden bg-black">
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        effect="fade"
        loop={true}
        speed={1200}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation={{
          prevEl: ".hero-prev",
          nextEl: ".hero-next",
        }}
        pagination={{
          clickable: true,
        }}
        className="w-full h-full"
      >
        {slides.map((slide: Slide, index: number) => {
          const isLeft = slide.position === "left";

          return (
            <SwiperSlide key={slide.id}>
              {/* Fixed height wrapper so absolute image always has a box to fill */}
              <div className="relative w-full h-full">

                {/* Full Background Image */}
                <picture className="absolute inset-0 block w-full h-full">
                  <source
                    media="(max-width: 768px)"
                    srcSet={slide.mobileImage}
                  />
                  <img
                    src={slide.image}
                    alt={slide.title.replace("\n", " ")}
                    className="w-full h-full object-cover object-center"
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    draggable={false}
                  />
                </picture>

                {/* Gradient overlay - direction follows content side */}
                <div
                  className={`absolute inset-0 bg-gradient-to-${
                    isLeft ? "r" : "l"
                  } from-black/60 via-black/20 to-transparent`}
                ></div>

                {/* Content - left or right depending on slide position */}
                <div
                  className={`absolute inset-0 z-20 flex items-center ${
                    isLeft ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[650px] px-8 ${
                      isLeft ? "lg:pl-28 text-left" : "lg:pr-48 text-right"
                    } text-white`}
                  >

                    <div
                      className={`flex items-center gap-4 mb-5 ${
                        isLeft ? "justify-start" : "justify-end"
                      }`}
                    >
                      <span className="uppercase tracking-[4px] text-xs font-semibold drop-shadow-md">
                        {slide.label}
                      </span>
                      <span className="w-12 h-px bg-white/40"></span>
                    </div>

                    <div
                      className={`flex mb-5 ${
                        isLeft ? "justify-start" : "justify-end"
                      }`}
                    >
                      ✦
                    </div>

                    <h1 className="whitespace-pre-line font-serif font-bold leading-[1.2] text-[45px] md:text-[65px] lg:text-[80px] drop-shadow-md">
                      {slide.title}
                    </h1>

                    <Link
                      to={slide.link}
                      className="inline-block mt-10 bg-white text-black border border-white px-12 py-4 uppercase tracking-[3px] text-sm font-semibold transition-all duration-300 hover:bg-transparent hover:text-white"
                    >
                      {slide.button}
                    </Link>
                  </div>
                </div>

              </div>
            </SwiperSlide>
          );
        })}

        {/* Left Arrow */}
        <button className="hero-prev absolute left-6 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full bg-white/20 text-white hover:bg-white/40 transition">
          ❮
        </button>

        {/* Right Arrow */}
        <button className="hero-next absolute right-6 top-1/2 -translate-y-1/2 z-30 h-12 w-12 rounded-full bg-white/20 text-white hover:bg-white/40 transition">
          ❯
        </button>
      </Swiper>
    </section>
  );
}