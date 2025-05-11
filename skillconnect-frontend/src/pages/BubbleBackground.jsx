import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";

const BubbleBackground = () => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const bubble = createBubble();
      setBubbles((prev) => [...prev, bubble]);

      // Optional: remove bubbles after animation duration to prevent memory leaks
      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== bubble.id));
      }, bubble.duration * 1000);
    }, 500); // create a new bubble every 500ms

    return () => clearInterval(interval);
  }, []);

  const createBubble = () => {
    const size = Math.random() * 60 + 20; // 20px - 80px
    const left = Math.random() * 100; // 0% - 100%
    const duration = Math.random() * 5 + 5; // 5s - 10s
    const opacity = Math.random() * 0.4 + 0.2; // 0.2 - 0.6

    return {
      id: Math.random(),
      size,
      left,
      duration,
      opacity,
    };
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        zIndex: -1,
        pointerEvents: "none",
      }}
    >
      {bubbles.map((bubble) => (
        <Box
          key={bubble.id}
          sx={{
            position: "absolute",
            bottom: 0,
            borderRadius: "50%",
            background: "linear-gradient(to bottom right, #81C784, #388E3C)", // Gradient effect
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            opacity: bubble.opacity,
            animation: `rise ${bubble.duration}s linear forwards`,
          }}
        />
      ))}

      <style>
        {`
          @keyframes rise {
            0% {
              transform: translateY(0);
              opacity: 1;
            }
            100% {
              transform: translateY(-100vh);
              opacity: 0;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default BubbleBackground;
