import React, { useRef } from "react";
import CarouselClients from "./CarouselClients";
import { motion, useInView } from "framer-motion";

function Clients() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });

  return (
    <div>
      <div className="bg-[#231E3D] pt-14 lg:px-28 px-10 pb-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 200 }} // Start from further down (y: 200)
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 200 }}
          transition={{ duration: 1.2, ease: "easeOut" }} // Increase duration for more visible fading
        >
          <h1 className="lg:text-3xl text-white text-center text-3xl font-semibold whitespace-nowrap">
            Feedback/Review
          </h1>

          <CarouselClients />
        </motion.div>
      </div>
    </div>
  );
}

export default Clients;
