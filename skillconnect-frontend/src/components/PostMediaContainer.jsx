import React, { useEffect, useState } from "react";
import { Box, Button, IconButton, CircularProgress } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

const PostMediaCarousel = ({ post }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mediaTypes, setMediaTypes] = useState([]);

  useEffect(() => {
    setMediaTypes(post.mediaTypes);
  }, [post]);

  if (!mediaTypes || mediaTypes.length === 0) {
    return <Box />;
  }

  const totalItems = mediaTypes.length;

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const currentMedia = mediaTypes[currentIndex];

  return (
    <Box className="relative w-full">
      {/* Main carousel container */}
      <Box className="relative w-full h-96 bg-gray-100 overflow-hidden rounded-lg">
        {/* Media item */}
        <Box className="w-full h-full flex items-center justify-center">
          {currentMedia.type === "image" ? (
            <img
              src={currentMedia.url}
              alt={`Post media ${currentIndex}`}
              className="w-full h-full object-contain"
            />
          ) : (
            <video
              src={currentMedia.url}
              controls
              className="w-full h-full object-contain"
            />
          )}
        </Box>

        {/* Navigation arrows - only show if there's more than one item */}
        {totalItems > 1 && (
          <>
            <IconButton
              onClick={goToPrev}
              sx={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
              }}
            >
              <ArrowBack />
            </IconButton>

            <IconButton
              onClick={goToNext}
              sx={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
              }}
            >
              <ArrowForward />
            </IconButton>
          </>
        )}
      </Box>

      {/* Indicators for multiple items */}
      {totalItems > 1 && (
        <Box className="flex justify-center mt-2 space-x-2">
          {mediaTypes.map((_, index) => (
            <Button
              key={index}
              onClick={() => goToSlide(index)}
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: currentIndex === index ? "emerald.main" : "grey.300",
                "&:hover": {
                  backgroundColor: currentIndex === index ? "emerald.dark" : "grey.400",
                },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PostMediaCarousel;
