import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

const LoadingPage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="100%"
      height="100vh"
      bgcolor="emerald.50"
      p={4}
      borderRadius={2}
      boxShadow={3}
    >
      {/* Skill Share logo/text */}
      <Box mb={4} textAlign="center">
        <Typography variant="h4" fontWeight="bold" color="emerald.600">
          Skill
          <span style={{ color: '#48bb78' }}>Share</span>
        </Typography>
        <Typography variant="body2" color="textSecondary" mt={1}>
          Loading your learning experience
        </Typography>
      </Box>

      {/* Spinner animation */}
      <Box position="relative" height={64} width={64} mb={3}>
        {/* Outer spinning circle */}
        <CircularProgress
          size={64}
          thickness={4}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            color: "emerald.200",
            animation: "spin 1s linear infinite",
          }}
        />

        {/* Inner spinning circle (counter direction) */}
        <CircularProgress
          size={64}
          thickness={4}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            color: "green.100",
            animation: "spin 1s reverse infinite",
          }}
        />

        {/* Center dot */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          bgcolor="emerald.600"
          width={12}
          height={12}
          borderRadius="50%"
        />
      </Box>

      {/* Animated dots */}
      <Box display="flex" justifyContent="center" mt={2}>
        <Box
          width={8}
          height={8}
          bgcolor="green.500"
          borderRadius="50%"
          animation="bounce 1.5s infinite"
          sx={{ animationDelay: "0ms" }}
        />
        <Box
          width={8}
          height={8}
          bgcolor="green.500"
          borderRadius="50%"
          animation="bounce 1.5s infinite"
          sx={{ animationDelay: "150ms" }}
        />
        <Box
          width={8}
          height={8}
          bgcolor="green.500"
          borderRadius="50%"
          animation="bounce 1.5s infinite"
          sx={{ animationDelay: "300ms" }}
        />
      </Box>
    </Box>
  );
};

export default LoadingPage;
