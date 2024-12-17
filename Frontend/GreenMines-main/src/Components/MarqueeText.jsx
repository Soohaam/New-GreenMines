"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function MovingText({
  text,
  fontSize = 48,
  outlineColor = "black",
  fillColor = "blue",
  duration = 10,
}) {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (event) => {
      setCursorPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="relative overflow-hidden bg-[#342F49] w-full h-30 flex items-center"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Custom glowing cursor */}
      {isHovering && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            top: cursorPosition.y - 10,
            left: cursorPosition.x - 10,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${fillColor} 0%, rgba(0,0,0,0) 70%)`,
          }}
          animate={{
            scale: 1.5,
            opacity: 0.8,
          }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
        />
      )}

      <motion.svg
        className="whitespace-nowrap"
        initial={{ x: "100%" }}
        animate={{ x: "-100%" }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: duration,
          ease: "linear",
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <motion.text
          x="0"
          y="50%"
          dominantBaseline="middle"
          textAnchor="start"
          fontSize={fontSize}
          fontWeight="bold"
          stroke={outlineColor}
          strokeWidth="2"
          // Shadow filter
          filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.3))"
          // Animate entire text fill with shadow
          animate={{
            fill: isHovering ? fillColor : "transparent",
            fillOpacity: isHovering ? 1 : 0,
            filter: isHovering 
              ? "drop-shadow(0px 6px 8px rgba(0,0,0,1))" 
              : "drop-shadow(0px 4px 6px rgba(0,0,0,0.3))",
            transition: {
              duration: 0.7,
              ease: "easeInOut"
            }
          }}
        >
          {text}
        </motion.text>
      </motion.svg>
    </div>
  );
}