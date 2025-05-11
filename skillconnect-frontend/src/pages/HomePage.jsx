import React, { useState, useEffect } from "react";
import { Box, AppBar, Tabs, Tab, Paper } from "@mui/material";
import HomeHeader from "../components/HomeHeader";
import PostContainer from "../components/PostContainer";
import LearningProgressContainer from "../components/LearningProgress/LearningProgressContainer";

const BubbleBackground = () => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    const initialBubbles = Array.from({ length: 15 }, () => createBubble());
    setBubbles(initialBubbles);

    const interval = setInterval(() => {
      setBubbles((prevBubbles) =>
        prevBubbles.map((bubble) => {
          const newY = bubble.y - bubble.speed;
          if (newY < -100) return createBubble(true);
          return {
            ...bubble,
            y: newY,
            x: bubble.x + Math.sin(newY * 0.05) * bubble.wobble,
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const createBubble = (atBottom = false) => {
    const viewportWidth = window.innerWidth;
    return {
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * viewportWidth,
      y: atBottom
        ? window.innerHeight + Math.random() * 100
        : Math.random() * window.innerHeight,
      size: Math.random() * 40 + 10,
      opacity: Math.random() * 0.2 + 0.05,
      speed: Math.random() * 2 + 0.5,
      wobble: Math.random() * 1.5,
    };
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      {bubbles.map((bubble) => (
        <Box
          key={bubble.id}
          sx={{
            position: "absolute",
            borderRadius: "50%",
            background: "linear-gradient(to bottom right, #4ade80, #16a34a)",
            left: `${bubble.x}px`,
            top: `${bubble.y}px`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            opacity: bubble.opacity,
            transform: `scale(${1 + Math.sin(bubble.y * 0.01) * 0.1})`,
          }}
        />
      ))}
    </Box>
  );
};

const HomePage = () => {
  const [activeKey, setActiveKey] = useState("Posts");

  const handleTabChange = (event, newValue) => {
    setActiveKey(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #a7f3d0, #f3e8ff)",
      }}
    >
      <BubbleBackground />

      {/* HomeHeader inserted here */}
      <HomeHeader
        activeKey={activeKey}
        onKeyChange={(key) => setActiveKey(key)}
      />


      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          position: "relative",
          zIndex: 10,
          padding: 6,
        }}
      >
        <Paper
          sx={{
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(10px)",
            borderRadius: 2,
            padding: 2,
            width: '100%', // or '80%', '600px', etc.
            maxWidth: '800px', // limits max size on large screens
            margin: '0 auto', // center horizontally
          }}
          elevation={3}
        >
          {activeKey === "Posts" && <PostContainer />}
          {activeKey === "LearningProgress" && <LearningProgressContainer />}
        </Paper>

      </Box>
    </Box>
  );
};

export default HomePage;
