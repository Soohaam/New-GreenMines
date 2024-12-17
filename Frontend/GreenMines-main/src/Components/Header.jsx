import React, { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Navbar from "./Navbar"

function Header() {
  const navigate = useNavigate();
  const ref = useRef(null);

  const fadeIn = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.5, ease: "easeInOut" },
  };

  const [videoOpacity, setVideoOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY; // Current scroll position
      const windowHeight = window.innerHeight; // Viewport height
      const fadeStart = windowHeight / 2; // Start fading at 50% scroll
      const fadeEnd = windowHeight; // Fully faded out after one full viewport height
      
      // Calculate new opacity (0 when fully faded, 1 when fully visible)
      const newOpacity = Math.max(
        0,
        1 - Math.max((scrollTop - fadeStart) / (fadeEnd - fadeStart), 0)
      );

      setVideoOpacity(newOpacity);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="from-[#71669b] to-[#746a9b] bg-gradient-to-b w-full min-h-screen px-4 sm:px-6 lg:px-10 overflow-x-hidden relative">
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{ opacity: videoOpacity }}
        className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300"
      >
        <source src="MyVideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col">
        <Navbar className="z-50" />
        <div className="flex-grow flex flex-col justify-center items-center px-4 sm:px-6 md:px-10 py-8 md:py-20">
          <motion.div
            ref={ref}
            initial="initial"
            animate="animate"
            variants={fadeIn}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white leading-tight mb-4 sm:mb-6">
              Tackling Climate Change with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#66C5CC] to-[#009688]">
                CARBON
              </span>{" "}
              Solutions
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 leading-relaxed mb-6 sm:mb-8">
              GREENMINES provides innovative solutions to reduce carbon emissions
              and promote sustainability. Join us in building a greener future.
            </p>

            <button
              onClick={() => {
                navigate("/dashboard")
                console.log("Button clicked!")
              }}
              className="rounded px-5 sm:px-7 py-2 sm:py-3 bg-[#009688] text-white relative group hover:bg-[#00796B] overflow-hidden tracking-wider text-sm sm:text-base md:text-lg w-full sm:w-auto"
            >
              Get Started now
            </button>
          </motion.div>
        </div>
      </div>
      
      <motion.button
        initial={{ 
          opacity: 0, 
          y: -50,
          scale: 0.5,
          rotateX: -180
        }}
        animate={{ 
          opacity: 1, 
          y: 0,
          scale: 1,
          rotateX: 0,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 10,
            delay: 0.3
          }
        }}
        whileHover={{
          scale: 1.1,
          rotate: [0, -5, 5, -5, 5, 0],
          transition: {
            duration: 0.4,
            type: "spring",
            stiffness: 300
          }
        }}
        whileTap={{ 
          scale: 0.95,
          boxShadow: "0px 0px 20px rgba(102, 197, 204, 0.6)"
        }}
        onClick={() => navigate("/login")}
        className="fixed top-4 right-4 sm:right-6 z-50 px-4 sm:px-6 py-2 sm:py-3 rounded-full 
          bg-gradient-to-r from-[#66C5CC] to-[#009688] 
          text-black font-bold text-sm sm:text-base 
          shadow-xl hover:shadow-2xl 
          transition-all duration-300 ease-in-out 
          flex items-center justify-center 
          overflow-hidden 
          group"
      >
        {/* Animated Gradient Border */}
        <motion.span
          initial={{ width: 0 }}
          animate={{ 
            width: '100%',
            transition: {
              delay: 0.6,
              duration: 0.8,
              type: "spring"
            }
          }}
          className="absolute inset-0 bg-gradient-to-r from-[#66C5CC] to-[#009688] opacity-20 group-hover:opacity-40 transition-all duration-300"
        />
        
        {/* Sparkle Effect */}
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0],
            rotate: [0, 360],
            transition: {
              delay: 0.7,
              duration: 1.5,
              repeat: Infinity
            }
          }}
          className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full opacity-70"
        />

        {/* Button Text with Hover Effect */}
        <motion.span
          initial={{ letterSpacing: '0px' }}
          whileHover={{ 
            letterSpacing: '1px',
            transition: { duration: 0.3 }
          }}
        >
          Sign In
        </motion.span>
      </motion.button>
    </div>
  )
}

export default Header

