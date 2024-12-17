import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '0px' });

  return (
    <div className="bg-[#211D32] lg:px-28 px-10 pt-14 pb-10" id="experience">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Animate Image */}
        <motion.div
          ref={ref}
          className="flex items-center justify-center"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <img
            src="https://zesty-cajeta-af510d.netlify.app/employee.svg"
            alt="Employee Experiencing Digital World"
            className="w-auto h-[300px] object-contain rounded-lg shadow-lg"
          />
        </motion.div>

        {/* Animate Text and Button */}
        <motion.div
          className="flex flex-col justify-center text-center lg:text-left"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          <div className="w-36 h-2 bg-gradient-to-r from-[#7361F2] to-[#BD4FF1] mb-6 rounded-full mx-auto lg:mx-0"></div>
          <h1 className="font-semibold text-white text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-6 leading-tight">
            Get an amazing experience with our top-quality team.
          </h1>
          <p className="text-white text-lg mb-6">
            Discover how our expertise and commitment can enhance your business experience. We deliver excellence with every project.
          </p>
          <motion.button
            className="relative inline-block px-1 py-4 bg-[#6366F1] text-white font-semibold rounded-lg overflow-hidden group transition-transform transform hover:scale-105 hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="absolute inset-0 bg-[#5558ff] transition-transform duration-300 ease-in-out transform -translate-x-full group-hover:translate-x-0"></span>
            <span className="relative z-10">Learn More</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default Experience;
