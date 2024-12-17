import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Carousel from './CarouselDemo';

function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '0px' });

  // Animation variants for fade-in effect
  const fadeIn = {
    initial: { opacity: 0, y: 50 },
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 },
    transition: { duration: 0.8, ease: 'easeOut' }
  };

  return (
    <>
      <div className="bg-[#231E3D] pt-14 lg:px-28 px-10 pb-10" id="projects">
        <div className="grid lg:grid-cols-2 grid-cols-1 xl:gap-[51rem] lg:gap-[31rem]">
          <motion.div ref={ref} {...fadeIn}>
            {/* Your content here */}
          </motion.div>
        </div>
      </div>

      {/* Carousel Component */}
      <Carousel />
      {/*Carousel*/}
    </>
  );
  
}

export default Projects;
