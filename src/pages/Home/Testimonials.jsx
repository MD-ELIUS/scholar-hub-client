import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { motion } from "framer-motion";
import { IoStar } from "react-icons/io5";
import { FaQuoteLeft } from "react-icons/fa";
import { GiFairyWings } from "react-icons/gi";

const testimonials = [
    {
        name: "John Doe",
        role: "MSc Computer Science",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        message: "ScholarHub helped me find the perfect scholarship for my studies. The filtering system is intuitive and the application tracking kept me organized throughout."
    },
    {
        name: "Jane Smith",
        role: "MBA at Harvard",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        message: "I secured full funding through this platform's amazing resources. The essay guidance and interview tips were essential for my successful Ivy League application."
    },
    {
        name: "Ali Rahman",
        role: "PhD Physics",
        image: "https://randomuser.me/api/portraits/men/86.jpg",
        message: "Applying to international programs became simple and stress-free. I never thought I could manage so many applications, but this tool made it all possible for me."
    },
    {
        name: "Sarah Jones",
        role: "MA History",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        message: "A fantastic resource for discovering new opportunities! I found several scholarships I didn't know existed. The user interface is clean and very easy to navigate."
    }
];

const Testimonials = () => {
    return (
        <>
            <div className="w-11/12 mx-auto my-14">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary text-center mb-8 flex justify-center items-center gap-3 md:gap-5"
                >
                    <GiFairyWings className="text-secondary mt-1" />
                    Success Stories
                </motion.h2>

                <div className="testimonial-container relative">
                    <Swiper
                        modules={[Autoplay, Pagination, Navigation]}
                        spaceBetween={24}
                        slidesPerView={1}
                        breakpoints={{
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        loop
                        autoplay={{ delay: 6000, disableOnInteraction: false }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        /* Increased pb-12 to ensure room for pagination on mobile */
                        className="!pb-12 !overflow-hidden px-2"
                    >
                        {testimonials.map((item, idx) => (
                            <SwiperSlide key={idx} className="flex">
                                <motion.div
                                    className="bg-white p-8 rounded-bl-2xl rounded-tr-2xl shadow-lg border border-secondary/70
                                    h-full flex flex-col relative group hover:shadow-xl transition-shadow duration-300 "
                                >
                                    <FaQuoteLeft className="text-primary/10 text-6xl absolute top-6 right-4 md:right-6" />

                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 p-1 flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-full" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-primary transition-colors">{item.name}</h3>
                                            <p className="text-sm text-gray-500">{item.role}</p>
                                        </div>
                                    </div>

                                    <div className="flex mb-4 text-yellow-400 text-lg">
                                        <IoStar /><IoStar /><IoStar /><IoStar /><IoStar />
                                    </div>

                                    <p className="text-gray-600 leading-relaxed italic line-clamp-4 ">
                                        "{item.message}"
                                    </p>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .testimonial-container .swiper-pagination {
                  bottom:  !important;
                  left: 0 !important;
                  right: 0 !important;
                  width: 100% !important;
                  margin: 0 auto !important;
                  display: flex !important;
                  justify-content: center !important;
                  align-items: center !important;
                }

                /* Fixes dynamic bullets shifting to the left on small screens */
                .testimonial-container .swiper-pagination-bullets-dynamic {
                    left: 50% !important;
                    transform: translateX(-50%) !important;
                    white-space: nowrap !important;
                }

                .swiper-pagination-bullet {
                  background: #ccc !important;
                  opacity: 1 !important;
                }

                .swiper-pagination-bullet-active {
                  background: #008080 !important; 
                  width: 12px !important;
                  height: 12px !important;
                }
              `}} />
        </>
    );
};

export default Testimonials;