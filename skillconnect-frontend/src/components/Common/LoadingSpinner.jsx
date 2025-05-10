import React from "react";
import { CircularProgress } from "@mui/material";

const LoadingSpinner = ({ size = "medium" }) => {
  // Define size mappings for CircularProgress
  const sizes = {
    small: 24,  // MUI CircularProgress uses size in pixels
    medium: 40,
    large: 60,
  };

  return (
    <div className="flex justify-center items-center">
      <CircularProgress
        size={sizes[size]}  // Set size based on prop
        thickness={4}  // You can adjust the thickness of the spinner
        sx={{ color: "emerald", }}  // Adjust color if needed
      />
    </div>
  );
};

export default LoadingSpinner;
